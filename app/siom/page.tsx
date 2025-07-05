"use client"

import { useState, useEffect } from "react"
import {
  TrendingUp,
  Search,
  RefreshCw,
  Filter,
  Eye,
  Flame,
  AlertTriangle,
  AlertCircle,
  Target,
  Zap,
  Activity,
  BarChart3,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

interface IntegratedAssetData {
  id: string
  name: string
  ticker: string
  dominantTimeframe: string
  alignmentScore: number // 0-100
  riskCategory: "Ideal" | "Atencao" | "Risco"
  priority: "Squeeze" | "Breakout" | "Alta_Volatilidade" | "Normal"
  regime: string
  context: string
  volatility: string
  activeSignals: number
  directionalPressure: "Alta" | "Baixa" | "Lateral" | "Mista"
  sparklineData: number[]
  alerts: {
    squeezeCritico: boolean
    breakoutAtivo: boolean
    altaVolatilidade: boolean
    atencaoNecessaria: boolean
    riscoElevado: boolean
  }
  lastUpdate: string
  volatilityScore: number
  pressureIntensity: number
}

const mockIntegratedAssets: IntegratedAssetData[] = [
  {
    id: "1",
    name: "Bitcoin",
    ticker: "BTCUSDT",
    dominantTimeframe: "4H",
    alignmentScore: 92,
    riskCategory: "Ideal",
    priority: "Breakout",
    regime: "Tendência",
    context: "Ideal",
    volatility: "Breakout",
    activeSignals: 42,
    directionalPressure: "Alta",
    sparklineData: [44000, 44500, 45200, 46800, 47500, 48200, 49100, 49800, 50200, 50800],
    alerts: {
      squeezeCritico: false,
      breakoutAtivo: true,
      altaVolatilidade: true,
      atencaoNecessaria: false,
      riscoElevado: false,
    },
    lastUpdate: "há 1 min",
    volatilityScore: 88,
    pressureIntensity: 95,
  },
  {
    id: "2",
    name: "Solana",
    ticker: "SOLUSDT",
    dominantTimeframe: "1H",
    alignmentScore: 85,
    riskCategory: "Atencao",
    priority: "Squeeze",
    regime: "Consolidação",
    context: "Neutro",
    volatility: "Squeeze",
    activeSignals: 28,
    directionalPressure: "Lateral",
    sparklineData: [95.2, 95.1, 95.3, 95.0, 95.2, 95.1, 95.4, 95.0, 95.3, 95.1],
    alerts: {
      squeezeCritico: true,
      breakoutAtivo: false,
      altaVolatilidade: false,
      atencaoNecessaria: true,
      riscoElevado: false,
    },
    lastUpdate: "há 2 min",
    volatilityScore: 15,
    pressureIntensity: 92,
  },
  {
    id: "3",
    name: "Chainlink",
    ticker: "LINKUSDT",
    dominantTimeframe: "4H",
    alignmentScore: 78,
    riskCategory: "Ideal",
    priority: "Alta_Volatilidade",
    regime: "Extensão",
    context: "Ideal",
    volatility: "Sustentada",
    activeSignals: 35,
    directionalPressure: "Alta",
    sparklineData: [22, 24, 26, 28, 31, 34, 37, 40, 43, 46],
    alerts: {
      squeezeCritico: false,
      breakoutAtivo: false,
      altaVolatilidade: true,
      atencaoNecessaria: false,
      riscoElevado: false,
    },
    lastUpdate: "há 3 min",
    volatilityScore: 82,
    pressureIntensity: 88,
  },
  {
    id: "4",
    name: "Ethereum",
    ticker: "ETHUSDT",
    dominantTimeframe: "1H",
    alignmentScore: 45,
    riskCategory: "Risco",
    priority: "Normal",
    regime: "Lateral",
    context: "Adverso",
    volatility: "Baixa",
    activeSignals: 8,
    directionalPressure: "Mista",
    sparklineData: [3200, 3180, 3220, 3190, 3210, 3195, 3205, 3188, 3215, 3200],
    alerts: {
      squeezeCritico: false,
      breakoutAtivo: false,
      altaVolatilidade: false,
      atencaoNecessaria: false,
      riscoElevado: true,
    },
    lastUpdate: "há 5 min",
    volatilityScore: 28,
    pressureIntensity: 35,
  },
  {
    id: "5",
    name: "Cardano",
    ticker: "ADAUSDT",
    dominantTimeframe: "1D",
    alignmentScore: 72,
    riskCategory: "Atencao",
    priority: "Normal",
    regime: "Baixista",
    context: "Adverso",
    volatility: "Expansão",
    activeSignals: 24,
    directionalPressure: "Baixa",
    sparklineData: [0.95, 0.89, 0.83, 0.77, 0.71, 0.68, 0.66, 0.65, 0.64, 0.63],
    alerts: {
      squeezeCritico: false,
      breakoutAtivo: false,
      altaVolatilidade: false,
      atencaoNecessaria: true,
      riscoElevado: false,
    },
    lastUpdate: "há 8 min",
    volatilityScore: 65,
    pressureIntensity: 78,
  },
  {
    id: "6",
    name: "Polkadot",
    ticker: "DOTUSDT",
    dominantTimeframe: "4H",
    alignmentScore: 58,
    riskCategory: "Atencao",
    priority: "Normal",
    regime: "Transição",
    context: "Neutro",
    volatility: "Pré-Squeeze",
    activeSignals: 12,
    directionalPressure: "Lateral",
    sparklineData: [8.5, 8.7, 8.3, 8.9, 8.1, 8.6, 8.4, 8.8, 8.2, 8.7],
    alerts: {
      squeezeCritico: false,
      breakoutAtivo: false,
      altaVolatilidade: false,
      atencaoNecessaria: true,
      riscoElevado: false,
    },
    lastUpdate: "há 12 min",
    volatilityScore: 42,
    pressureIntensity: 55,
  },
]

export default function SiomPage() {
  const [assets, setAssets] = useState<IntegratedAssetData[]>(mockIntegratedAssets)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRisk, setSelectedRisk] = useState("Todos")
  const [selectedPriority, setSelectedPriority] = useState("Todos")
  const [alignmentFilter, setAlignmentFilter] = useState("Todos")
  const [sortBy, setSortBy] = useState<"alignmentScore" | "volatilityScore" | "activeSignals" | "pressureIntensity">(
    "alignmentScore",
  )
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Filtrar e ordenar ativos
  let filteredAssets = assets

  if (searchTerm) {
    filteredAssets = filteredAssets.filter(
      (asset) =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.ticker.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  if (selectedRisk !== "Todos") {
    filteredAssets = filteredAssets.filter((asset) => asset.riskCategory === selectedRisk)
  }

  if (selectedPriority !== "Todos") {
    filteredAssets = filteredAssets.filter((asset) => asset.priority === selectedPriority)
  }

  if (alignmentFilter !== "Todos") {
    if (alignmentFilter === "Alto") {
      filteredAssets = filteredAssets.filter((asset) => asset.alignmentScore >= 75)
    } else if (alignmentFilter === "Medio") {
      filteredAssets = filteredAssets.filter((asset) => asset.alignmentScore >= 50 && asset.alignmentScore < 75)
    } else if (alignmentFilter === "Baixo") {
      filteredAssets = filteredAssets.filter((asset) => asset.alignmentScore < 50)
    }
  }

  // Ordenar ativos
  filteredAssets = [...filteredAssets].sort((a, b) => {
    let comparison = 0
    switch (sortBy) {
      case "alignmentScore":
        comparison = a.alignmentScore - b.alignmentScore
        break
      case "volatilityScore":
        comparison = a.volatilityScore - b.volatilityScore
        break
      case "activeSignals":
        comparison = a.activeSignals - b.activeSignals
        break
      case "pressureIntensity":
        comparison = a.pressureIntensity - b.pressureIntensity
        break
    }
    return sortOrder === "desc" ? -comparison : comparison
  })

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedRisk("Todos")
    setSelectedPriority("Todos")
    setAlignmentFilter("Todos")
    setSortBy("alignmentScore")
    setSortOrder("desc")
  }

  // Estatísticas
  const totalAssets = filteredAssets.length
  const idealCount = filteredAssets.filter((a) => a.riskCategory === "Ideal").length
  const atencaoCount = filteredAssets.filter((a) => a.riskCategory === "Atencao").length
  const riscoCount = filteredAssets.filter((a) => a.riskCategory === "Risco").length
  const averageAlignment = Math.round(
    filteredAssets.reduce((sum, a) => sum + a.alignmentScore, 0) / filteredAssets.length || 0,
  )

  return (
    <div className="space-y-5">
      {/* 1️⃣ Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <TrendingUp className="w-8 h-8 text-blue-400 mr-4" />
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Dashboard Inteligente — Visão Integrada do Mercado</h1>
            <p className="text-slate-400 mt-1">
              Aqui você vê, em uma única tela, o estado atual e o potencial de todos os ativos monitorados pelo SIOM,
              com foco total em clareza e precisão
            </p>
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

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center">
            <BarChart3 className="w-5 h-5 text-blue-400 mr-2" />
            <div>
              <p className="text-xs text-slate-400">Total Monitorados</p>
              <p className="text-lg font-bold text-slate-100">{totalAssets}</p>
            </div>
          </div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
          <div className="flex items-center">
            <Flame className="w-5 h-5 text-emerald-400 mr-2" />
            <div>
              <p className="text-xs text-slate-400">Cenário Ideal</p>
              <p className="text-lg font-bold text-emerald-400">{idealCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-amber-400 mr-2" />
            <div>
              <p className="text-xs text-slate-400">Atenção</p>
              <p className="text-lg font-bold text-amber-400">{atencaoCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <div>
              <p className="text-xs text-slate-400">Risco</p>
              <p className="text-lg font-bold text-red-400">{riscoCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center">
            <Activity className="w-5 h-5 text-blue-400 mr-2" />
            <div>
              <p className="text-xs text-slate-400">Alignment Médio</p>
              <p className="text-lg font-bold text-blue-400">{averageAlignment}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2️⃣ Painel de Filtros */}
      <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-3">
          {/* Campo de Busca */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar ativo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-sm"
              />
            </div>
          </div>

          {/* Filtro por Categoria de Risco */}
          <div>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-sm"
            >
              <option value="Todos">Todas Categorias</option>
              <option value="Ideal">Cenário Ideal</option>
              <option value="Atencao">Atenção</option>
              <option value="Risco">Risco</option>
            </select>
          </div>

          {/* Filtro por Prioridade */}
          <div>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-sm"
            >
              <option value="Todos">Todas Prioridades</option>
              <option value="Squeeze">Squeeze</option>
              <option value="Breakout">Breakout</option>
              <option value="Alta_Volatilidade">Alta Volatilidade</option>
              <option value="Normal">Normal</option>
            </select>
          </div>

          {/* Filtro por Alignment Score */}
          <div>
            <select
              value={alignmentFilter}
              onChange={(e) => setAlignmentFilter(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-sm"
            >
              <option value="Todos">Todos Alignments</option>
              <option value="Alto">Alto (≥75%)</option>
              <option value="Medio">Médio (50-74%)</option>
              <option value="Baixo">Baixo (&lt;50%)</option>
            </select>
          </div>

          {/* Ordenação */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2.5 px-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-sm"
            >
              <option value="alignmentScore">Alignment Score</option>
              <option value="volatilityScore">Volatilidade</option>
              <option value="activeSignals">Sinais Ativos</option>
              <option value="pressureIntensity">Pressão Direcional</option>
            </select>
          </div>

          {/* Controles */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
              className="p-2.5 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-xl text-slate-300 hover:text-emerald-400 transition-all duration-200"
              title={`Ordenar ${sortOrder === "desc" ? "crescente" : "decrescente"}`}
            >
              {sortOrder === "desc" ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
            <button
              onClick={resetFilters}
              className="p-2.5 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-xl text-slate-300 hover:text-emerald-400 transition-all duration-200"
              title="Resetar filtros"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3️⃣ Cards Consolidados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredAssets.map((asset, index) => (
          <IntegratedAssetCard key={asset.id} asset={asset} index={index} />
        ))}
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

// Componente IntegratedAssetCard
function IntegratedAssetCard({ asset, index }: { asset: IntegratedAssetData; index: number }) {
  const getRiskConfig = (category: string) => {
    switch (category) {
      case "Ideal":
        return {
          color: "border-l-emerald-500",
          gaugeColor: "stroke-emerald-500",
          bgColor: "from-emerald-500/20 to-emerald-600/10",
        }
      case "Atencao":
        return {
          color: "border-l-amber-500",
          gaugeColor: "stroke-amber-500",
          bgColor: "from-amber-500/20 to-amber-600/10",
        }
      case "Risco":
        return {
          color: "border-l-red-500",
          gaugeColor: "stroke-red-500",
          bgColor: "from-red-500/20 to-red-600/10",
        }
      default:
        return {
          color: "border-l-slate-500",
          gaugeColor: "stroke-slate-500",
          bgColor: "from-slate-500/20 to-slate-600/10",
        }
    }
  }

  const getAlignmentColor = (score: number) => {
    if (score >= 75) return "text-emerald-400"
    if (score >= 50) return "text-amber-400"
    return "text-red-400"
  }

  const riskConfig = getRiskConfig(asset.riskCategory)

  // Calcular min e max para normalizar sparkline
  const minValue = Math.min(...asset.sparklineData)
  const maxValue = Math.max(...asset.sparklineData)
  const range = maxValue - minValue || 1

  // Calcular circunferência para o gauge circular
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (asset.alignmentScore / 100) * circumference

  return (
    <div
      className={`bg-slate-800/50 rounded-2xl border-l-4 ${riskConfig.color} border-t border-r border-b border-slate-700/50 hover:border-slate-600/50 transition-all duration-200 animate-fade-in-up`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              {asset.ticker} | {asset.dominantTimeframe}
            </h3>
            <p className="text-xs text-slate-400">{asset.name}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Atualizado</p>
            <p className="text-xs text-slate-300">{asset.lastUpdate}</p>
          </div>
        </div>

        {/* Alignment Score com Gauge Circular */}
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            {/* Gauge Circular */}
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 64 64">
              {/* Background circle */}
              <circle
                cx="32"
                cy="32"
                r={radius}
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-slate-700"
              />
              {/* Progress circle */}
              <circle
                cx="32"
                cy="32"
                r={radius}
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className={riskConfig.gaugeColor}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  transition: "stroke-dashoffset 1s ease-in-out",
                }}
              />
            </svg>
            {/* Score no centro */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className={`text-lg font-bold ${getAlignmentColor(asset.alignmentScore)}`}>{asset.alignmentScore}</p>
                <p className="text-xs text-slate-400">Score</p>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo Condensado */}
        <div className="mb-3">
          <div className="bg-slate-700/30 rounded-lg p-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Resumo:</span>
              <span className="text-slate-300 font-medium">
                {asset.regime} | {asset.context} | {asset.volatility}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-slate-400">Sinais Ativos:</span>
              <span className="text-blue-400 font-bold">{asset.activeSignals}</span>
            </div>
          </div>
        </div>

        {/* Badges Inteligentes */}
        <div className="flex flex-wrap gap-1 mb-3">
          {asset.alerts.squeezeCritico && (
            <div className="bg-red-600/10 border border-red-600/30 rounded-lg px-2 py-1 flex items-center">
              <Target className="w-3 h-3 text-red-400 mr-1" />
              <span className="text-xs text-red-400">Squeeze</span>
            </div>
          )}
          {asset.alerts.breakoutAtivo && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg px-2 py-1 flex items-center">
              <Zap className="w-3 h-3 text-blue-400 mr-1" />
              <span className="text-xs text-blue-400">Breakout</span>
            </div>
          )}
          {asset.alerts.altaVolatilidade && (
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg px-2 py-1 flex items-center">
              <Activity className="w-3 h-3 text-purple-400 mr-1" />
              <span className="text-xs text-purple-400">Alta Vol.</span>
            </div>
          )}
          {asset.riskCategory === "Ideal" && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-2 py-1 flex items-center">
              <Flame className="w-3 h-3 text-emerald-400 mr-1" />
              <span className="text-xs text-emerald-400">Ideal</span>
            </div>
          )}
          {asset.alerts.atencaoNecessaria && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-2 py-1 flex items-center">
              <AlertTriangle className="w-3 h-3 text-amber-400 mr-1" />
              <span className="text-xs text-amber-400">Atenção</span>
            </div>
          )}
          {asset.alerts.riscoElevado && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-2 py-1 flex items-center">
              <AlertCircle className="w-3 h-3 text-red-400 mr-1" />
              <span className="text-xs text-red-400">Risco</span>
            </div>
          )}
        </div>

        {/* Mini Sparkline */}
        <div className="mb-3">
          <p className="text-xs text-slate-400 mb-1">Variação Recente</p>
          <div className="flex items-end justify-between h-6 space-x-0.5">
            {asset.sparklineData.map((value, idx) => (
              <div
                key={idx}
                className={`flex-1 rounded-t transition-all duration-300 ${
                  asset.riskCategory === "Ideal"
                    ? "bg-emerald-400/60"
                    : asset.riskCategory === "Atencao"
                      ? "bg-amber-400/60"
                      : "bg-red-400/60"
                }`}
                style={{
                  height: `${Math.max(((value - minValue) / range) * 20, 2)}px`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Botão de Ação */}
        <button className="w-full flex items-center justify-center bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-blue-400 py-2 rounded-lg transition-all duration-200">
          <Eye className="w-3 h-3 mr-2" />
          <span className="text-xs font-medium">Ver Análise Completa</span>
        </button>
      </div>
    </div>
  )
}
