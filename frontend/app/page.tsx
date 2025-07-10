"use client"

import { useState, useEffect } from "react"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronUp,
  Eye,
  Search,
  Target,
} from "lucide-react"

// Interface alinhada com os dados que temos no sion_cache
interface AssetData {
  id: string;
  ticker: string;
  timeframe: string;
  finalScore: number;
  confidence: number;
  estado: string;
}

// Componente para o ícone e texto de tendência
const TrendInfo = ({ score }: { score: number }) => {
    if (score === 0) return <div className="flex items-center text-slate-400"><Minus className="w-4 h-4" /></div>
    const isBullish = score > 0;
    const trendColor = isBullish ? "text-emerald-400" : "text-red-400";
    const TrendIcon = isBullish ? TrendingUp : TrendingDown;
    return <div className={`p-2 rounded-lg ${isBullish ? "bg-emerald-500/10" : "bg-red-500/10"}`}><TrendIcon className={`w-4 h-4 ${trendColor}`} /></div>
}

export default function AtivosPage() {
  // Começa com uma lista vazia, em vez de dados mock
  const [assets, setAssets] = useState<AssetData[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

  // Busca os dados reais da nossa API
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("https://getsioncachedata-ojuivh74yq-uc.a.run.app");
        if (!response.ok) throw new Error(`Erro na API: ${response.status}`);
        const data = await response.json();
        // Formata os dados para garantir que todos os campos necessários existam
        const formattedData = data.map((d: any) => ({
            id: d.id,
            ticker: d.ticker,
            timeframe: d.timeframe,
            finalScore: d.finalScore,
            confidence: d.confidence,
            estado: d.estado ?? "Indefinido"
        }));
        setAssets(formattedData);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const toggleCard = (assetId: string) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(assetId)) {
      newExpanded.delete(assetId)
    } else {
      newExpanded.add(assetId)
    }
    setExpandedCards(newExpanded)
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 75) return "text-emerald-400"
    if (confidence >= 50) return "text-amber-400"
    return "text-red-400"
  }

  const getScoreColor = (score: number) => {
    return score > 0 ? "text-emerald-400" : score < 0 ? "text-red-400" : "text-slate-400"
  }

  if (loading) return <div className="text-center text-gray-400 p-10">Carregando ativos do SIOM...</div>;
  if (error) return <div className="text-center text-red-500 p-10">Erro ao carregar dados: {error}</div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center">
        <Target className="w-8 h-8 text-emerald-400 mr-4" />
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Centro de Inteligência por Ativo</h1>
          <p className="text-slate-400 mt-1">Análise completa e histórico detalhado de cada ativo monitorado</p>
        </div>
      </div>

      <div className="space-y-3">
        {assets.map((asset, index) => (
          <div
            key={asset.id}
            className="bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200"
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                  <div className="md:col-span-2">
                    <div className="flex items-center">
                      <TrendInfo score={asset.finalScore} />
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-slate-100">{asset.ticker}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="text-center"><p className="text-xs text-slate-400 mb-0.5">Timeframe</p><span className="text-sm bg-slate-600/50 text-slate-300 px-2 py-0.5 rounded-full">{asset.timeframe}</span></div>
                  <div className="text-center"><p className="text-xs text-slate-400 mb-0.5">Score</p><p className={`text-sm font-bold ${getScoreColor(asset.finalScore)}`}>{asset.finalScore > 0 ? "+" : ""}{asset.finalScore.toFixed(2)}</p></div>
                  <div className="text-center"><p className="text-xs text-slate-400 mb-0.5">Confiança</p><p className={`text-sm font-bold ${getConfidenceColor(asset.confidence)}`}>{asset.confidence}%</p></div>
                  <div className="text-center"><p className="text-xs text-slate-400 mb-0.5">Status</p><p className="text-xs font-medium text-slate-300">{asset.estado}</p></div>
                </div>
                <button
                  onClick={() => toggleCard(asset.id)}
                  className="ml-4 flex items-center bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-emerald-400 px-3 py-2 rounded-lg transition-all duration-200"
                >
                  <Eye className="w-3 h-3 mr-1" /><span className="text-xs">Ver Detalhes</span>{expandedCards.has(asset.id) ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
                </button>
              </div>
            </div>

            {expandedCards.has(asset.id) && (
              <div className="border-t border-slate-700/50 p-4 text-center text-slate-400 text-sm">
                A visualização detalhada (Resumo Multi-Timeframe, Indicadores Ativos, etc.) será implementada aqui na próxima fase, após adicionarmos a lógica correspondente ao backend.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}