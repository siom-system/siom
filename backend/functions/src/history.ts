import {onRequest} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import cors from "cors";

const corsHandler = cors({origin: true});

export const getSignalHistory = onRequest({timeoutSeconds: 60}, (request, response) => {
  corsHandler(request, response, async () => {
    try {
      const db = admin.firestore();
      const buffersSnapshot = await db.collection("sinal_buffers").get();
      if (buffersSnapshot.empty) {
        response.status(200).json([]);
        return;
      }
      let allSignals: any[] = [];
      buffersSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.signals && Array.isArray(data.signals)) {
          allSignals = allSignals.concat(data.signals);
        }
      });
      allSignals.sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
      const recentSignals = allSignals.slice(0, 200);
      response.status(200).json(recentSignals);
    } catch (error) {
      logger.error("Erro ao buscar o histórico de sinais:", error);
      response.status(500).json({error: "Internal Server Error"});
    }
  });
});
