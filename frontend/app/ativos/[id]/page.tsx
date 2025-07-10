"use client";

import { useEffect, useState } from 'react';
import { BarChart, Zap, AlertTriangle, Gauge, Clock, GitCommit, GitCompare, Hourglass, Scale } from 'lucide-react';

// Interface completa com todos os campos que esperamos do sion_cache
interface AssetDetails {
  id: string;
  ticker: string;
  timeframe: string;
  finalScore: number;
  confidence: number;
  estado: string;
  processedAt: string;
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
}

export default function AssetDetailPage({ params }: { params: { id: string } }) {
  const [asset, setAsset] = useState<AssetDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const assetId = decodeURIComponent(params.id);

  useEffect(() => {
    if (!assetId) return;

    async function fetchAssetData() {
      setLoading(true);
      try {
        const response = await fetch("https://getsioncachedata-ojuivh74yq-uc.a.run.app");
        if (!response.ok) throw new Error(`Erro na API: ${response.status}`);
        const allAssets: AssetDetails[] = await response.json();
        const specificAsset = allAssets.find(a => a.id === assetId);

        if (specificAsset) {
          setAsset(specificAsset);
        } else {
          throw new Error(`Ativo com ID "${assetId}" não encontrado.`);
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAssetData();
  }, [assetId]);

  if (loading) return <div className="p-6 text-center text-gray-400">Carregando detalhes do ativo...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Erro ao carregar dados: {error}</div>;
  if (!asset) return <div className="p-6 text-center text-gray-400">Ativo não encontrado.</div>;

  const [ticker, timeframe] = asset.id.split('_');

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg animate-fade-in">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">{ticker}</h1>
          <p className="text-sm text-gray-400">{timeframe} - {new Date(asset.processedAt).toLocaleString('pt-BR')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Coluna 1: Scores Principais */}
        <div className="space-y-6">
          <div className="p-4 bg-gray-800 rounded-md"><h2 className="text-sm font-semibold text-gray-400">Score Gerado</h2><p className={`text-3xl font-bold ${asset.finalScore > 0 ? 'text-green-500' : 'text-red-500'}`}>{asset.finalScore > 0 ? `+${asset.finalScore}` : asset.finalScore}</p></div>
          <div className="p-4 bg-gray-800 rounded-md"><h2 className="text-sm font-semibold text-gray-400">Confiança Calculada</h2><p className="text-3xl font-bold text-cyan-400">{asset.confidence}%</p></div>
          <div className="p-4 bg-gray-800 rounded-md"><h2 className="text-sm font-semibold text-gray-400">Estado do Mercado</h2><p className="text-xl font-bold">{asset.estado}</p></div>
        </div>

        {/* Coluna 2: Análise Técnica */}
        <div className="p-4 bg-gray-800 rounded-md"><h2 className="text-lg font-bold mb-4">Análise Técnica</h2><div className="space-y-3 text-sm"><div className="flex justify-between"><span className="text-gray-400">Volume</span> <span>{asset.analysis.volume ?? 'N/A'}</span></div><div className="flex justify-between"><span className="text-gray-400">RSI</span> <span>{asset.analysis.rsi ?? 'N/A'}</span></div><div className="flex justify-between"><span className="text-gray-400">MACD</span> <span>{asset.analysis.macd ?? 'N/A'}</span></div><div className="flex justify-between"><span className="text-gray-400">Suporte</span> <span className="text-red-500">{asset.analysis.suporte ? `$${asset.analysis.suporte.toLocaleString('pt-BR')}` : 'N/A'}</span></div><div className="flex justify-between"><span className="text-gray-400">Resistência</span> <span className="text-green-500">{asset.analysis.resistencia ? `$${asset.analysis.resistencia.toLocaleString('pt-BR')}` : 'N/A'}</span></div></div></div>

        {/* Coluna 3: Bônus e Meta-Indicadores */}
        <div className="p-4 bg-gray-800 rounded-md"><h2 className="text-lg font-bold mb-4">Contexto SIOM</h2><div className="space-y-3 text-sm"><div className="flex justify-between items-center"><span className="text-gray-400 flex items-center gap-2"><GitCommit size={14}/> Bônus de Padrão</span> <span className="font-semibold">{asset.patternBonus}</span></div><div className="flex justify-between items-center"><span className="text-gray-400 flex items-center gap-2"><Hourglass size={14}/> Bônus Temporal</span> <span className="font-semibold">{asset.temporalBonus}</span></div><div className="flex justify-between items-center"><span className="text-gray-400 flex items-center gap-2"><GitCompare size={14}/> Bônus de Convergência</span> <span className="font-semibold">{asset.convergenceBonus}</span></div><hr className="border-gray-700"/><div className="flex justify-between items-center"><span className="text-gray-400 flex items-center gap-2"><Zap size={14}/> Densidade de Sinais</span> <span className="font-semibold">{asset.meta.signalDensity}</span></div><div className="flex justify-between items-center"><span className="text-gray-400 flex items-center gap-2"><Scale size={14}/> Contradição</span> <span className="font-semibold">{(asset.meta.contradictionScore * 100).toFixed(0)}%</span></div></div></div>
      </div>
    </div>
  );
}