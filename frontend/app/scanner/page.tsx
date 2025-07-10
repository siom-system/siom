"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Zap,
  Activity,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Eye,
  Search,
  Filter,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Target,
  Flame,
  Clock,
  ArrowUpRight,
} from "lucide-react"

interface TechnicalData {
  bollingerWidth: number
  relativeVolume: number
  adx: number
  trendInclination: "Alta" | "Baixa" | "Lateral"
}

interface AssetData {
  id: string
  name: string
  ticker: string
  volatilityState: "Squeeze_Critico" | "Pre_Squeeze" | "Expansao" | "Breakout_Ativo" | "Alta_Sustentada" | "Normal"
  volatilityScore: number // 0-100
  tensionScore: number // 0-100
  sparklineData: number[]
  technicalData: TechnicalData
  systemComment: string
  alerts: {
    extremeVolatility: boolean
    recentBreakout: boolean
    consistentVolatility: boolean
  }
  timeInState: number // em horas
  lastUpdate: string
}

const mockAssets: AssetData[] = [
  {
    id: "1",
    name: "Bitcoin",
    ticker: "BTCUSDT",
    volatilityState: "Breakout_Ativo",
    volatilityScore: 92,
    tensionScore: 88,
    sparklineData: [44000, 44200, 44100, 44800, 46200, 47500, 48900, 49200, 49800, 50100],
    technicalData: {
      bollingerWidth: 0.085,
      relativeVolume: 2.4,
      adx: 48.5,
      trendInclination: "Alta",
    },
    systemComment: "Breakout confirmado com volume excepcional. Bollinger Bands em máxima expansão.",
    alerts: {
      extremeVolatility: true,
      recentBreakout: true,
      consistentVolatility: false,
    },
    timeInState: 4,
    lastUpdate: "há 1 min",
  },
  {
    id: "2",
    name: "Solana",
    ticker: "SOLUSDT",
    volatilityState: "Squeeze_Critico",
    volatilityScore: 15,
    tensionScore: 95,
    sparklineData: [95.2, 95.1, 95.3, 95.0, 95.2, 95.1, 95.4, 95.0, 95.3, 95.1],
    technicalData: {
      bollingerWidth: 0.012,
      relativeVolume: 0.3,
      adx: 18.2,
      trendInclination: "Lateral",
    },
    systemComment: "Squeeze crítico detectado. Bollinger Bands em compressão extrema, tensão máxima acumulada.",
    alerts: {
      extremeVolatility: false,
      recentBreakout: false,
      consistentVolatility: false,
    },
    timeInState: 18,
    lastUpdate: "há 2 min",
  },
  {
    id: "3",
    name: "Ethereum",
    ticker: "ETHUSDT",
    volatilityState: "Pre_Squeeze",
    volatilityScore: 28,
    tensionScore: 72,
    sparklineData: [3200, 3180, 3220, 3190, 3210, 3195, 3205, 3188, 3215, 3200],
    technicalData: {
      bollingerWidth: 0.025,
      relativeVolume: 0.8,
      adx: 25.1,
      trendInclination: "Lateral",
    },
    systemComment: "Entrando em fase de compressão. Bollinger Bands se contraindo, tensão em acúmulo.",
    alerts: {
      extremeVolatility: false,
      recentBreakout: false,
      consistentVolatility: false,
    },
    timeInState: 8,
    lastUpdate: "há 5 min",
  },
  {
    id: "4",
    name: "Chainlink",
    ticker: "LINKUSDT",
    volatilityState: "Alta_Sustentada",
    volatilityScore: 78,
    tensionScore: 65,
    sparklineData: [22, 24, 26, 28, 25, 27, 29, 26, 28, 30],
    technicalData: {
      bollingerWidth: 0.068,
      relativeVolume: 1.6,
      adx: 42.3,
      trendInclination: "Alta",
    },
    systemComment: "Alta volatilidade mantida por período estendido. Movimento consistente com volume adequado.",
    alerts: {
      extremeVolatility: false,
      recentBreakout: false,
      consistentVolatility: true,
    },
    timeInState: 36,
    lastUpdate: "há 3 min",
  },
  {
    id: "5",
    name: "Cardano",
    ticker: "ADAUSDT",
    volatilityState: "Expansao",
    volatilityScore: 58,
    tensionScore: 45,
    sparklineData: [0.85, 0.87, 0.84, 0.89, 0.86, 0.88, 0.85, 0.87, 0.84, 0.86],
    technicalData: {
      bollingerWidth: 0.045,
      relativeVolume: 1.2,
      adx: 32.8,
      trendInclination: "Lateral",
    },
    systemComment: "Fase de expansão iniciada. Bollinger Bands se alargando após período de compressão.",
    alerts: {
      extremeVolatility: false,
      recentBreakout: false,
      consistentVolatility: false,
    },
    timeInState: 12,
    lastUpdate: "há 7 min",
  },
  {
    id: "6",
    name: "Polkadot",
    ticker: "DOTUSDT",
    volatilityState: "Normal",
    volatilityScore: 42,
    tensionScore: 35,
    sparklineData: [8.5, 8.6, 8.4, 8.7, 8.5, 8.6, 8.4, 8.5, 8.6, 8.5],
    technicalData: {
      bollingerWidth: 0.035,
      relativeVolume: 0.9,
      adx: 28.5,
      trendInclination: "Lateral",
    },
    systemComment: "Volatilidade dentro dos padrões normais. Sem sinais de compressão ou expansão significativa.",
    alerts: {
      extremeVolatility: false,
      recentBreakout: false,
      consistentVolatility: false,
    },
    timeInState: 24,
    lastUpdate: "há 10 min",
  },
]

export default function ScannerPage() {
  const [assets, setAssets] = useState<AssetData[]>(mockAssets)
  const [sortBy, setSortBy] = useState<"volatilityScore" | "tensionScore" | "relativeVolume">("volatilityScore")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedState, setSelectedState] = useState("Todos")
  const [searchTerm, setSearchTerm] = useState("")
  const [showOnlyOpportunities, setShowOnlyOpportunities] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Categorizar ativos por estado de volatilidade
  const squeezeCriticoAssets = assets.filter((asset) => asset.volatilityState === "Squeeze_Critico")
  const preSqueezeAssets = assets.filter((asset) => asset.volatilityState === "Pre_Squeeze")
  const expansaoAssets = assets.filter((asset) => asset.volatilityState === "Expansao")
  const breakoutAtivoAssets = assets.filter((asset) => asset.volatilityState === "Breakout_Ativo")
  const altaSustentadaAssets = assets.filter((asset) => asset.volatilityState === "Alta_Sustentada")
  const normalAssets = assets.filter((asset) => asset.volatilityState === "Normal")

  // Calcular distribuição percentual
  const totalAssets = assets.length
  const volatilityDistribution = [
    {
      name: "Squeeze Crítico",
      count: squeezeCriticoAssets.length,
      percentage: Math.round((squeezeCriticoAssets.length / totalAssets) * 100),
      color: "bg-red-600",
    },
    {
      name: "Pré-Squeeze",
      count: preSqueezeAssets.length,
      percentage: Math.round((preSqueezeAssets.length / totalAssets) * 100),
      color: "bg-orange-500",
    },
    {
      name: "Expansão",
      count: expansaoAssets.length,
      percentage: Math.round((expansaoAssets.length / totalAssets) * 100),
      color: "bg-blue-500",
    },
    {
      name: "Breakout Ativo",
      count: breakoutAtivoAssets.length,
      percentage: Math.round((breakoutAtivoAssets.length / totalAssets) * 100),
      color: "bg-emerald-500",
    },
    {
      name: "Alta Sustentada",
      count: altaSustentadaAssets.length,
      percentage: Math.round((altaSustentadaAssets.length / totalAssets) * 100),
      color: "bg-purple-500",
    },
    {
      name: "Normal",
      count: normalAssets.length,
      percentage: Math.round((normalAssets.length / totalAssets) * 100),
      color: "bg-slate-500",
    },
  ]

  const getVolatilityConfig = (state: string) => {
    switch (state) {
      case "Squeeze_Critico":
        return {
          name: "Squeeze Crítico",
          color: "text-red-400",
          bg: "bg-red-600/10",
          border: "border-red-600/30",
          icon: <Target className="w-4 h-4" />,
        }
      case "Pre_Squeeze":
        return {
          name: "Pré-Squeeze",
          color: "text-orange-400",
          bg: "bg-orange-500/10",
          border: "border-orange-500/30",
          icon: <Clock className="w-4 h-4" />,
        }
      case "Expansao":
        return {
          name: "Expansão",
          color: "text-blue-400",
          bg: "bg-blue-500/10",
          border: "border-blue-500/30",
          icon: <ArrowUpRight className="w-4 h-4" />,
        }
      case "Breakout_Ativo":
        return {
          name: "Breakout Ativo",
          color: "text-emerald-400",
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/30",
          icon: <Zap className="w-4 h-4" />,
        }
      case "Alta_Sustentada":
        return {
          name: "Alta Sustentada",
          color: "text-purple-400",
          bg: "bg-purple-500/10",
          border: "border-purple-500/30",
          icon: <Flame className="w-4 h-4" />,
        }
      case "Normal":
        return {
          name: "Volatilidade Normal",
          color: "text-slate-400",
          bg: "bg-slate-500/10",
          border: "border-slate-500/30",
          icon: <Activity className="w-4 h-4" />,
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
        case "volatilityScore":
          comparison = a.volatilityScore - b.volatilityScore
          break
        case "tensionScore":
          comparison = a.tensionScore - b.tensionScore
          break
        case "relativeVolume":
          comparison = a.technicalData.relativeVolume - b.technicalData.relativeVolume
          break
      }
      return sortOrder === "desc" ? -comparison : comparison
    })
  }

  // Filtrar ativos
  let filteredAssets = assets

  if (searchTerm) {
    filteredAssets = filteredAssets.filter(
      (asset) =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.ticker.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  if (selectedState !== "Todos") {
    filteredAssets = filteredAssets.filter((asset) => asset.volatilityState === selectedState)
  }

  if (showOnlyOpportunities) {
    filteredAssets = filteredAssets.filter(
      (asset) => asset.volatilityState === "Squeeze_Critico" || asset.volatilityState === "Breakout_Ativo",
    )
  }

  // Contar oportunidades críticas
  const criticalOpportunities = squeezeCriticoAssets.length + breakoutAtivoAssets.length

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Zap className="w-8 h-8 text-amber-400 mr-4" />
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Scanner de Volatilidade</h1>
            <p className="text-slate-400 mt-1">Radar avançado para detecção de breakouts e oportunidades de mercado</p>
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

      {/* 1️⃣ Painel Superior */}
      <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Estatísticas Gerais */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-slate-100 mb-3 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2 text-amber-400" />
              Visão Geral
            </h3>
            <div className="space-y-2">
              <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-slate-100">{totalAssets}</p>
                <p className="text-xs text-slate-400">Total Monitorados</p>
              </div>
              <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Target className="w-4 h-4 text-red-400 mr-1" />
                  <p className="text-sm font-bold text-red-400">{squeezeCriticoAssets.length}</p>
                </div>
                <p className="text-xs text-slate-400">Squeeze Crítico</p>
              </div>
              <button
                onClick={() => setShowOnlyOpportunities(!showOnlyOpportunities)}
                className={`w-full p-2 rounded-lg transition-all duration-200 ${
                  showOnlyOpportunities
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-slate-700/50 text-slate-300 hover:text-emerald-400"
                }`}
              >
                <div className="flex items-center justify-center">
                  <Flame className="w-3 h-3 mr-1" />
                  <span className="text-xs">Oportunidades ({criticalOpportunities})</span>
                </div>
              </button>
            </div>
          </div>

          {/* Distribuição por Estado */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-slate-100 mb-3">Distribuição por Estado de Volatilidade</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {volatilityDistribution.map((state, index) => (
                <div key={index} className="bg-slate-700/30 rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <div className={`w-3 h-3 rounded-full ${state.color} mr-2`}></div>
                    <p className="text-xs font-medium text-slate-300">{state.name}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-100">{state.count}</span>
                    <span className="text-xs text-slate-400">{state.percentage}%</span>
                  </div>
                  <div className="mt-2 h-1 bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${state.color} transition-all duration-1000`}
                      style={{ width: `${state.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Controles de Filtro e Busca */}
      <div className="bg-slate-800/50 rounded-2xl p-3 border border-slate-700/50">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          {/* Campo de Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar ativo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-400 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-sm"
            />
          </div>

          {/* Filtro por Estado */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-sm text-slate-100"
          >
            <option value="Todos">Todos os Estados</option>
            <option value="Squeeze_Critico">Squeeze Crítico</option>
            <option value="Pre_Squeeze">Pré-Squeeze</option>
            <option value="Expansao">Expansão</option>
            <option value="Breakout_Ativo">Breakout Ativo</option>
            <option value="Alta_Sustentada">Alta Sustentada</option>
            <option value="Normal">Normal</option>
          </select>

          {/* Ordenação */}
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-sm text-slate-100"
            >
              <option value="volatilityScore">Volatility Score</option>
              <option value="tensionScore">Tension Score</option>
              <option value="relativeVolume">Volume Relativo</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
              className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-slate-300 hover:text-emerald-400 transition-all duration-200"
            >
              {sortOrder === "desc" ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2️⃣ Blocos de Ativos por Estado */}
      <div className="space-y-5">
        {/* Squeeze Crítico */}
        {(selectedState === "Todos" || selectedState === "Squeeze_Critico") &&
          squeezeCriticoAssets.filter((asset) =>
            searchTerm
              ? asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                asset.ticker.toLowerCase().includes(searchTerm.toLowerCase())
              : true,
          ).length > 0 && (
            <VolatilitySection
              title="Squeeze Crítico"
              assets={sortAssets(
                squeezeCriticoAssets.filter((asset) =>
                  searchTerm
                    ? asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      asset.ticker.toLowerCase().includes(searchTerm.toLowerCase())
                    : true,
                ),
              )}
              config={getVolatilityConfig("Squeeze_Critico")}
            />
          )}

        {/* Breakout Ativo */}
        {(selectedState === "Todos" || selectedState === "Breakout_Ativo") &&
          breakoutAtivoAssets.filter((asset) =>
            searchTerm
              ? asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                asset.ticker.toLowerCase().includes(searchTerm.toLowerCase())
              : true,
          ).length > 0 && (
            <VolatilitySection
              title="Breakout Ativo"
              assets={sortAssets(
                breakoutAtivoAssets.filter((asset) =>
                  searchTerm
                    ? asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      asset.ticker.toLowerCase().includes(searchTerm.toLowerCase())
                    : true,
                ),
              )}
              config={getVolatilityConfig("Breakout_Ativo")}
            />
          )}

        {/* Pré-Squeeze */}
        {(selectedState === "Todos" || selectedState === "Pre_Squeeze") &&
          !showOnlyOpportunities &&
          preSqueezeAssets.filter((asset) =>
            searchTerm
              ? asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                asset.ticker.toLowerCase().includes(searchTerm.toLowerCase())
              : true,
          ).length > 0 && (
            <VolatilitySection
              title="Pré-Squeeze"
              assets={sortAssets(
                preSqueezeAssets.filter((asset) =>
                  searchTerm
                    ? asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      asset.ticker.toLowerCase().includes(searchTerm.toLowerCase())
                    : true,
                ),
              )}
              config={getVolatilityConfig("Pre_Squeeze")}
            />
          )}

        {/* Alta Sustentada */}
        {(selectedState === "Todos" || selectedState === "Alta_Sustentada") &&
          !showOnlyOpportunities &&
          altaSustentadaAssets.filter((asset) =>
            searchTerm
              ? asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                asset.ticker.toLowerCase().includes(searchTerm.toLowerCase())
              : true,
          ).length > 0 && (
            <VolatilitySection
              title="Alta Sustentada"
              assets={sortAssets(
                altaSustentadaAssets.filter((asset) =>
                  searchTerm
                    ? asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      asset.ticker.toLowerCase().includes(searchTerm.toLowerCase())
                    : true,
                ),
              )}
              config={getVolatilityConfig("Alta_Sustentada")}
            />
          )}

        {/* Expansão */}
        {(selectedState === "Todos" || selectedState === "Expansao") &&
          !showOnlyOpportunities &&
          expansaoAssets.filter((asset) =>
            searchTerm
              ? asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                asset.ticker.toLowerCase().includes(searchTerm.toLowerCase())
              : true,
          ).length > 0 && (
            <VolatilitySection
              title="Expansão"
              assets={sortAssets(
                expansaoAssets.filter((asset) =>
                  searchTerm
                    ? asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      asset.ticker.toLowerCase().includes(searchTerm.toLowerCase())
                    : true,
                ),
              )}
              config={getVolatilityConfig("Expansao")}
            />
          )}

        {/* Normal */}
        {(selectedState === "Todos" || selectedState === "Normal") &&
          !showOnlyOpportunities &&
          normalAssets.filter((asset) =>
            searchTerm
              ? asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                asset.ticker.toLowerCase().includes(searchTerm.toLowerCase())
              : true,
          ).length > 0 && (
            <VolatilitySection
              title="Volatilidade Normal"
              assets={sortAssets(
                normalAssets.filter((asset) =>
                  searchTerm
                    ? asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      asset.ticker.toLowerCase().includes(searchTerm.toLowerCase())
                    : true,
                ),
              )}
              config={getVolatilityConfig("Normal")}
            />
          )}
      </div>

      {filteredAssets.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Nenhum ativo encontrado</p>
            <p className="text-sm">Tente ajustar os filtros de busca</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Componente VolatilitySection
function VolatilitySection({
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
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "Alta":
        return <TrendingUp className="w-3 h-3 text-emerald-400" />
      case "Baixa":
        return <TrendingUp className="w-3 h-3 text-red-400 rotate-180" />
      default:
        return <Activity className="w-3 h-3 text-slate-400" />
    }
  }

  // Calcular min e max para normalizar sparkline
  const minValue = Math.min(...asset.sparklineData)
  const maxValue = Math.max(...asset.sparklineData)
  const range = maxValue - minValue || 1

  return (
    <div
      className={`bg-slate-800/50 rounded-xl border ${config.border} hover:border-slate-600/50 transition-all duration-200 animate-fade-in-up`}
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
            {asset.alerts.extremeVolatility && (
              <AlertTriangle className="w-3 h-3 text-red-400" title="Volatilidade extrema" />
            )}
            {asset.alerts.recentBreakout && <Zap className="w-3 h-3 text-emerald-400" title="Breakout recente" />}
            {asset.alerts.consistentVolatility && (
              <Flame className="w-3 h-3 text-purple-400" title="Volatilidade consistente" />
            )}
            <div className={`px-2 py-1 rounded-lg ${config.bg} ${config.border} border`}>
              <span className={`text-xs font-medium ${config.color}`}>{config.name}</span>
            </div>
          </div>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-slate-700/30 rounded-lg p-2 text-center">
            <p className="text-xs text-slate-400 mb-0.5">Volatility Score</p>
            <p className={`text-lg font-bold ${config.color}`}>{asset.volatilityScore}</p>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-2 text-center">
            <p className="text-xs text-slate-400 mb-0.5">Tension Score</p>
            <p className={`text-lg font-bold ${config.color}`}>{asset.tensionScore}</p>
          </div>
        </div>

        {/* Mini Sparkline */}
        <div className="mb-3">
          <p className="text-xs text-slate-400 mb-1">Comportamento Recente</p>
          <div className="flex items-end justify-between h-6 space-x-0.5">
            {asset.sparklineData.map((value, idx) => (
              <div
                key={idx}
                className={`flex-1 rounded-t transition-all duration-300 ${
                  asset.volatilityState === "Breakout_Ativo"
                    ? "bg-emerald-400/60"
                    : asset.volatilityState === "Squeeze_Critico"
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

        {/* Dados Técnicos */}
        <div className="mb-3">
          <p className="text-xs text-slate-400 mb-2">Resumo Técnico</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-700/30 rounded px-2 py-1 text-center">
              <p className="text-xs text-slate-400">BB Width</p>
              <p className="text-xs font-medium text-slate-300">{asset.technicalData.bollingerWidth.toFixed(3)}</p>
            </div>
            <div className="bg-slate-700/30 rounded px-2 py-1 text-center">
              <p className="text-xs text-slate-400">Vol. Rel.</p>
              <p className="text-xs font-medium text-slate-300">{asset.technicalData.relativeVolume}x</p>
            </div>
            <div className="bg-slate-700/30 rounded px-2 py-1 text-center">
              <p className="text-xs text-slate-400">ADX</p>
              <p className="text-xs font-medium text-slate-300">{asset.technicalData.adx}</p>
            </div>
          </div>
          <div className="flex items-center justify-center mt-2">
            {getTrendIcon(asset.technicalData.trendInclination)}
            <span className="text-xs text-slate-400 ml-1">Inclinação {asset.technicalData.trendInclination}</span>
          </div>
        </div>

        {/* Comentário do Sistema */}
        <div className="mb-3">
          <div className="bg-slate-700/30 rounded-lg p-2">
            <p className="text-xs text-slate-300 leading-relaxed">{asset.systemComment}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500">Estado há {asset.timeInState}h</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-500">{asset.lastUpdate}</span>
          </div>
          <button className="flex items-center bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-emerald-400 px-2 py-1 rounded-lg transition-all duration-200">
            <Eye className="w-3 h-3 mr-1" />
            <span className="text-xs">Analisar</span>
          </button>
        </div>
      </div>
    </div>
  )
}
