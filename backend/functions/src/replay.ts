import {onRequest} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import fetch from "node-fetch";

export const replayFromCache = onRequest({timeoutSeconds: 540, memory: "2GiB"}, async (req, res) => {
  const WEBHOOK_URL = "https://webhookreceiver-ojuivh74yq-uc.a.run.app";
  logger.info(`Iniciando replay de sinais para o webhook: ${WEBHOOK_URL}`);

  try {
    const db = admin.firestore();
    const cacheSnapshot = await db.collection("sion_cache").get();

    if (cacheSnapshot.empty) {
      const msg = "Coleção sion_cache está vazia. Nenhum sinal para re-tocar.";
      logger.warn(msg);
      res.status(404).send(msg);
      return;
    }

    const sourceSignals = cacheSnapshot.docs.map((doc) => doc.data());
    logger.info(`Encontrados ${sourceSignals.length} sinais no sion_cache para replay.`);

    let replayedCount = 0;
    // Processa os sinais em lotes para não exceder limites
    for (const signal of sourceSignals) {
      // Monta o payload "bruto" que o webhook espera
      const rawPayload = {
        ticker: signal.ticker,
        timeframe: signal.timeframe,
        market_structure_firebase: signal.market_structure_firebase,
        dmi_firebase: signal.dmi_firebase,
        reversao_firebase: signal.reversao_firebase,
        agulhada_firebase: signal.agulhada_firebase,
        boss_ma_firebase: signal.boss_ma_firebase,
        // Incluindo os novos campos de análise se existirem
        volume: signal.analysis?.volume,
        rsi: signal.analysis?.rsi,
        macd: signal.analysis?.macd,
        suporte: signal.analysis?.suporte,
        resistencia: signal.analysis?.resistencia,
        estado: signal.estado,
      };

      try {
        await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(rawPayload),
        });
        replayedCount++;
        // Pausa de 100ms entre cada chamada para não sobrecarregar
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (fetchError) {
        logger.error(`Falha ao re-tocar sinal para ${signal.ticker}:`, fetchError);
      }
    }

    const successMessage = `Replay concluído. ${replayedCount} de ${sourceSignals.length} sinais foram reenviados.`;
    logger.info(successMessage);
    res.status(200).send(successMessage);
  } catch (error) {
    logger.error("Erro catastrófico durante o replay:", error);
    res.status(500).send("Erro interno no servidor durante o replay.");
  }
});
