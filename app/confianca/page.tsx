"use client"

import { useState, useEffect } from "react"
import {
  Shield,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUp,
  ArrowDown,
  Activity,
  AlertTriangle,
  Zap,
  Target,
  Eye,
  Pin,
  GitCompare,
  Bell,
  BarChart3,
  RefreshCw,
  Filter,
  ChevronUp,
  ChevronDown,
  Layers,
} from "lucide-react"

interface AssetAlert {
  type: "squeeze" | "saturation" | "breakout" | "confidence_drop"
  message: string
}

interface RecentSignal {
  direction: "up" | "down" | "neutral"
  timestamp: string
  confidence: number
}

interface AssetData {
  id: string
  name: string
  ticker: string
  confidence: number
  lastScore: number
  trend: "Bullish" | "Bearish" | "Neutro"
  marketRegime: string
  primaryTimeframe: string
  recentSignals: RecentSignal[]
  alerts: AssetAlert[]
  isPinned: boolean
  confidenceHistory: number[]
  volatility: "Low" | "Medium" | "High"
  lastUpdate: string
}

const mockAssets: AssetData[] = [
  {
    id: "1",
    name: "Bitcoin",
    ticker: "BTCUSDT",
    confidence: 91,
    lastScore: 2.15,
    trend: "Bullish",
    marketRegime: "Expansão",
    primaryTimeframe: "4h",
    recentSignals: [
      { direction: "up", timestamp: "14:30", confidence: 91 },
      { direction: "up", timestamp: "10:15", confidence: 87 },
      { direction: "neutral", timestamp: "06:45", confidence: 82 },
    ],
    alerts: [{ type: "breakout", message: "Breakout de volatilidade detectado" }],
    isPinned: false,
    confidenceHistory: [91, 87, 82, 89, 85],
    volatility: "High",
    lastUpdate: "há 5 min",
  },
  {
    id: "2",
    name: "Chainlink",
    ticker: "LINKUSDT",
    confidence: 89,
    lastScore: 1.95,
    trend: "Bullish",
    marketRegime: "Tendência",
    primaryTimeframe: "1h",
    recentSignals: [
      { direction: "up", timestamp: "15:20", confidence: 89 },
      { direction: "up", timestamp: "12:30", confidence: 91 },
      { direction: "up", timestamp: "09:15", confidence: 88 },
    ],
    alerts: [],
    isPinned: true,
    confidenceHistory: [89, 91, 88, 85, 87],
    volatility: "Medium",
    lastUpdate: "há 2 min",
  },
  {
    id: "3",
    name: "Cardano",
    ticker: "ADAUSDT",
    confidence: 78,
    lastScore: -1.25,
    trend: "Bearish",
    marketRegime: "Correção",
    primaryTimeframe: "1d",
    recentSignals: [
      { direction: "down", timestamp: "13:45", confidence: 78 },
      { direction: "down", timestamp: "11:20", confidence: 82 },
      { direction: "neutral", timestamp: "08:30", confidence: 75 },
    ],
    alerts: [{ type: "confidence_drop", message: "Queda de confiança detectada" }],
    isPinned: false,
    confidenceHistory: [78, 82, 75, 85, 88],
    volatility: "Low",
    lastUpdate: "há 8 min",
  },
  {
    id: "4",
    name: "Ethereum",
    ticker: "ETHUSDT",
    confidence: 65,
    lastScore: -0.45,
    trend: "Bearish",
    marketRegime: "Lateral",
    primaryTimeframe: "1h",
    recentSignals: [
      { direction: "down", timestamp: "14:10", confidence: 65 },
      { direction: "neutral", timestamp: "11:45", confidence: 68 },
      { direction: "up", timestamp: "09:20", confidence: 72 },
    ],
    alerts: [{ type: "squeeze", message: "Squeeze ativo detectado" }],
    isPinned: false,
    confidenceHistory: [65, 68, 72, 69, 71],
    volatility: "Medium",
    lastUpdate: "há 12 min",
  },
  {
    id: "5",
    name: "Solana",
    ticker: "SOLUSDT",
    confidence: 58,
    lastScore: 0.32,
    trend: "Neutro",
    marketRegime: "Consolidação",
    primaryTimeframe: "4h",
    recentSignals: [
      { direction: "neutral", timestamp: "13:30", confidence: 58 },
      { direction: "up", timestamp: "10:45", confidence: 61 },
      { direction: "down", timestamp: "07:15", confidence: 55 },
    ],
    alerts: [{ type: "saturation", message: "Saturação de sinais" }],
    isPinned: false,
    confidenceHistory: [58, 61, 55, 59, 62],
    volatility: "Low",
    lastUpdate: "há 15 min",
  },
  {
    id: "6",
    name: "Polkadot",
    ticker: "DOTUSDT",
    confidence: 42,
    lastScore: -0.85,
    trend: "Bearish",
    marketRegime: "Declínio",
    primaryTimeframe: "4h",
    recentSignals: [
      { direction: "down", timestamp: "12:20", confidence: 42 },
      { direction: "down", timestamp: "09:30", confidence: 45 },
      { direction: "neutral", timestamp: "06:45", confidence: 48 },
    ],
    alerts: [
      { type: "confidence_drop", message: "Queda significativa de confiança" },
      { type: "squeeze", message: "Squeeze ativo" },
    ],
    isPinned: false,
    confidenceHistory: [42, 45, 48, 52, 58],
    volatility: "High",
    lastUpdate: "há 20 min",
  },
]

export default function ConfiancaPage() {
  const [assets, setAssets] = useState<AssetData[]>(mockAssets)
  const [sortBy, setSortBy] = useState<"confidence" | "score" | "trend">("confidence")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set())
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Categorizar ativos por confiança
  const highConfidenceAssets = assets.filter((asset) => asset.confidence >= 75)
  const moderateConfidenceAssets = assets.filter((asset) => asset.confidence >= 50 && asset.confidence < 75)
  const lowConfidenceAssets = assets.filter((asset) => asset.confidence < 50)

  // Calcular média geral de confiança
  const averageConfidence = Math.round(assets.reduce((sum, asset) => sum + asset.confidence, 0) / assets.length)

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 75) return "text-emerald-400"
    if (confidence >= 50) return "text-amber-400"
    return "text-red-400"
  }

  const getConfidenceBg = (confidence: number) => {
    if (confidence >= 75) return "bg-emerald-500/10 border-emerald-500/30"
    if (confidence >= 50) return "bg-amber-500/10 border-amber-500/30"
    return "bg-red-500/10 border-red-500/30"
  }

  const getConfidenceBorder = (confidence: number) => {
    if (confidence >= 75) return "border-l-emerald-500"
    if (confidence >= 50) return "border-l-amber-500"
    return "border-l-red-500"
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "Bullish":
        return <TrendingUp className="w-3 h-3" />
      case "Bearish":
        return <TrendingDown className="w-3 h-3" />
      default:
        return <Minus className="w-3 h-3" />
    }
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

  const getScoreColor = (score: number) => {
    return score > 0 ? "text-emerald-400" : score < 0 ? "text-red-400" : "text-slate-400"
  }

  const getSignalIcon = (direction: string) => {
    switch (direction) {
      case "up":
        return <ArrowUp className="w-2 h-2 text-emerald-400" />
      case "down":
        return <ArrowDown className="w-2 h-2 text-red-400" />
      default:
        return <Minus className="w-2 h-2 text-slate-400" />
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "squeeze":
        return <Layers className="w-3 h-3 text-amber-400" />
      case "saturation":
        return <Activity className="w-3 h-3 text-blue-400" />
      case "breakout":
        return <Zap className="w-3 h-3 text-purple-400" />
      case "confidence_drop":
        return <AlertTriangle className="w-3 h-3 text-red-400" />
      default:
        return <AlertTriangle className="w-3 h-3 text-amber-400" />
    }
  }

  const toggleAssetSelection = (assetId: string) => {
    const newSelected = new Set(selectedAssets)
    if (newSelected.has(assetId)) {
      newSelected.delete(assetId)
    } else {
      newSelected.add(assetId)
    }
    setSelectedAssets(newSelected)
  }

  const togglePin = (assetId: string) => {
    setAssets(assets.map((asset) => (asset.id === assetId ? { ...asset, isPinned: !asset.isPinned } : asset)))
  }

  const sortAssets = (assetList: AssetData[]) => {
    return [...assetList].sort((a, b) => {
      // Pinned assets first
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1

      let comparison = 0
      switch (sortBy) {
        case "confidence":
          comparison = a.confidence - b.confidence
          break
        case "score":
          comparison = a.lastScore - b.lastScore
          break
        case "trend":
          comparison = a.trend.localeCompare(b.trend)
          break
      }
      return sortOrder === "desc" ? -comparison : comparison
    })
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Shield className="w-8 h-8 text-emerald-400 mr-4" />
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Organização por Confiança</h1>
            <p className="text-slate-400 mt-1">Priorização tática baseada no nível de confiança operacional</p>
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

      {/* 1️⃣ Resumo Superior */}
      <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-slate-700/30 rounded-xl p-3 text-center">
            <BarChart3 className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <p className="text-xs text-slate-400 mb-1">Total Monitorados</p>
            <p className="text-lg font-bold text-slate-100">{assets.length}</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-center">
            <Shield className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <p className="text-xs text-slate-400 mb-1">Alta Confiança</p>
            <p className="text-lg font-bold text-emerald-400">{highConfidenceAssets.length}</p>
            <p className="text-xs text-emerald-400/70">≥ 75%</p>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-center">
            <Target className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <p className="text-xs text-slate-400 mb-1">Moderada</p>
            <p className="text-lg font-bold text-amber-400">{moderateConfidenceAssets.length}</p>
            <p className="text-xs text-amber-400/70">50% - 74%</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-center">
            <AlertTriangle className="w-5 h-5 text-red-400 mx-auto mb-1" />
            <p className="text-xs text-slate-400 mb-1">Baixa</p>
            <p className="text-lg font-bold text-red-400">{lowConfidenceAssets.length}</p>
            <p className="text-xs text-red-400/70">{"< 50%"}</p>
          </div>
          <div className={`rounded-xl p-3 text-center ${getConfidenceBg(averageConfidence)}`}>
            <Activity className={`w-5 h-5 mx-auto mb-1 ${getConfidenceColor(averageConfidence)}`} />
            <p className="text-xs text-slate-400 mb-1">Média Geral</p>
            <p className={`text-lg font-bold ${getConfidenceColor(averageConfidence)}`}>{averageConfidence}%</p>
          </div>
        </div>
      </div>

      {/* Controles de Ordenação */}
      <div className="flex items-center justify-between bg-slate-800/50 rounded-2xl p-3 border border-slate-700/50">
        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-400">Ordenar por:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-700/50 border border-slate-600/50 rounded-lg px-2 py-1 text-xs text-slate-100"
          >
            <option value="confidence">Confiança</option>
            <option value="score">Score Final</option>
            <option value="trend">Tendência</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="p-1 bg-slate-700/50 hover:bg-slate-600/50 rounded text-slate-300 hover:text-emerald-400 transition-all duration-200"
          >
            {sortOrder === "desc" ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </button>
        </div>
        {selectedAssets.size > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">{selectedAssets.size} selecionados</span>
            <button className="flex items-center bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-2 py-1 rounded-lg transition-all duration-200 text-xs">
              <GitCompare className="w-3 h-3 mr-1" />
              Comparar
            </button>
          </div>
        )}
      </div>

      {/* 2️⃣ Blocos de Ativos por Confiança */}
      <div className="space-y-5">
        {/* Alta Confiança */}
        <div className="space-y-3">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-emerald-500 rounded-full mr-3"></div>
            <h2 className="text-lg font-semibold text-emerald-400">Alta Confiança</h2>
            <span className="ml-2 text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
              {highConfidenceAssets.length} ativos
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {sortAssets(highConfidenceAssets).map((asset, index) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                index={index}
                isSelected={selectedAssets.has(asset.id)}
                onToggleSelection={toggleAssetSelection}
                onTogglePin={togglePin}
              />
            ))}
          </div>
        </div>

        {/* Confiança Moderada */}
        <div className="space-y-3">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-amber-500 rounded-full mr-3"></div>
            <h2 className="text-lg font-semibold text-amber-400">Confiança Moderada</h2>
            <span className="ml-2 text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
              {moderateConfidenceAssets.length} ativos
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {sortAssets(moderateConfidenceAssets).map((asset, index) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                index={index}
                isSelected={selectedAssets.has(asset.id)}
                onToggleSelection={toggleAssetSelection}
                onTogglePin={togglePin}
              />
            ))}
          </div>
        </div>

        {/* Baixa Confiança */}
        <div className="space-y-3">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-red-500 rounded-full mr-3"></div>
            <h2 className="text-lg font-semibold text-red-400">Baixa Confiança</h2>
            <span className="ml-2 text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
              {lowConfidenceAssets.length} ativos
            </span>
            {lowConfidenceAssets.some((asset) => asset.alerts.length > 0) && (
              <AlertTriangle className="w-4 h-4 text-amber-400 ml-2" />
            )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {sortAssets(lowConfidenceAssets).map((asset, index) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                index={index}
                isSelected={selectedAssets.has(asset.id)}
                onToggleSelection={toggleAssetSelection}
                onTogglePin={togglePin}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente AssetCard
function AssetCard({
  asset,
  index,
  isSelected,
  onToggleSelection,
  onTogglePin,
}: {
  asset: AssetData
  index: number
  isSelected: boolean
  onToggleSelection: (id: string) => void
  onTogglePin: (id: string) => void
}) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 75) return "text-emerald-400"
    if (confidence >= 50) return "text-amber-400"
    return "text-red-400"
  }

  const getConfidenceBorder = (confidence: number) => {
    if (confidence >= 75) return "border-l-emerald-500"
    if (confidence >= 50) return "border-l-amber-500"
    return "border-l-red-500"
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "Bullish":
        return <TrendingUp className="w-3 h-3" />
      case "Bearish":
        return <TrendingDown className="w-3 h-3" />
      default:
        return <Minus className="w-3 h-3" />
    }
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

  const getScoreColor = (score: number) => {
    return score > 0 ? "text-emerald-400" : score < 0 ? "text-red-400" : "text-slate-400"
  }

  const getSignalIcon = (direction: string) => {
    switch (direction) {
      case "up":
        return <ArrowUp className="w-2 h-2 text-emerald-400" />
      case "down":
        return <ArrowDown className="w-2 h-2 text-red-400" />
      default:
        return <Minus className="w-2 h-2 text-slate-400" />
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "squeeze":
        return <Layers className="w-3 h-3 text-amber-400" />
      case "saturation":
        return <Activity className="w-3 h-3 text-blue-400" />
      case "breakout":
        return <Zap className="w-3 h-3 text-purple-400" />
      case "confidence_drop":
        return <AlertTriangle className="w-3 h-3 text-red-400" />
      default:
        return <AlertTriangle className="w-3 h-3 text-amber-400" />
    }
  }

  return (
    <div
      className={`bg-slate-800/50 rounded-xl border-l-4 ${getConfidenceBorder(asset.confidence)} border-t border-r border-b border-slate-700/50 hover:border-slate-600/50 transition-all duration-200 animate-fade-in-up ${
        isSelected ? "ring-2 ring-blue-500/50" : ""
      } ${asset.isPinned ? "ring-1 ring-emerald-500/30" : ""}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelection(asset.id)}
              className="mr-2 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500/20"
            />
            <div>
              <h3 className="text-sm font-semibold text-slate-100">{asset.name}</h3>
              <p className="text-xs text-slate-400">{asset.ticker}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {asset.isPinned && <Pin className="w-3 h-3 text-emerald-400" />}
            <div className={`text-right`}>
              <p className={`text-lg font-bold ${getConfidenceColor(asset.confidence)}`}>{asset.confidence}%</p>
              <p className="text-xs text-slate-400">confiança</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Score Final</p>
            <p className={`text-sm font-bold ${getScoreColor(asset.lastScore)}`}>
              {asset.lastScore > 0 ? "+" : ""}
              {asset.lastScore.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Tendência</p>
            <div className={`flex items-center text-sm font-medium ${getTrendColor(asset.trend)}`}>
              {getTrendIcon(asset.trend)}
              <span className="ml-1">{asset.trend}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Regime</p>
            <p className="text-sm font-medium text-slate-300">{asset.marketRegime}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Timeframe</p>
            <span className="text-xs bg-slate-600/50 text-slate-300 px-2 py-0.5 rounded-full">
              {asset.primaryTimeframe}
            </span>
          </div>
        </div>

        {/* Mini Histórico */}
        <div className="mb-3">
          <p className="text-xs text-slate-400 mb-1">Últimos 3 sinais</p>
          <div className="flex items-center space-x-2">
            {asset.recentSignals.map((signal, idx) => (
              <div key={idx} className="flex items-center bg-slate-700/30 rounded px-2 py-1">
                {getSignalIcon(signal.direction)}
                <span className="text-xs text-slate-400 ml-1">{signal.timestamp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alertas */}
        {asset.alerts.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {asset.alerts.map((alert, idx) => (
                <div key={idx} className="flex items-center bg-slate-700/50 rounded-lg px-2 py-1" title={alert.message}>
                  {getAlertIcon(alert.type)}
                  <span className="text-xs text-slate-300 ml-1 truncate">{alert.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onTogglePin(asset.id)}
              className={`p-1 rounded transition-all duration-200 ${
                asset.isPinned
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-slate-700/50 text-slate-400 hover:text-emerald-400"
              }`}
              title={asset.isPinned ? "Desafixar" : "Fixar no dashboard"}
            >
              <Pin className="w-3 h-3" />
            </button>
            <button
              className="p-1 bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-blue-400 rounded transition-all duration-200"
              title="Criar alerta"
            >
              <Bell className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500">{asset.lastUpdate}</span>
            <button className="flex items-center bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-emerald-400 px-2 py-1 rounded-lg transition-all duration-200">
              <Eye className="w-3 h-3 mr-1" />
              <span className="text-xs">Analisar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
