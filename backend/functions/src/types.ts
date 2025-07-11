// @/functions/src/types.ts

// A estrutura bruta que recebemos do webhook
export interface RawSignalData {
  ticker: string;
  timeframe: string;
  market_structure_firebase: string;
  dmi_firebase: string;
  reversao_firebase: string;
  agulhada_firebase: string;
  boss_ma_firebase: string;
  receivedAt?: string;
  volume?: number;
  rsi?: number;
  macd?: number;
  suporte?: number;
  resistencia?: number;
  estado?: string;
  // Permite outros campos que possamos adicionar no futuro
  [key: string]: any;
}

// O sinal após ter seu score individual calculado
export interface SignalWithScore extends RawSignalData {
  individualScore: number;
}

// A estrutura do resultado final após o processamento do buffer
export interface ProcessedSignal {
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
