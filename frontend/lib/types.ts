// @/lib/types.ts
export interface Signal {
    id: string;
    ticker: string;
    timeframe: string;
    receivedAt: string;
    individualScore: number;
    estado: string;
    confidence: number; // Confiança agregada do momento
    analysis: {
      volume: number | null;
      rsi: number | null;
      macd: number | null;
      suporte: number | null;
      resistencia: number | null;
    };
    // Incluindo os campos brutos para o painel de detalhes
    market_structure_firebase: string;
    dmi_firebase: string;
    reversao_firebase: string;
    agulhada_firebase: string;
    boss_ma_firebase: string;
  }