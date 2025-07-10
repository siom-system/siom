"use client"

import { useState, useEffect } from "react"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronUp,
  Activity,
  Shield,
  Clock,
  BarChart3,
  Target,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react"

interface AssetIndicator {
  name: string
  status: "Ativo" | "Inativo" | "Pendente"
  value: string
  lastUpdate: string
}

interface TimeframeData {
  timeframe: string
  trend: "Bullish" | "Bearish" | "Neutro"
  confidence: number
  score: number
  marketState: string
}

interface AssetData {
  id: string
  name: string
  ticker: string
  primaryTimeframe: string
  lastScore: number
  lastConfidence: number
  currentStatus: string
  direction: "Bullish" | "Bearish" | "Neutro"
  timeframes: TimeframeData[]
  indicators: AssetIndicator[]
  historicalData: {
    dates: string[]
    scores: number[]
    confidence: number[]
  }
  performance: {
    estimatedPL: number
    accuracy: number
    totalSignals: number
  }
}

const mockAssets: AssetData[] = [
  {
    id: "1",
    name: "Bitcoin",
    ticker: "BTCUSDT",
    primaryTimeframe: "4h",
    lastScore: 1.85,
    lastConfidence: 87,
    currentStatus: "Tendência de Alta",
    direction: "Bullish",
    timeframes: [
      { timeframe: "15m", trend: "Bullish", confidence: 72, score: 0.95, marketState: "Impulso" },
      { timeframe: "1h", trend: "Bullish", confidence: 85, score: 1.45, marketState: "Tendência" },
      { timeframe: "4h", trend: "Bullish", confidence: 87, score: 1.85, marketState: "Breakout" },
      { timeframe: "1D", trend: "Bullish", confidence: 91, score: 2.12, marketState: "Expansão" },
    ],
    indicators: [
      { name: "BOS (Break of Structure)", status: "Ativo", value: "Confirmado", lastUpdate: "há 15 min" },
      { name: "CHoCH", status: "Inativo", value: "Aguardando", lastUpdate: "há 2h" },
      { name: "Reversão de Tendência", status: "Inativo", value: "Não detectado", lastUpdate: "há 1h" },
      { name: "Agulhada", status: "Pendente", value: "Monitorando", lastUpdate: "há 30 min" },
      { name: "Volume Anômalo", status: "Ativo", value: "Alto", lastUpdate: "há 5 min" },
    ],
    historicalData: {
      dates: ["07/01", "06/01", "05/01", "04/01", "03/01", "02/01", "01/01"],
      scores: [1.85, 1.42, 0.95, 0.32, -0.15, 0.78, 1.23],
      confidence: [87, 82, 75, 68, 45, 71, 79],
    },
    performance: {
      estimatedPL: 12.5,
      accuracy: 89,
      totalSignals: 23,
    },
  },
  {
    id: "2",
    name: "Ethereum",
    ticker: "ETHUSDT",
    primaryTimeframe: "1h",
    lastScore: -0.92,
    lastConfidence: 73,
    currentStatus: "Correção",
    direction: "Bearish",
    timeframes: [
      { timeframe: "15m", trend: "Bearish", confidence: 68, score: -0.45, marketState: "Pressão" },
      { timeframe: "1h", trend: "Bearish", confidence: 73, score: -0.92, marketState: "Correção" },
      { timeframe: "4h", trend: "Neutro", confidence: 55, score: 0.12, marketState: "Lateral" },
      { timeframe: "1D", trend: "Bullish", confidence: 78, score: 1.05, marketState: "Suporte" },
    ],
    indicators: [
      { name: "BOS (Break of Structure)", status: "Inativo", value: "Não confirmado", lastUpdate: "há 45 min" },
      { name: "CHoCH", status: "Ativo", value: "Detectado", lastUpdate: "há 20 min" },
      { name: "Reversão de Tendência", status: "Pendente", value: "Possível", lastUpdate: "há 10 min" },
      { name: "Agulhada", status: "Inativo", value: "Não detectado", lastUpdate: "há 1h" },
      { name: "Volume Anômalo", status: "Ativo", value: "Médio", lastUpdate: "há 25 min" },
    ],
    historicalData: {
      dates: ["07/01", "06/01", "05/01", "04/01", "03/01", "02/01", "01/01"],
      scores: [-0.92, -0.35, 0.48, 0.85, 1.12, 0.67, -0.23],
      confidence: [73, 65, 71, 82, 88, 76, 59],
    },
    performance: {
      estimatedPL: -3.2,
      accuracy: 76,
      totalSignals: 18,
    },
  },
  {
    id: "3",
    name: "Solana",
    ticker: "SOLUSDT",
    primaryTimeframe: "4h",
    lastScore: 0.45,
    lastConfidence: 61,
    currentStatus: "Consolidação",
    direction: "Neutro",
    timeframes: [
      { timeframe: "15m", trend: "Neutro", confidence: 52, score: 0.15, marketState: "Indecisão" },
      { timeframe: "1h", trend: "Bullish", confidence: 58, score: 0.32, marketState: "Acumulação" },
      { timeframe: "4h", trend: "Bullish", confidence: 61, score: 0.45, marketState: "Consolidação" },
      { timeframe: "1D", trend: "Neutro", confidence: 49, score: -0.08, marketState: "Range" },
    ],
    indicators: [
      { name: "BOS (Break of Structure)", status: "Pendente", value: "Aguardando", lastUpdate: "há 1h" },
      { name: "CHoCH", status: "Inativo", value: "Não detectado", lastUpdate: "há 3h" },
      { name: "Reversão de Tendência", status: "Inativo", value: "Não detectado", lastUpdate: "há 2h" },
      { name: "Agulhada", status: "Ativo", value: "Detectado", lastUpdate: "há 40 min" },
      { name: "Volume Anômalo", status: "Inativo", value: "Baixo", lastUpdate: "há 1h" },
    ],
    historicalData: {
      dates: ["07/01", "06/01", "05/01", "04/01", "03/01", "02/01", "01/01"],
      scores: [0.45, 0.28, -0.12, 0.67, 0.89, 0.34, -0.45],
      confidence: [61, 58, 43, 72, 81, 65, 38],
    },
    performance: {
      estimatedPL: 2.8,
      accuracy: 67,
      totalSignals: 15,
    },
  },
]

export default function AtivosPage() {
  const [assets, setAssets] = useState<AssetData[]>(mockAssets)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredAssets, setFilteredAssets] = useState<AssetData[]>(mockAssets)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Filtrar ativos por busca
  useEffect(() => {
    if (searchTerm) {
      const filtered = assets.filter(
        (asset) =>
          asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.ticker.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredAssets(filtered)
    } else {
      setFilteredAssets(assets)
    }
  }, [searchTerm, assets])

  const toggleCard = (assetId: string) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(assetId)) {
      newExpanded.delete(assetId)
    } else {
      newExpanded.add(assetId)
    }
    setExpandedCards(newExpanded)
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "Bullish":
        return "text-emerald-400"
      case "Bearish":
        return "text-red-400"
      default:
        return "text-slate-400"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "Bullish":
        return <TrendingUp className="w-4 h-4" />
      case "Bearish":
        return <TrendingDown className="w-4 h-4" />
      default:
        return <Minus className="w-4 h-4" />
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 75) return "text-emerald-400"
    if (confidence >= 50) return "text-amber-400"
    return "text-red-400"
  }

  const getScoreColor = (score: number) => {
    return score > 0 ? "text-emerald-400" : score < 0 ? "text-red-400" : "text-slate-400"
  }

  const getIndicatorStatusIcon = (status: string) => {
    switch (status) {
      case "Ativo":
        return <CheckCircle className="w-3 h-3 text-emerald-400" />
      case "Inativo":
        return <XCircle className="w-3 h-3 text-slate-500" />
      default:
        return <AlertTriangle className="w-3 h-3 text-amber-400" />
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Target className="w-8 h-8 text-emerald-400 mr-4" />
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Centro de Inteligência por Ativo</h1>
            <p className="text-slate-400 mt-1">Análise completa e histórico detalhado de cada ativo monitorado</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl text-slate-300 hover:text-emerald-400 transition-all duration-200">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl text-slate-300 hover:text-blue-400 transition-all duration-200">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Barra de Busca */}
      <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar ativo (ex.: Bitcoin, BTCUSDT)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-sm"
          />
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center">
            <BarChart3 className="w-5 h-5 text-blue-400 mr-2" />
            <div>
              <p className="text-xs text-slate-400">Total de Ativos</p>
              <p className="text-lg font-bold text-slate-100">{filteredAssets.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 text-emerald-400 mr-2" />
            <div>
              <p className="text-xs text-slate-400">Em Alta</p>
              <p className="text-lg font-bold text-emerald-400">
                {filteredAssets.filter((a) => a.direction === "Bullish").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center">
            <TrendingDown className="w-5 h-5 text-red-400 mr-2" />
            <div>
              <p className="text-xs text-slate-400">Em Baixa</p>
              <p className="text-lg font-bold text-red-400">
                {filteredAssets.filter((a) => a.direction === "Bearish").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center">
            <Shield className="w-5 h-5 text-amber-400 mr-2" />
            <div>
              <p className="text-xs text-slate-400">Confiança Média</p>
              <p className="text-lg font-bold text-amber-400">
                {Math.round(filteredAssets.reduce((sum, a) => sum + a.lastConfidence, 0) / filteredAssets.length || 0)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards dos Ativos */}
      <div className="space-y-3">
        {filteredAssets.map((asset, index) => (
          <div
            key={asset.id}
            className="bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Card Colapsado */}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                  {/* Nome e Ticker */}
                  <div className="md:col-span-2">
                    <div className="flex items-center">
                      <div
                        className={`p-2 rounded-lg mr-3 ${asset.direction === "Bullish" ? "bg-emerald-500/10" : asset.direction === "Bearish" ? "bg-red-500/10" : "bg-slate-500/10"}`}
                      >
                        <div className={getTrendColor(asset.direction)}>{getTrendIcon(asset.direction)}</div>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-100">{asset.name}</h3>
                        <p className="text-xs text-slate-400">{asset.ticker}</p>
                      </div>
                    </div>
                  </div>

                  {/* Timeframe */}
                  <div className="text-center">
                    <p className="text-xs text-slate-400 mb-0.5">Timeframe</p>
                    <span className="text-xs bg-slate-600/50 text-slate-300 px-2 py-0.5 rounded-full">
                      {asset.primaryTimeframe}
                    </span>
                  </div>

                  {/* Score */}
                  <div className="text-center">
                    <p className="text-xs text-slate-400 mb-0.5">Score</p>
                    <p className={`text-sm font-bold ${getScoreColor(asset.lastScore)}`}>
                      {asset.lastScore > 0 ? "+" : ""}
                      {asset.lastScore.toFixed(2)}
                    </p>
                  </div>

                  {/* Confiança */}
                  <div className="text-center">
                    <p className="text-xs text-slate-400 mb-0.5">Confiança</p>
                    <p className={`text-sm font-bold ${getConfidenceColor(asset.lastConfidence)}`}>
                      {asset.lastConfidence}%
                    </p>
                  </div>

                  {/* Status */}
                  <div className="text-center">
                    <p className="text-xs text-slate-400 mb-0.5">Status</p>
                    <p className="text-xs font-medium text-slate-300">{asset.currentStatus}</p>
                  </div>
                </div>

                {/* Botão Expandir */}
                <button
                  onClick={() => toggleCard(asset.id)}
                  className="ml-4 flex items-center bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-emerald-400 px-3 py-2 rounded-lg transition-all duration-200"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  <span className="text-xs">Ver Detalhes</span>
                  {expandedCards.has(asset.id) ? (
                    <ChevronUp className="w-3 h-3 ml-1" />
                  ) : (
                    <ChevronDown className="w-3 h-3 ml-1" />
                  )}
                </button>
              </div>
            </div>

            {/* Card Expandido */}
            {expandedCards.has(asset.id) && (
              <div className="border-t border-slate-700/50 p-4 space-y-4 animate-fade-in-up">
                {/* 1. Resumo Multi-Timeframe */}
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-slate-100 mb-3 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-blue-400" />
                    Resumo Multi-Timeframe
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {asset.timeframes.map((tf) => (
                      <div key={tf.timeframe} className="bg-slate-600/30 rounded-lg p-3">
                        <div className="text-center mb-2">
                          <span className="text-xs bg-slate-500/50 text-slate-300 px-2 py-0.5 rounded-full">
                            {tf.timeframe}
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-400">Tendência:</span>
                            <div className={`flex items-center text-xs font-medium ${getTrendColor(tf.trend)}`}>
                              {getTrendIcon(tf.trend)}
                              <span className="ml-1">{tf.trend}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-400">Confiança:</span>
                            <span className={`text-xs font-bold ${getConfidenceColor(tf.confidence)}`}>
                              {tf.confidence}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-400">Score:</span>
                            <span className={`text-xs font-bold ${getScoreColor(tf.score)}`}>
                              {tf.score > 0 ? "+" : ""}
                              {tf.score.toFixed(2)}
                            </span>
                          </div>
                          <div className="text-center mt-2">
                            <span className="text-xs text-slate-300 font-medium">{tf.marketState}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* 2. Painel de Indicadores */}
                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-slate-100 mb-3 flex items-center">
                      <Activity className="w-4 h-4 mr-2 text-emerald-400" />
                      Indicadores Ativos
                    </h4>
                    <div className="space-y-2">
                      {asset.indicators.map((indicator, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-slate-600/30 rounded-lg">
                          <div className="flex items-center">
                            {getIndicatorStatusIcon(indicator.status)}
                            <div className="ml-2">
                              <p className="text-xs font-medium text-slate-200">{indicator.name}</p>
                              <p className="text-xs text-slate-400">{indicator.lastUpdate}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-medium text-slate-300">{indicator.value}</p>
                            <span
                              className={`text-xs px-1.5 py-0.5 rounded-full ${
                                indicator.status === "Ativo"
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : indicator.status === "Inativo"
                                    ? "bg-slate-500/20 text-slate-400"
                                    : "bg-amber-500/20 text-amber-400"
                              }`}
                            >
                              {indicator.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. Histórico e Performance */}
                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-slate-100 mb-3 flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2 text-purple-400" />
                      Histórico & Performance
                    </h4>

                    {/* Mini Gráfico Placeholder */}
                    <div className="bg-slate-600/30 rounded-lg p-3 mb-3">
                      <div className="flex items-end justify-between h-16 space-x-1">
                        {asset.historicalData.scores.map((score, idx) => (
                          <div key={idx} className="flex-1 flex flex-col items-center">
                            <div
                              className={`w-full rounded-t ${score > 0 ? "bg-emerald-400/60" : score < 0 ? "bg-red-400/60" : "bg-slate-400/60"}`}
                              style={{
                                height: `${Math.max(Math.abs(score) * 20, 4)}px`,
                              }}
                            />
                            <span className="text-xs text-slate-400 mt-1">{asset.historicalData.dates[idx]}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Métricas de Performance */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-slate-600/30 rounded-lg">
                        <span className="text-xs text-slate-400">P/L Estimado:</span>
                        <span
                          className={`text-xs font-bold ${asset.performance.estimatedPL > 0 ? "text-emerald-400" : "text-red-400"}`}
                        >
                          {asset.performance.estimatedPL > 0 ? "+" : ""}
                          {asset.performance.estimatedPL.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-slate-600/30 rounded-lg">
                        <span className="text-xs text-slate-400">Precisão:</span>
                        <span className={`text-xs font-bold ${getConfidenceColor(asset.performance.accuracy)}`}>
                          {asset.performance.accuracy}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-slate-600/30 rounded-lg">
                        <span className="text-xs text-slate-400">Total de Sinais:</span>
                        <span className="text-xs font-bold text-slate-300">{asset.performance.totalSignals}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredAssets.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Nenhum ativo encontrado</p>
            <p className="text-sm">Tente ajustar os termos de busca</p>
          </div>
        </div>
      )}
    </div>
  )
}
