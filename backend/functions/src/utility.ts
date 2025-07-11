// @/functions/src/utility.ts
import {onRequest} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import { calculateIndividualSignalScore } from "./signalProcessor";
import { RawSignalData } from "./types";

export const buildBuffersFromCache = onRequest({timeoutSeconds: 540, memory: "1GiB"}, async (req, res) => {
  const TARGET_COLLECTION = "sinal_buffers";
  const MAX_BUFFER_SIZE = 100;

  logger.info(`Iniciando construção de buffers para a coleção: ${TARGET_COLLECTION}`);

  try {
    const db = admin.firestore();
    const sourceSnapshot = await db.collection("sinais_processados_historico").get();

    if (sourceSnapshot.empty) {
      const emptyMsg = "A coleção de origem 'sinais_processados_historico' está vazia.";
      logger.warn(emptyMsg);
      res.status(404).send(emptyMsg);
      return;
    }

    const allSignals = sourceSnapshot.docs.map((doc) => doc.data());
    logger.info(`Total de ${allSignals.length} documentos lidos da coleção de origem.`);

    const signalsByAsset: { [key: string]: RawSignalData[] } = {};
    allSignals.forEach(signal => {
        const docId = `${signal.ticker}_${signal.timeframe}`;
        if (!signalsByAsset[docId]) {
            signalsByAsset[docId] = [];
        }
        signalsByAsset[docId].push(signal as RawSignalData);
    });
    
    const writePromises: Promise<admin.firestore.WriteResult>[] = [];

    for (const docId in signalsByAsset) {
      // ADICIONANDO A VERIFICAÇÃO DE SEGURANÇA EXIGIDA PELO LINTER
      if (Object.prototype.hasOwnProperty.call(signalsByAsset, docId)) {
        const sortedSignals = signalsByAsset[docId].sort((a, b) => 
            new Date(a.receivedAt || 0).getTime() - new Date(b.receivedAt || 0).getTime()
        );

        const bufferWithScores = sortedSignals.map(signal => {
            const individualScore = calculateIndividualSignalScore(signal);
            return {
                ...signal,
                individualScore: parseFloat(individualScore.toFixed(4)),
                receivedAt: signal.receivedAt || new Date().toISOString()
            };
        });

        const finalBuffer = bufferWithScores.slice(-MAX_BUFFER_SIZE);
        const bufferRef = db.collection(TARGET_COLLECTION).doc(docId);
        writePromises.push(bufferRef.set({ signals: finalBuffer }, { merge: true }));
      }
    }

    await Promise.all(writePromises);

    const successMessage = `Backfill de buffer concluído. ${writePromises.length} buffers foram criados/atualizados em ${TARGET_COLLECTION}.`;
    logger.info(successMessage);
    res.status(200).send(successMessage);

  } catch (error) {
    logger.error("Erro durante a construção dos buffers:", error);
    res.status(500).send("Erro interno no servidor during o backfill.");
  }
});