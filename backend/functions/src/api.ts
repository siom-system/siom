import {onRequest} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import cors from "cors";

const corsHandler = cors({origin: true});

export const getSionCacheData = onRequest({timeoutSeconds: 60}, (request, response) => {
  corsHandler(request, response, async () => {
    try {
      const db = admin.firestore();
      const snapshot = await db.collection("sion_cache").get();
      const data: any[] = [];
      snapshot.forEach((doc) => {
        data.push({id: doc.id, ...doc.data()});
      });
      response.status(200).json(data);
    } catch (error) {
      logger.error("Erro ao buscar sion_cache:", error);
      response.status(500).json({error: "Internal Server Error"});
    }
  });
});
