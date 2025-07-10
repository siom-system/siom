import {onRequest} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import { calculateIndividualSignalScore, processSignalBuffer } from "./signalProcessor";
import { MAX_BUFFER_SIZE, BUFFER_COLLECTION } from "./config";

export const webhookReceiver = onRequest({timeoutSeconds: 120}, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }
  try {
    const rawData = req.body;
    if (!rawData || !rawData.ticker || !rawData.timeframe) {
      logger.error("Webhook recebido com corpo inválido.", {body: rawData});
      res.status(400).send("Bad Request: corpo da requisição inválido.");
      return;
    }

    logger.info("Webhook recebido e score individual calculado:", rawData);

    const db = admin.firestore();
    const docId = `${rawData.ticker}_${rawData.timeframe}`;
    const bufferRef = db.collection(BUFFER_COLLECTION).doc(docId);
    const bufferDoc = await bufferRef.get();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let currentBuffer: any[] = [];
    if (bufferDoc.exists) {
      currentBuffer = bufferDoc.data()?.signals || [];
    }

    const individualScore = calculateIndividualSignalScore(rawData);
    const signalWithScore = { 
        ...rawData, 
        individualScore: parseFloat(individualScore.toFixed(4)),
        receivedAt: new Date().toISOString() 
    };

    currentBuffer.push(signalWithScore);

    while (currentBuffer.length > MAX_BUFFER_SIZE) {
      currentBuffer.shift();
    }
    await bufferRef.set({signals: currentBuffer});
    logger.info(`Buffer para ${docId} atualizado com ${currentBuffer.length} sinais.`);

    // --- CORREÇÃO ADICIONADA AQUI ---
    // Agora esperamos (await) pelo resultado do motor de lógica.
    const processedData = await processSignalBuffer(currentBuffer);

    if (processedData) {
      await db.collection("sion_cache").doc(docId).set(processedData, { merge: true });
      logger.info(`Dados processados para ${docId} salvos no sion_cache.`);
    }

    res.status(200).send(`Sinal para ${docId} processado e salvo com sucesso.`);
  } catch (error) {
    logger.error("Erro no webhookReceiver:", error);
    res.status(500).send("Erro interno ao processar o webhook.");
  }
});