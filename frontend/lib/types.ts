// @/frontend/lib/types.ts

// Define a estrutura de um único ativo processado que virá da coleção sion_cache
export interface ProcessedAsset {
  id: string; // Ex: BTCUSDT_1h
  ticker: string;
  timeframe: string;
  finalScore: number;
  confidence: number;
  patternBonus: number;
  temporalBonus: number;
  convergenceBonus: number;
  meta: {
      signalDensity: number;
      contradictionScore: number;
  };
  analysis: {
      volume: number | null;
      rsi: number | null;
      macd: number | null;
      suporte: number | null;
      resistencia: number | null;
  };
  estado: string;
  processedAt: string;
  bufferSize: number;
}
