// @/functions/src/signalProcessor.ts
import * as admin from "firebase-admin";
import {RawSignalData, SignalWithScore, ProcessedSignal} from "./types"; // <-- IMPORTAÇÃO ADICIONADA

// A interface IndicatorResult pode continuar aqui pois é usada apenas internamente neste arquivo.
interface IndicatorResult {
  score: number;
  confidence: number;
}

function getMarketStructureScore(data: string): IndicatorResult {
  const parts = data?.split(";") ?? [];
  const event = parseFloat(parts[0] ?? "0");
  const trend = parseFloat(parts[2] ?? "0");
  const direction = trend !== 0 ? trend : (event > 0 ? 1 : -1);
  let confidence = 0;
  switch (Math.abs(event)) {
    case 2: confidence = 0.90; break;
    case 1: confidence = 0.80; break;
  }
  return {score: confidence * direction, confidence};
}

function getDmiScore(data: string): IndicatorResult {
  const parts = data?.split(";") ?? [];
  const signalEvent = parseFloat(parts[0] ?? "0");
  const adx = parseFloat(parts[1] ?? "0");
  const adxSlope = parseFloat(parts[2] ?? "0");
  if (signalEvent === 0) return {score: 0, confidence: 0};
  const direction = [2, 4, 6].includes(signalEvent) ? -1 : 1;
  let confidence = 0;
  switch (signalEvent) {
    case 5: case 6: confidence = 0.90; break;
    case 3: case 4: confidence = 0.85; break;
    case 1: case 2: confidence = 0.75; break;
  }
  if (adx < 15 && adxSlope <= 0) {
    confidence *= 0.2;
  } else if (adx < 15 && adxSlope > 0) {
    confidence *= 0.5;
  } else if (adx >= 15 && adx < 20 && adxSlope > 0) {
    confidence *= 0.7;
  }
  return {score: confidence * direction, confidence};
}

function getReversaoScore(data: string): IndicatorResult {
  const parts = data?.split(";") ?? [];
  const signal = parseFloat(parts[0] ?? "0");
  if (signal === 0) return {score: 0, confidence: 0};
  const direction = signal > 0 ? 1 : -1;
  let confidence = 0;
  switch (Math.abs(signal)) {
    case 1: confidence = 0.85; break;
    case 0.5: confidence = 0.75; break;
  }
  return {score: confidence * direction, confidence};
}

function getAgulhadaScore(data: string): IndicatorResult {
  const parts = data?.split(";") ?? [];
  const signal = parseFloat(parts[0] ?? "0");
  const isCompacted = parseFloat(parts[4] ?? "0");
  if (signal === 0) return {score: 0, confidence: 0};
  const direction = signal > 0 ? 1 : -1;
  let confidence = 0;
  if (isCompacted === 1) {
    confidence = 0.70;
  } else {
    confidence = 0.40;
  }
  return {score: confidence * direction, confidence};
}

function getBossMaScore(data: string): IndicatorResult {
  const parts = data?.split(";") ?? [];
  const signal = parseFloat(parts[0] ?? "0");
  const confidence = parseFloat(parts[3] ?? "0");
  return {score: signal * confidence, confidence};
}

export function calculateIndividualSignalScore(signal: RawSignalData): number {
  const weights = {marketStructure: 0.40, dmi: 0.25, reversao: 0.20, agulhada: 0.10, bossMa: 0.05};
  const structureScore = getMarketStructureScore(signal.market_structure_firebase).score;
  const dmiScore = getDmiScore(signal.dmi_firebase).score;
  const reversaoScore = getReversaoScore(signal.reversao_firebase).score;
  const agulhadaScore = getAgulhadaScore(signal.agulhada_firebase).score;
  const bossMaScore = getBossMaScore(signal.boss_ma_firebase).score;
  return (structureScore * weights.marketStructure) + (dmiScore * weights.dmi) + (reversaoScore * weights.reversao) + (agulhadaScore * weights.agulhada) + (bossMaScore * weights.bossMa);
}

function detectSequentialPatterns(signalBuffer: SignalWithScore[]): number {
  let patternBonus = 0;
  for (let i = signalBuffer.length - 1; i > 0; i--) {
    const currentSignal = signalBuffer[i];
    const previousSignal = signalBuffer[i - 1];
    const currentMsEvent = parseFloat(currentSignal.market_structure_firebase?.split(";")[0] ?? "0");
    const prevReversaoSignal = parseFloat(previousSignal.reversao_firebase?.split(";")[0] ?? "0");
    if (Math.abs(currentMsEvent) === 2) {
      const chochDirection = Math.sign(currentMsEvent);
      const prevReversaoDirection = Math.sign(prevReversaoSignal);
      if (Math.abs(prevReversaoSignal) === 0.5 && chochDirection === prevReversaoDirection) {
        patternBonus = 0.15 * chochDirection;
        break;
      }
    }
  }
  return patternBonus;
}

function calculateMetaIndicators(signalBuffer: SignalWithScore[]) {
  const signalDensity = signalBuffer.length;
  const bullishSignals = signalBuffer.filter((s) => s.individualScore > 0).length;
  const bearishSignals = signalBuffer.filter((s) => s.individualScore < 0).length;
  let contradictionScore = 0;
  if (signalDensity > 0) {
    contradictionScore = 1 - (Math.abs(bullishSignals - bearishSignals) / signalDensity);
  }
  return {
    signalDensity,
    contradictionScore: parseFloat(contradictionScore.toFixed(4)),
  };
}

function getTemporalContextBonus(): number {
  const now = new Date();
  const utcHour = now.getUTCHours();
  let temporalBonus = 0;
  const isActiveSession = (utcHour >= 8 && utcHour < 12) || (utcHour >= 13 && utcHour < 17) || (utcHour >= 21 || utcHour < 1);
  if (isActiveSession) {
    temporalBonus = 0.05;
  }
  return temporalBonus;
}

async function getConvergenceBonus(ticker: string, currentTf: string, currentDirection: number): Promise<number> {
  if (currentDirection === 0) return 0;
  const db = admin.firestore();
  const higherTimeframes: string[] = [];
  if (currentTf === "15m") higherTimeframes.push("1h", "4h", "1D");
  if (currentTf === "1h") higherTimeframes.push("4h", "1D");
  if (currentTf === "4h") higherTimeframes.push("1D");
  if (higherTimeframes.length === 0) return 0;
  const promises = higherTimeframes.map((tf) => db.collection("sion_cache").doc(`${ticker}_${tf}`).get());
  const higherTfDocs = await Promise.all(promises);
  let convergenceBonus = 0;
  const bonusPerTf = 0.10;
  higherTfDocs.forEach((doc) => {
    if (doc.exists) {
      const data = doc.data();
      if (data && data.finalScore) {
        const higherTfDirection = Math.sign(data.finalScore);
        if (higherTfDirection === currentDirection) {
          convergenceBonus += bonusPerTf;
        }
      }
    }
  });
  return convergenceBonus * currentDirection;
}

export async function processSignalBuffer(signalBuffer: SignalWithScore[]): Promise<ProcessedSignal | null> {
  if (!signalBuffer || signalBuffer.length === 0) {
    return null;
  }
  const latestSignal = signalBuffer[signalBuffer.length - 1];
  const baseScore = latestSignal.individualScore;
  const direction = Math.sign(baseScore);
  const patternBonus = detectSequentialPatterns(signalBuffer);
  const metaIndicators = calculateMetaIndicators(signalBuffer);
  const temporalBonus = getTemporalContextBonus();
  const convergenceBonus = await getConvergenceBonus(latestSignal.ticker, latestSignal.timeframe, direction);
  const finalScore = baseScore + patternBonus + temporalBonus + convergenceBonus;
  const confidence = Math.round(Math.abs(finalScore) * 100);

  // Monta o objeto de retorno seguindo a interface ProcessedSignal
  return {
    ticker: latestSignal.ticker,
    timeframe: latestSignal.timeframe,
    finalScore: parseFloat(finalScore.toFixed(4)),
    confidence: Math.min(confidence, 100),
    patternBonus,
    temporalBonus,
    convergenceBonus,
    meta: metaIndicators,
    analysis: {
      volume: latestSignal.volume ?? null,
      rsi: latestSignal.rsi ?? null,
      macd: latestSignal.macd ?? null,
      suporte: latestSignal.suporte ?? null,
      resistencia: latestSignal.resistencia ?? null,
    },
    estado: latestSignal.estado ?? "Indefinido",
    processedAt: new Date().toISOString(),
    bufferSize: signalBuffer.length,
  };
}
