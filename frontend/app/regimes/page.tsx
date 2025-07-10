"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpDown,
  Zap,
  RotateCcw,
  Eye,
  Bell,
  Filter,
  RefreshCw,
  BarChart3,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
} from "lucide-react"

interface RegimeIndicator {
  name: string
  status: "Confirmado" | "Parcial" | "Fraco"
}

interface AssetData {
  id: string
  name: string
  ticker: string
  regime: "Tendencia_Alta" | "Tendencia_Baixa" | "Consolidacao" | "Extensao" | "Transicao" | "Squeeze"
  regimeStrength: number
  timeInRegime: number // em horas
  primaryTimeframe: string
  volatility: "Low" | "Medium" | "High"
  sparklineData: number[] // últimos 10 candles
  indicators: RegimeIndicator[]
  alerts: {
    transitionImminent: boolean
    pressureIntense: boolean
    recentChange: boolean
  }
  lastUpdate: string
  direction: "Bullish" | "Bearish" | "Neutral"
}

const mockAssets: AssetData[] = [
  {
    id: "1",
    name: "Bitcoin",
    ticker: "BTCUSDT",
    regime: "Tendencia_Alta",
    regimeStrength: 85,
    timeInRegime: 18,
    primaryTimeframe: "4h",
    volatility: "High",
    sparklineData: [42000, 42500, 43200, 44100, 44800, 45200, 45800, 46100, 46500, 47000],
    indicators: [
      { name: "DMI Forte", status: "Confirmado" },
      { name: "Estrutura Tendencial", status: "Confirmado" },
      { name: "Volume Crescente", status: "Parcial" },
    ],
    alerts: {
      transitionImminent: false,
      pressureIntense: true,
      recentChange: false,
    },
    lastUpdate: "há 3 min",
    direction: "Bullish",
  },
  {
    id: "2",
    name: "Ethereum",
    ticker: "ETHUSDT",
    regime: "Consolidacao",
    regimeStrength: 72,
    timeInRegime: 36,
    primaryTimeframe: "1h",
    volatility: "Low",
    sparklineData: [3200, 3180, 3220, 3190, 3210, 3195, 3205, 3188, 3215, 3200],
    indicators: [
      { name: "Range Definido", status: "Confirmado" },
      { name: "Volume Baixo", status: "Confirmado" },
      { name: "Suporte/Resistência", status: "Parcial" },
    ],
    alerts: {
      transitionImminent: true,
      pressureIntense: false,
      recentChange: false,
    },
    lastUpdate: "há 8 min",
    direction: "Neutral",
  },
  {
    id: "3",
    name: "Solana",
    ticker: "SOLUSDT",
    regime: "Squeeze",
    regimeStrength: 91,
    timeInRegime: 12,
    primaryTimeframe: "4h",
    volatility: "Low",
    sparklineData: [95, 94.5, 95.2, 94.8, 95.1, 94.9, 95.0, 94.7, 95.3, 95.1],
    indicators: [
      { name: "Bollinger Squeeze", status: "Confirmado" },
      { name: "Volume Decrescente", status: "Confirmado" },
      { name: "ATR Mínimo", status: "Confirmado" },
    ],
    alerts: {
      transitionImminent: true,
      pressureIntense: true,
      recentChange: false,
    },
    lastUpdate: "há 5 min",
    direction: "Neutral",
  },
  {
    id: "4",
    name: "Cardano",
    ticker: "ADAUSDT",
    regime: "Tendencia_Baixa",
    regimeStrength: 78,
    timeInRegime: 24,
    primaryTimeframe: "1d",
    volatility: "Medium",
    sparklineData: [0.95, 0.92, 0.89, 0.86, 0.83, 0.8, 0.78, 0.75, 0.73, 0.7],
    indicators: [
      { name: "Estrutura Baixista", status: "Confirmado" },
      { name: "DMI Negativo", status: "Confirmado" },
      { name: "Volume Confirmação", status: "Parcial" },
    ],
    alerts: {
      transitionImminent: false,
      pressureIntense: true,
      recentChange: false,
    },
    lastUpdate: "há 12 min",
    direction: "Bearish",
  },
  {
    id: "5",
    name: "Chainlink",
    ticker: "LINKUSDT",
    regime: "Extensao",
    regimeStrength: 88,
    timeInRegime: 8,
    primaryTimeframe: "1h",
    volatility: "High",
    sparklineData: [22, 23.5, 25.2, 26.8, 28.5, 30.1, 31.8, 33.2, 34.9, 36.5],
    indicators: [
      { name: "RSI Extremo", status: "Confirmado" },
      { name: "Extensão Fibonacci", status: "Confirmado" },
      { name: "Volume Climático", status: "Parcial" },
    ],
    alerts: {
      transitionImminent: true,
      pressureIntense: true,
      recentChange: false,
    },
    lastUpdate: "há 2 min",
    direction: "Bullish",
  },
  {
    id: "6",
    name: "Polkadot",
    ticker: "DOTUSDT",
    regime: "Transicao",
    regimeStrength: 65,
    timeInRegime: 6,
    primaryTimeframe: "4h",
    volatility: "Medium",
    sparklineData: [8.5, 8.7, 8.3, 8.9, 8.1, 8.6, 8.4, 8.8, 8.2, 8.7],
    indicators: [
      { name: "Mudança Estrutural", status: "Parcial" },
      { name: "Volume Irregular", status: "Parcial" },
      { name: "Rompimento Pendente", status: "Fraco" },
    ],
    alerts: {
      transitionImminent: true,
      pressureIntense: false,
      recentChange: true,
    },
    lastUpdate: "há 1 min",
    direction: "Neutral",
  },
]

export default function RegimesPage() {
  const [assets, setAssets] = useState<AssetData[]>(mockAssets)
  const [sortBy, setSortBy] = useState<"direction" | "timeInRegime" | "volatility">("direction")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedTimeframe, setSelectedTimeframe] = useState("Todos")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Categorizar ativos por regime
  const tendenciaAltaAssets = assets.filter((asset) => asset.regime === "Tendencia_Alta")
  const tendenciaBaixaAssets = assets.filter((asset) => asset.regime === "Tendencia_Baixa")
  const consolidacaoAssets = assets.filter((asset) => asset.regime === "Consolidacao")
  const extensaoAssets = assets.filter((asset) => asset.regime === "Extensao")
  const transicaoAssets = assets.filter((asset) => asset.regime === "Transicao")
  const squeezeAssets = assets.filter((asset) => asset.regime === "Squeeze")

  // Calcular distribuição percentual
  const totalAssets = assets.length
  const regimeDistribution = [
    {
      name: "Tendência Alta",
      count: tendenciaAltaAssets.length,
      percentage: Math.round((tendenciaAltaAssets.length / totalAssets) * 100),
      color: "bg-emerald-500",
    },
    {
      name: "Tendência Baixa",
      count: tendenciaBaixaAssets.length,
      percentage: Math.round((tendenciaBaixaAssets.length / totalAssets) * 100),
      color: "bg-red-500",
    },
    {
      name: "Consolidação",
      count: consolidacaoAssets.length,
      percentage: Math.round((consolidacaoAssets.length / totalAssets) * 100),
      color: "bg-slate-500",
    },
    {
      name: "Extensão",
      count: extensaoAssets.length,
      percentage: Math.round((extensaoAssets.length / totalAssets) * 100),
      color: "bg-purple-500",
    },
    {
      name: "Transição",
      count: transicaoAssets.length,
      percentage: Math.round((transicaoAssets.length / totalAssets) * 100),
      color: "bg-orange-500",
    },
    {
      name: "Squeeze",
      count: squeezeAssets.length,
      percentage: Math.round((squeezeAssets.length / totalAssets) * 100),
      color: "bg-blue-500",
    },
  ]

  const getRegimeConfig = (regime: string) => {
    switch (regime) {
      case "Tendencia_Alta":
        return {
          name: "Tendência Alta",
          color: "text-emerald-400",
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/30",
          icon: <TrendingUp className="w-4 h-4" />,
        }
      case "Tendencia_Baixa":
        return {
          name: "Tendência Baixa",
          color: "text-red-400",
          bg: "bg-red-500/10",
          border: "border-red-500/30",
          icon: <TrendingDown className="w-4 h-4" />,
        }
      case "Consolidacao":
        return {
          name: "Consolidação",
          color: "text-slate-400",
          bg: "bg-slate-500/10",
          border: "border-slate-500/30",
          icon: <Minus className="w-4 h-4" />,
        }
      case "Extensao":
        return {
          name: "Extensão",
          color: "text-purple-400",
          bg: "bg-purple-500/10",
          border: "border-purple-500/30",
          icon: <ArrowUpDown className="w-4 h-4" />,
        }
      case "Transicao":
        return {
          name: "Transição",
          color: "text-orange-400",
          bg: "bg-orange-500/10",
          border: "border-orange-500/30",
          icon: <RotateCcw className="w-4 h-4" />,
        }
      case "Squeeze":
        return {
          name: "Squeeze",
          color: "text-blue-400",
          bg: "bg-blue-500/10",
          border: "border-blue-500/30",
          icon: <Zap className="w-4 h-4" />,
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
        case "direction":
          comparison = a.direction.localeCompare(b.direction)
          break
        case "timeInRegime":
          comparison = a.timeInRegime - b.timeInRegime
          break
        case "volatility":
          const volatilityOrder = { Low: 1, Medium: 2, High: 3 }
          comparison = volatilityOrder[a.volatility] - volatilityOrder[b.volatility]
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
          <Activity className="w-8 h-8 text-blue-400 mr-4" />
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Regimes de Mercado</h1>
            <p className="text-slate-400 mt-1">Mapeamento estrutural e contextual dos ambientes operacionais</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Estatísticas Gerais */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-slate-100 mb-3 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2 text-blue-400" />
              Visão Geral
            </h3>
            <div className="space-y-2">
              <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-slate-100">{totalAssets}</p>
                <p className="text-xs text-slate-400">Total de Ativos</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-2 text-center">
                  <p className="text-sm font-bold text-emerald-400">
                    {tendenciaAltaAssets.length + tendenciaBaixaAssets.length}
                  </p>
                  <p className="text-xs text-slate-400">Em Tendência</p>
                </div>
                <div className="bg-slate-500/10 border border-slate-500/30 rounded-lg p-2 text-center">
                  <p className="text-sm font-bold text-slate-400">{consolidacaoAssets.length}</p>
                  <p className="text-xs text-slate-400">Laterais</p>
                </div>
              </div>
            </div>
          </div>

          {/* Distribuição por Regime */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-slate-100 mb-3">Distribuição por Regime</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {regimeDistribution.map((regime, index) => (
                <div key={index} className="bg-slate-700/30 rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <div className={`w-3 h-3 rounded-full ${regime.color} mr-2`}></div>
                    <p className="text-xs font-medium text-slate-300">{regime.name}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-100">{regime.count}</span>
                    <span className="text-xs text-slate-400">{regime.percentage}%</span>
                  </div>
                  <div className="mt-2 h-1 bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${regime.color} transition-all duration-1000`}
                      style={{ width: `${regime.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
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
            <option value="direction">Direção</option>
            <option value="timeInRegime">Tempo no Regime</option>
            <option value="volatility">Volatilidade</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="p-1 bg-slate-700/50 hover:bg-slate-600/50 rounded text-slate-300 hover:text-emerald-400 transition-all duration-200"
          >
            {sortOrder === "desc" ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-400">Timeframe:</span>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="bg-slate-700/50 border border-slate-600/50 rounded-lg px-2 py-1 text-xs text-slate-100"
          >
            <option value="Todos">Todos</option>
            <option value="15m">15m</option>
            <option value="1h">1h</option>
            <option value="4h">4h</option>
            <option value="1d">1d</option>
          </select>
        </div>
      </div>

      {/* 2️⃣ Blocos de Ativos por Regime */}
      <div className="space-y-5">
        {/* Tendência Alta */}
        {tendenciaAltaAssets.length > 0 && (
          <RegimeSection
            title="Tendência Alta"
            assets={sortAssets(tendenciaAltaAssets)}
            config={getRegimeConfig("Tendencia_Alta")}
          />
        )}

        {/* Tendência Baixa */}
        {tendenciaBaixaAssets.length > 0 && (
          <RegimeSection
            title="Tendência Baixa"
            assets={sortAssets(tendenciaBaixaAssets)}
            config={getRegimeConfig("Tendencia_Baixa")}
          />
        )}

        {/* Consolidação */}
        {consolidacaoAssets.length > 0 && (
          <RegimeSection
            title="Consolidação"
            assets={sortAssets(consolidacaoAssets)}
            config={getRegimeConfig("Consolidacao")}
          />
        )}

        {/* Extensão */}
        {extensaoAssets.length > 0 && (
          <RegimeSection title="Extensão" assets={sortAssets(extensaoAssets)} config={getRegimeConfig("Extensao")} />
        )}

        {/* Transição */}
        {transicaoAssets.length > 0 && (
          <RegimeSection title="Transição" assets={sortAssets(transicaoAssets)} config={getRegimeConfig("Transicao")} />
        )}

        {/* Squeeze */}
        {squeezeAssets.length > 0 && (
          <RegimeSection title="Squeeze" assets={sortAssets(squeezeAssets)} config={getRegimeConfig("Squeeze")} />
        )}
      </div>
    </div>
  )
}

// Componente RegimeSection
function RegimeSection({
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
  const getVolatilityColor = (volatility: string) => {
    switch (volatility) {
      case "High":
        return "text-red-400"
      case "Medium":
        return "text-amber-400"
      default:
        return "text-emerald-400"
    }
  }

  const getIndicatorStatusColor = (status: string) => {
    switch (status) {
      case "Confirmado":
        return "text-emerald-400"
      case "Parcial":
        return "text-amber-400"
      default:
        return "text-slate-400"
    }
  }

  // Calcular min e max para normalizar sparkline
  const minValue = Math.min(...asset.sparklineData)
  const maxValue = Math.max(...asset.sparklineData)
  const range = maxValue - minValue || 1

  return (
    <div
      className={`bg-slate-800/50 rounded-xl border ${config.border} hover:border-slate-600/50 transition-all duration-200 animate-fade-in-up ${
        asset.alerts.recentChange ? "ring-2 ring-blue-500/30" : ""
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
            {asset.alerts.transitionImminent && (
              <AlertTriangle className="w-3 h-3 text-amber-400" title="Transição iminente" />
            )}
            {asset.alerts.pressureIntense && (
              <Zap className="w-3 h-3 text-purple-400" title="Pressão direcional intensa" />
            )}
            <div className={`px-2 py-1 rounded-lg ${config.bg} ${config.border} border`}>
              <span className={`text-xs font-medium ${config.color}`}>{config.name}</span>
            </div>
          </div>
        </div>

        {/* Mini Sparkline */}
        <div className="mb-3">
          <div className="flex items-end justify-between h-8 space-x-0.5">
            {asset.sparklineData.map((value, idx) => (
              <div
                key={idx}
                className={`flex-1 rounded-t transition-all duration-300 ${
                  asset.regime === "Tendencia_Alta"
                    ? "bg-emerald-400/60"
                    : asset.regime === "Tendencia_Baixa"
                      ? "bg-red-400/60"
                      : "bg-slate-400/60"
                }`}
                style={{
                  height: `${Math.max(((value - minValue) / range) * 24, 2)}px`,
                }}
              />
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-1 text-center">Últimos 10 candles</p>
        </div>

        {/* Dados do Regime */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Força do Regime</p>
            <p className={`text-sm font-bold ${config.color}`}>{asset.regimeStrength}%</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Tempo no Regime</p>
            <p className="text-sm font-medium text-slate-300">{asset.timeInRegime}h</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Timeframe</p>
            <span className="text-xs bg-slate-600/50 text-slate-300 px-2 py-0.5 rounded-full">
              {asset.primaryTimeframe}
            </span>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Volatilidade</p>
            <p className={`text-sm font-medium ${getVolatilityColor(asset.volatility)}`}>{asset.volatility}</p>
          </div>
        </div>

        {/* Indicadores Confirmadores */}
        <div className="mb-3">
          <p className="text-xs text-slate-400 mb-2">Indicadores Confirmadores</p>
          <div className="space-y-1">
            {asset.indicators.map((indicator, idx) => (
              <div key={idx} className="flex items-center justify-between bg-slate-700/30 rounded px-2 py-1">
                <span className="text-xs text-slate-300">{indicator.name}</span>
                <span className={`text-xs font-medium ${getIndicatorStatusColor(indicator.status)}`}>
                  {indicator.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
          <div className="flex items-center space-x-2">
            <button
              className="p-1 bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-blue-400 rounded transition-all duration-200"
              title="Criar alerta de mudança de regime"
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
