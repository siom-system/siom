"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Eye } from 'lucide-react';
import { Signal } from "@/lib/types"; // Importa nossa definição central
import { SignalDetailDrawer } from "@/components/signal-detail-drawer"; // Importa o painel de detalhes

const SignalRow = ({ signal, onSelect }: { signal: Signal, onSelect: () => void }) => {
  const isBullish = signal.individualScore > 0;
  const scoreColor = isBullish ? 'text-green-400' : 'text-red-400';
  const trendText = isBullish ? 'Bullish' : 'Bearish';

  return (
    <div className="bg-slate-800/50 hover:bg-gray-800/80 border border-transparent hover:border-gray-700 rounded-lg p-4 grid grid-cols-6 gap-4 items-center transition-all">
      <div className="col-span-2">
        <p className="font-bold text-white">{signal.ticker} - {signal.timeframe}</p>
        <p className="text-xs text-gray-400">{new Date(signal.receivedAt).toLocaleString('pt-BR')}</p>
      </div>
      <div><p className="text-xs text-gray-400">Score</p><p className={`font-semibold ${scoreColor}`}>{signal.individualScore > 0 ? `+${signal.individualScore.toFixed(2)}` : signal.individualScore.toFixed(2)}</p></div>
      <div><p className="text-xs text-gray-400">Confiança</p><p className={`font-semibold text-cyan-400`}>{signal.confidence}%</p></div>
      <div><p className="text-xs text-gray-400">Tendência</p><p className={`font-semibold text-sm ${scoreColor}`}>{signal.individualScore === 0 ? "Neutro" : trendText}</p></div>
      <div className="text-right">
        <button onClick={onSelect} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
          <Eye size={14}/> Ver Detalhes
        </button>
      </div>
    </div>
  );
};

export default function HistoryPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://getsignalhistory-ojuivh74yq-uc.a.run.app");
      if (!response.ok) throw new Error(`Erro na API: ${response.status}`);
      const data = await response.json();
      const formattedData = data.map((s: any, index: number) => ({...s, id: `${s.ticker}_${s.timeframe}_${index}`}));
      setSignals(formattedData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Histórico de Sinais</h1>
          <p className="text-gray-400">Diário oficial completo dos sinais gerados pelo SIOM.</p>
        </div>
        <button onClick={fetchHistory} className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl text-slate-300 hover:text-emerald-400" title="Recarregar Dados">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-bold text-white">Timeline de Sinais</h2>
        {loading && <p className="text-gray-400">Carregando histórico...</p>}
        {!loading && signals.map((signal) => (
          <SignalRow key={signal.id} signal={signal} onSelect={() => setSelectedSignal(signal)} />
        ))}
      </div>

      <SignalDetailDrawer signal={selectedSignal} onClose={() => setSelectedSignal(null)} />
    </div>
  );
}