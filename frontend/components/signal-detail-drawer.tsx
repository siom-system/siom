// @/components/signal-detail-drawer.tsx
"use client";
import { Signal } from "@/lib/types";
import { X } from "lucide-react";

interface Props {
  signal: Signal | null;
  onClose: () => void;
}

export function SignalDetailDrawer({ signal, onClose }: Props) {
  if (!signal) return null;

  const scoreColor = signal.individualScore > 0 ? "text-green-400" : "text-red-400";
  const trend = signal.individualScore > 0 ? "Bullish" : "Bearish";

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-96 bg-slate-900 border-l border-slate-700 z-50 p-6 animate-slide-in-from-right">
        <div className="flex items-center justify-between pb-4 border-b border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-white">{signal.ticker}</h2>
            <p className="text-sm text-slate-400">{signal.timeframe} • {new Date(signal.receivedAt).toLocaleString('pt-BR')}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700/50 rounded-lg">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-xs text-slate-400 mb-1">Score Gerado</p>
            <p className={`text-2xl font-bold ${scoreColor}`}>{signal.individualScore > 0 ? "+" : ""}{signal.individualScore.toFixed(2)}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-xs text-slate-400 mb-1">Confiança Calculada (Agregada)</p>
            <p className="text-2xl font-bold text-cyan-400">{signal.confidence}%</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-xs text-slate-400 mb-1">Estado do Mercado</p>
            <p className="text-lg font-semibold text-white">{signal.estado}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-xs text-slate-400 mb-1">Tendência Detectada</p>
            <p className={`text-lg font-semibold ${scoreColor}`}>{signal.individualScore === 0 ? "Neutro" : trend}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-100 mb-3">Análise Técnica (Bruta)</h3>
            <div className="space-y-2 text-xs text-slate-300 font-mono">
              <p>Volume: {signal.analysis.volume ?? 'N/A'}</p>
              <p>RSI: {signal.analysis.rsi ?? 'N/A'}</p>
              <p>MACD: {signal.analysis.macd ?? 'N/A'}</p>
              <p>Suporte: {signal.analysis.suporte ?? 'N/A'}</p>
              <p>Resistência: {signal.analysis.resistencia ?? 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}