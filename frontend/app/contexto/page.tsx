"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Settings,
  CheckCircle,
  Minus,
  XCircle,
  ArrowUpDown,
  AlertTriangle,
  HelpCircle,
  Eye,
  Bell,
  Filter,
  RefreshCw,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  RotateCcw,
  ChevronUp,
  ChevronDown,
} from "lucide-react"

interface ContextIndicator {
  name: string
  value: string
  status: "Forte" | "Moderado" | "Fraco"
}

interface AssetData {
  id: string
  name: string
  ticker: string
  tacticalContext: "Ideal" | "Neutro" | "Adverso" | "Extensao" | "Exaustao" | "Desconhecido"
  contextStrength: number
  primaryTimeframe: string
  keyIndicators: ContextIndicator[]
  sparklineData: number[]
  volatilityCompression: number // 0-100
  priceInclination: "Alta" | "Baixa" | "Lateral"
  systemComment: string
  alerts: {
    reversalProbable: boolean
    contextChanged: boolean
    structuralDivergence: boolean
  }
  adxValue: number
  relativeVolume: number
  lastUpdate: string
}

const mockAssets: AssetData[] = [
  {
    id: "1",
    name: "Bitcoin",
    ticker: "BTCUSDT",
    tacticalContext: "Ideal",
    contextStrength: 92,
    primaryTimeframe: "4h",
    keyIndicators: [
      { name: "ADX", value: "45.2", status: "Forte" },
      { name: "Ribbons", value: "Abertos", status: "Forte" },
      { name: "Volume", value: "Alto", status: "Moderado" },
    ],
    sparklineData: [44000, 44500, 45200, 45800, 46500, 47200, 47800, 48100, 48600, 49000],
    volatilityCompression: 15,
    priceInclination: "Alta",
    systemComment: "Alta propensão direcional confirmada. ADX elevado com ribbons expandidos e volume consistente.",
    alerts: {
      reversalProbable: false,
      contextChanged: false,
      structuralDivergence: false,
    },
    adxValue: 45.2,
    relativeVolume: 1.8,
    lastUpdate: "há 2 min",
  },
  {
    id: "2",
    name: "Ethereum",
    ticker: "ETHUSDT",
    tacticalContext: "Neutro",
    contextStrength: 58,
    primaryTimeframe: "1h",
    keyIndicators: [
      { name: "ADX", value: "22.1", status: "Fraco" },
      { name: "Ribbons", value: "Comprimidos", status: "Fraco" },
      { name: "Volume", value: "Baixo", status: "Fraco" },
    ],
    sparklineData: [3200, 3180, 3220, 3190, 3210, 3195, 3205, 3188, 3215, 3200],
    volatilityCompression: 85,
    priceInclination: "Lateral",
    systemComment: "Mercado sem direção clara. ADX baixo com ribbons comprimidos indicando lateralização.",
    alerts: {
      reversalProbable: false,
      contextChanged: false,
      structuralDivergence: false,
    },
    adxValue: 22.1,
    relativeVolume: 0.6,
    lastUpdate: "há 5 min",
  },
  {
    id: "3",
    name: "Solana",
    ticker: "SOLUSDT",
    tacticalContext: "Adverso",
    contextStrength: 78,
    primaryTimeframe: "4h",
    keyIndicators: [
      { name: "ADX", value: "18.5", status: "Fraco" },
      { name: "Ribbons", value: "Conflitantes", status: "Fraco" },
      { name: "Volume", value: "Irregular", status: "Fraco" },
    ],
    sparklineData: [95, 97, 93, 98, 91, 96, 89, 94, 92, 95],
    volatilityCompression: 45,
    priceInclination: "Lateral",
    systemComment: "Alta incerteza detectada. Sinais conflitantes com ADX baixo e ribbons divergentes.",
    alerts: {
      reversalProbable: false,
      contextChanged: true,
      structuralDivergence: true,
    },
    adxValue: 18.5,
    relativeVolume: 1.2,
    lastUpdate: "há 1 min",
  },
  {
    id: "4",
    name: "Chainlink",
    ticker: "LINKUSDT",
    tacticalContext: "Extensao",
    contextStrength: 88,
    primaryTimeframe: "1h",
    keyIndicators: [
      { name: "ADX", value: "52.8", status: "Forte" },
      { name: "Ribbons", value: "Máxima Expansão", status: "Forte" },
      { name: "Volume", value: "Climático", status: "Forte" },
    ],
    sparklineData: [22, 24, 26, 28, 31, 34, 37, 40, 43, 46],
    volatilityCompression: 5,
    priceInclination: "Alta",
    systemComment: "Movimento prolongado em curso. ADX extremo com ribbons em máxima expansão.",
    alerts: {
      reversalProbable: true,
      contextChanged: false,
      structuralDivergence: false,
    },
    adxValue: 52.8,
    relativeVolume: 2.4,
    lastUpdate: "há 3 min",
  },
  {
    id: "5",
    name: "Cardano",
    ticker: "ADAUSDT",
    tacticalContext: "Exaustao",
    contextStrength: 82,
    primaryTimeframe: "1d",
    keyIndicators: [
      { name: "ADX", value: "38.9", status: "Forte" },
      { name: "Ribbons", value: "Sobreextendidos", status: "Forte" },
      { name: "Volume", value: "Declinante", status: "Moderado" },
    ],
    sparklineData: [0.95, 0.89, 0.83, 0.77, 0.71, 0.68, 0.66, 0.65, 0.64, 0.63],
    volatilityCompression: 25,
    priceInclination: "Baixa",
    systemComment: "Zona de exaustão identificada. Ribbons sobreextendidos com volume declinante.",
    alerts: {
      reversalProbable: true,
      contextChanged: false,
      structuralDivergence: false,
    },
    adxValue: 38.9,
    relativeVolume: 0.8,
    lastUpdate: "há 8 min",
  },
  {
    id: "6",
    name: "Polkadot",
    ticker: "DOTUSDT",
    tacticalContext: "Desconhecido",
    contextStrength: 35,
    primaryTimeframe: "4h",
    keyIndicators: [
      { name: "ADX", value: "N/A", status: "Fraco" },
      { name: "Ribbons", value: "Anômalo", status: "Fraco" },
      { name: "Volume", value: "Inconsistente", status: "Fraco" },
    ],
    sparklineData: [8.5, 8.9, 8.1, 8.7, 8.3, 8.8, 8.2, 8.6, 8.4, 8.5],
    volatilityCompression: 60,
    priceInclination: "Lateral",
    systemComment: "Comportamento anômalo detectado. Dados insuficientes para classificação tática.",
    alerts: {
      reversalProbable: false,
      contextChanged: true,
      structuralDivergence: false,
    },
    adxValue: 0,
    relativeVolume: 0.9,
    lastUpdate: "há 15 min",
  },
]

export default function ContextoPage() {
  const [assets, setAssets] = useState<AssetData[]>(mockAssets)
  const [sortBy, setSortBy] = useState<"adx" | "volume" | "strength">("strength")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedContext, setSelectedContext] = useState("Todos")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Categorizar ativos por contexto tático
  const idealAssets = assets.filter((asset) => asset.tacticalContext === "Ideal")
  const neutroAssets = assets.filter((asset) => asset.tacticalContext === "Neutro")
  const adversoAssets = assets.filter((asset) => asset.tacticalContext === "Adverso")
  const extensaoAssets = assets.filter((asset) => asset.tacticalContext === "Extensao")
  const exaustaoAssets = assets.filter((asset) => asset.tacticalContext === "Exaustao")
  const desconhecidoAssets = assets.filter((asset) => asset.tacticalContext === "Desconhecido")

  // Calcular distribuição percentual
  const totalAssets = assets.length
  const contextDistribution = [
    {
      name: "Ideal",
      count: idealAssets.length,
      percentage: Math.round((idealAssets.length / totalAssets) * 100),
      color: "bg-emerald-600",
    },
    {
      name: "Neutro",
      count: neutroAssets.length,
      percentage: Math.round((neutroAssets.length / totalAssets) * 100),
      color: "bg-slate-500",
    },
    {
      name: "Adverso",
      count: adversoAssets.length,
      percentage: Math.round((adversoAssets.length / totalAssets) * 100),
      color: "bg-red-500",
    },
    {
      name: "Extensão",
      count: extensaoAssets.length,
      percentage: Math.round((extensaoAssets.length / totalAssets) * 100),
      color: "bg-purple-500",
    },
    {
      name: "Exaustão",
      count: exaustaoAssets.length,
      percentage: Math.round((exaustaoAssets.length / totalAssets) * 100),
      color: "bg-orange-500",
    },
    {
      name: "Desconhecido",
      count: desconhecidoAssets.length,
      percentage: Math.round((desconhecidoAssets.length / totalAssets) * 100),
      color: "bg-amber-500",
    },
  ]

  const getContextConfig = (context: string) => {
    switch (context) {
      case "Ideal":
        return {
          name: "Contexto Ideal",
          color: "text-emerald-400",
          bg: "bg-emerald-600/10",
          border: "border-emerald-600/30",
          icon: <CheckCircle className="w-4 h-4" />,
        }
      case "Neutro":
        return {
          name: "Contexto Neutro",
          color: "text-slate-400",
          bg: "bg-slate-500/10",
          border: "border-slate-500/30",
          icon: <Minus className="w-4 h-4" />,
        }
      case "Adverso":
        return {
          name: "Contexto Adverso",
          color: "text-red-400",
          bg: "bg-red-500/10",
          border: "border-red-500/30",
          icon: <XCircle className="w-4 h-4" />,
        }
      case "Extensao":
        return {
          name: "Extensão de Tendência",
          color: "text-purple-400",
          bg: "bg-purple-500/10",
          border: "border-purple-500/30",
          icon: <ArrowUpDown className="w-4 h-4" />,
        }
      case "Exaustao":
        return {
          name: "Zona de Exaustão",
          color: "text-orange-400",
          bg: "bg-orange-500/10",
          border: "border-orange-500/30",
          icon: <AlertTriangle className="w-4 h-4" />,
        }
      case "Desconhecido":
        return {
          name: "Contexto Desconhecido",
          color: "text-amber-400",
          bg: "bg-amber-500/10",
          border: "border-amber-500/30",
          icon: <HelpCircle className="w-4 h-4" />,
        }
      default:
        return {
          name: "Indefinido",
          color: "text-slate-400",
          bg: "bg-slate-500/10",
          border: "border-slate-500/30",
          icon: <Activity className="w-4 h-4" />,
        }
    }
  }

  const sortAssets = (assetList: AssetData[]) => {
    return [...assetList].sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "adx":
          comparison = a.adxValue - b.adxValue
          break
        case "volume":
          comparison = a.relativeVolume - b.relativeVolume
          break
        case "strength":
          comparison = a.contextStrength - b.contextStrength
          break
      }
      return sortOrder === "desc" ? -comparison : comparison
    })
  }

  const filteredAssets =
    selectedContext === "Todos" ? assets : assets.filter((asset) => asset.tacticalContext === selectedContext)

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Settings className="w-8 h-8 text-purple-400 mr-4" />
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Gestão de Contexto</h1>
            <p className="text-slate-400 mt-1">Mapa tático do estado operacional atual de cada ativo</p>
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

      {/* 1️⃣ Panorama Global */}
      <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Estatísticas Gerais */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-slate-100 mb-3 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2 text-purple-400" />
              Panorama Global
            </h3>
            <div className="space-y-2">
              <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-slate-100">{totalAssets}</p>
                <p className="text-xs text-slate-400">Total Monitorados</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-emerald-600/10 border border-emerald-600/30 rounded-lg p-2 text-center">
                  <p className="text-sm font-bold text-emerald-400">{idealAssets.length}</p>
                  <p className="text-xs text-slate-400">Contexto Ideal</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 text-center">
                  <p className="text-sm font-bold text-red-400">{adversoAssets.length + exaustaoAssets.length}</p>
                  <p className="text-xs text-slate-400">Contextos Críticos</p>
                </div>
              </div>
            </div>
          </div>

          {/* Distribuição por Contexto */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-slate-100 mb-3">Distribuição por Estado Tático</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {contextDistribution.map((context, index) => (
                <div key={index} className="bg-slate-700/30 rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <div className={`w-3 h-3 rounded-full ${context.color} mr-2`}></div>
                    <p className="text-xs font-medium text-slate-300">{context.name}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-100">{context.count}</span>
                    <span className="text-xs text-slate-400">{context.percentage}%</span>
                  </div>
                  <div className="mt-2 h-1 bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${context.color} transition-all duration-1000`}
                      style={{ width: `${context.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Controles de Filtro e Ordenação */}
      <div className="flex items-center justify-between bg-slate-800/50 rounded-2xl p-3 border border-slate-700/50">
        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-400">Filtrar por:</span>
          <select
            value={selectedContext}
            onChange={(e) => setSelectedContext(e.target.value)}
            className="bg-slate-700/50 border border-slate-600/50 rounded-lg px-2 py-1 text-xs text-slate-100"
          >
            <option value="Todos">Todos os Contextos</option>
            <option value="Ideal">Contexto Ideal</option>
            <option value="Neutro">Contexto Neutro</option>
            <option value="Adverso">Contexto Adverso</option>
            <option value="Extensao">Extensão de Tendência</option>
            <option value="Exaustao">Zona de Exaustão</option>
            <option value="Desconhecido">Contexto Desconhecido</option>
          </select>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-400">Ordenar por:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-700/50 border border-slate-600/50 rounded-lg px-2 py-1 text-xs text-slate-100"
          >
            <option value="strength">Força do Contexto</option>
            <option value="adx">Intensidade ADX</option>
            <option value="volume">Volume Relativo</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="p-1 bg-slate-700/50 hover:bg-slate-600/50 rounded text-slate-300 hover:text-emerald-400 transition-all duration-200"
          >
            {sortOrder === "desc" ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* 2️⃣ Blocos de Ativos por Contexto */}
      <div className="space-y-5">
        {/* Contexto Ideal */}
        {(selectedContext === "Todos" || selectedContext === "Ideal") && idealAssets.length > 0 && (
          <ContextSection title="Contexto Ideal" assets={sortAssets(idealAssets)} config={getContextConfig("Ideal")} />
        )}

        {/* Extensão de Tendência */}
        {(selectedContext === "Todos" || selectedContext === "Extensao") && extensaoAssets.length > 0 && (
          <ContextSection
            title="Extensão de Tendência"
            assets={sortAssets(extensaoAssets)}
            config={getContextConfig("Extensao")}
          />
        )}

        {/* Zona de Exaustão */}
        {(selectedContext === "Todos" || selectedContext === "Exaustao") && exaustaoAssets.length > 0 && (
          <ContextSection
            title="Zona de Exaustão"
            assets={sortAssets(exaustaoAssets)}
            config={getContextConfig("Exaustao")}
          />
        )}

        {/* Contexto Neutro */}
        {(selectedContext === "Todos" || selectedContext === "Neutro") && neutroAssets.length > 0 && (
          <ContextSection
            title="Contexto Neutro"
            assets={sortAssets(neutroAssets)}
            config={getContextConfig("Neutro")}
          />
        )}

        {/* Contexto Adverso */}
        {(selectedContext === "Todos" || selectedContext === "Adverso") && adversoAssets.length > 0 && (
          <ContextSection
            title="Contexto Adverso"
            assets={sortAssets(adversoAssets)}
            config={getContextConfig("Adverso")}
          />
        )}

        {/* Contexto Desconhecido */}
        {(selectedContext === "Todos" || selectedContext === "Desconhecido") && desconhecidoAssets.length > 0 && (
          <ContextSection
            title="Contexto Desconhecido"
            assets={sortAssets(desconhecidoAssets)}
            config={getContextConfig("Desconhecido")}
          />
        )}
      </div>
    </div>
  )
}

// Componente ContextSection
function ContextSection({
  title,
  assets,
  config,
}: {
  title: string
  assets: AssetData[]
  config: { name: string; color: string; bg: string; border: string; icon: React.ReactNode }
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg mr-3 ${config.bg}`}>
          <div className={config.color}>{config.icon}</div>
        </div>
        <h2 className={`text-lg font-semibold ${config.color}`}>{title}</h2>
        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
          {assets.length} ativos
        </span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {assets.map((asset, index) => (
          <AssetCard key={asset.id} asset={asset} index={index} config={config} />
        ))}
      </div>
    </div>
  )
}

// Componente AssetCard
function AssetCard({
  asset,
  index,
  config,
}: {
  asset: AssetData
  index: number
  config: { name: string; color: string; bg: string; border: string; icon: React.ReactNode }
}) {
  const getIndicatorStatusColor = (status: string) => {
    switch (status) {
      case "Forte":
        return "text-emerald-400"
      case "Moderado":
        return "text-amber-400"
      default:
        return "text-slate-400"
    }
  }

  const getInclinationIcon = (inclination: string) => {
    switch (inclination) {
      case "Alta":
        return <TrendingUp className="w-3 h-3 text-emerald-400" />
      case "Baixa":
        return <TrendingDown className="w-3 h-3 text-red-400" />
      default:
        return <Minus className="w-3 h-3 text-slate-400" />
    }
  }

  // Calcular min e max para normalizar sparkline
  const minValue = Math.min(...asset.sparklineData)
  const maxValue = Math.max(...asset.sparklineData)
  const range = maxValue - minValue || 1

  return (
    <div
      className={`bg-slate-800/50 rounded-xl border ${config.border} hover:border-slate-600/50 transition-all duration-200 animate-fade-in-up ${
        asset.alerts.contextChanged ? "ring-2 ring-blue-500/30" : ""
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">{asset.name}</h3>
            <p className="text-xs text-slate-400">{asset.ticker}</p>
          </div>
          <div className="flex items-center space-x-2">
            {asset.alerts.reversalProbable && (
              <RotateCcw className="w-3 h-3 text-orange-400" title="Alta probabilidade de reversão" />
            )}
            {asset.alerts.contextChanged && <Zap className="w-3 h-3 text-blue-400" title="Contexto recém-alterado" />}
            {asset.alerts.structuralDivergence && (
              <AlertTriangle className="w-3 h-3 text-amber-400" title="Divergência estrutural" />
            )}
            <div className={`px-2 py-1 rounded-lg ${config.bg} ${config.border} border`}>
              <span className={`text-xs font-medium ${config.color}`}>{config.name}</span>
            </div>
          </div>
        </div>

        {/* Indicadores-Chave */}
        <div className="mb-3">
          <p className="text-xs text-slate-400 mb-2">Indicadores Definidores</p>
          <div className="grid grid-cols-3 gap-2">
            {asset.keyIndicators.map((indicator, idx) => (
              <div key={idx} className="bg-slate-700/30 rounded px-2 py-1 text-center">
                <p className="text-xs font-medium text-slate-300">{indicator.name}</p>
                <p className={`text-xs ${getIndicatorStatusColor(indicator.status)}`}>{indicator.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mini Sparkline */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-slate-400">Comportamento Recente</p>
            <div className="flex items-center space-x-2">
              {getInclinationIcon(asset.priceInclination)}
              <span className="text-xs text-slate-400">Compressão: {asset.volatilityCompression}%</span>
            </div>
          </div>
          <div className="flex items-end justify-between h-6 space-x-0.5">
            {asset.sparklineData.map((value, idx) => (
              <div
                key={idx}
                className={`flex-1 rounded-t transition-all duration-300 ${
                  asset.priceInclination === "Alta"
                    ? "bg-emerald-400/60"
                    : asset.priceInclination === "Baixa"
                      ? "bg-red-400/60"
                      : "bg-slate-400/60"
                }`}
                style={{
                  height: `${Math.max(((value - minValue) / range) * 20, 2)}px`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Dados do Contexto */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Força do Contexto</p>
            <p className={`text-sm font-bold ${config.color}`}>{asset.contextStrength}%</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Timeframe</p>
            <span className="text-xs bg-slate-600/50 text-slate-300 px-2 py-0.5 rounded-full">
              {asset.primaryTimeframe}
            </span>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">ADX</p>
            <p className="text-sm font-medium text-slate-300">{asset.adxValue || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Vol. Relativo</p>
            <p className="text-sm font-medium text-slate-300">{asset.relativeVolume}x</p>
          </div>
        </div>

        {/* Comentário do Sistema */}
        <div className="mb-3">
          <p className="text-xs text-slate-400 mb-1">Análise Tática</p>
          <div className="bg-slate-700/30 rounded-lg p-2">
            <p className="text-xs text-slate-300 leading-relaxed">{asset.systemComment}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
          <div className="flex items-center space-x-2">
            <button
              className="p-1 bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-blue-400 rounded transition-all duration-200"
              title="Criar alerta de mudança de contexto"
            >
              <Bell className="w-3 h-3" />
            </button>
            <span className="text-xs text-slate-500">{asset.lastUpdate}</span>
          </div>
          <button className="flex items-center bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-emerald-400 px-2 py-1 rounded-lg transition-all duration-200">
            <Eye className="w-3 h-3 mr-1" />
            <span className="text-xs">Analisar Ativo</span>
          </button>
        </div>
      </div>
    </div>
  )
}
