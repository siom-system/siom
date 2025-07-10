import {onRequest} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import { calculateIndividualSignalScore } from "./signalProcessor";

interface RawSignalData {
  ticker: string;
  timeframe: string;
  market_structure_firebase: string;
  dmi_firebase: string;
  reversao_firebase: string;
  agulhada_firebase: string;
  boss_ma_firebase: string;
}

export const buildBuffersFromCache = onRequest({timeoutSeconds: 540, memory: "1GiB"}, async (req, res) => {
  const TARGET_COLLECTION = "sinal_buffers";
  const MAX_BUFFER_SIZE = 100;

  logger.info(`Iniciando construção de buffers para a coleção: ${TARGET_COLLECTION}`);

  try {
    const db = admin.firestore();
    const cacheSnapshot = await db.collection("sion_cache").get();

    if (cacheSnapshot.empty) {
      const emptyMsg = "A coleção 'sion_cache' está vazia.";
      logger.warn(emptyMsg);
      res.status(404).send(emptyMsg);
      return;
    }

    const allCacheDocs = cacheSnapshot.docs.map((doc) => doc.data());
    logger.info(`Total de ${allCacheDocs.length} documentos lidos do sion_cache.`);

    const writePromises: Promise<admin.firestore.WriteResult>[] = [];

    for (const doc of allCacheDocs) {
      const individualScore = calculateIndividualSignalScore(doc as RawSignalData);
      const signalWithScore = { 
        ...doc, 
        individualScore: parseFloat(individualScore.toFixed(4)),
        receivedAt: doc.processedAt || new Date().toISOString() 
      };

      const buffer = [signalWithScore].slice(-MAX_BUFFER_SIZE);
      const docId = `${doc.ticker}_${doc.timeframe}`;

      const bufferRef = db.collection(TARGET_COLLECTION).doc(docId);
      writePromises.push(bufferRef.set({ signals: buffer }, { merge: true }));
    }

    await Promise.all(writePromises);

    const successMessage = `Backfill concluído. ${writePromises.length} buffers foram criados/atualizados em ${TARGET_COLLECTION}.`;
    logger.info(successMessage);
    res.status(200).send(successMessage);

  } catch (error) {
    logger.error("Erro durante a construção dos buffers:", error);
    res.status(500).send("Erro interno no servidor durante o backfill.");
  }
});