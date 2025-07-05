"use client"

import { useState, useEffect } from "react"
import {
  FileText,
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
  Clock,
} from "lucide-react"

interface NarrativeData {
  id: string
  name: string
  ticker: string
  dominantTimeframe: string
  marketRegime: string
  operationalContext: string
  volatilityState: string
  directionalPressure: string
  activeSignals: number
  strategicScenario: string
  riskCategory: "Ideal" | "Atencao" | "Risco"
  priority: "Alta_Volatilidade" | "Squeeze" | "Breakout" | "Normal"
  sparklineData: number[]
  narrative: string
  lastUpdate: string
  alerts: {
    squeezeCritico: boolean
    breakoutAtivo: boolean
    altaVolatilidade: boolean
  }
}

const mockNarratives: NarrativeData[] = [
  {
    id: "1",
    name: "Bitcoin",
    ticker: "BTCUSDT",
    dominantTimeframe: "4H",
    marketRegime: "Tendência Ativa",
    operationalContext: "Contexto Ideal",
    volatilityState: "Breakout Ativo",
    directionalPressure: "Forte pressão de alta",
    activeSignals: 42,
    strategicScenario: "Cenário Ideal",
    riskCategory: "Ideal",
    priority: "Breakout",
    sparklineData: [44000, 44500, 45200, 46800, 47500, 48200, 49100, 49800, 50200, 50800],
    narrative:
      "BTCUSDT (4H): Está em Tendência Ativa no Regime de Mercado e em Contexto Ideal. Volatilidade em Breakout Ativo, favorecendo movimentos amplos. Forte pressão direcional de alta. 42 sinais ativos — Alta atividade operacional.",
    lastUpdate: "há 2 min",
    alerts: {
      squeezeCritico: false,
      breakoutAtivo: true,
      altaVolatilidade: true,
    },
  },
  {
    id: "2",
    name: "Solana",
    ticker: "SOLUSDT",
    dominantTimeframe: "1H",
    marketRegime: "Consolidação",
    operationalContext: "Contexto Neutro",
    volatilityState: "Squeeze Crítico",
    directionalPressure: "Pressão lateral intensa",
    activeSignals: 18,
    strategicScenario: "Cenário de Atenção",
    riskCategory: "Atencao",
    priority: "Squeeze",
    sparklineData: [95.2, 95.1, 95.3, 95.0, 95.2, 95.1, 95.4, 95.0, 95.3, 95.1],
    narrative:
      "SOLUSDT (1H): Está em Consolidação no Regime de Mercado e em Contexto Neutro. Volatilidade em Squeeze Crítico, indicando compressão extrema antes de movimento. Pressão lateral intensa. 18 sinais ativos — Preparação para breakout iminente.",
    lastUpdate: "há 1 min",
    alerts: {
      squeezeCritico: true,
      breakoutAtivo: false,
      altaVolatilidade: false,
    },
  },
  {
    id: "3",
    name: "Ethereum",
    ticker: "ETHUSDT",
    dominantTimeframe: "1H",
    marketRegime: "Lateral",
    operationalContext: "Contexto Adverso",
    volatilityState: "Baixa Volatilidade",
    directionalPressure: "Pressão mista",
    activeSignals: 8,
    strategicScenario: "Cenário de Risco",
    riskCategory: "Risco",
    priority: "Normal",
    sparklineData: [3200, 3180, 3220, 3190, 3210, 3195, 3205, 3188, 3215, 3200],
    narrative:
      "ETHUSDT (1H): Está em Lateral no Regime de Mercado e em Contexto Adverso. Volatilidade baixa com sinais conflitantes. Pressão mista sem direção clara. 8 sinais ativos — Ambiente operacional desafiador.",
    lastUpdate: "há 5 min",
    alerts: {
      squeezeCritico: false,
      breakoutAtivo: false,
      altaVolatilidade: false,
    },
  },
  {
    id: "4",
    name: "Chainlink",
    ticker: "LINKUSDT",
    dominantTimeframe: "4H",
    marketRegime: "Extensão",
    operationalContext: "Contexto Ideal",
    volatilityState: "Alta Sustentada",
    directionalPressure: "Pressão de alta extrema",
    activeSignals: 35,
    strategicScenario: "Cenário Ideal",
    riskCategory: "Ideal",
    priority: "Alta_Volatilidade",
    sparklineData: [22, 24, 26, 28, 31, 34, 37, 40, 43, 46],
    narrative:
      "LINKUSDT (4H): Está em Extensão no Regime de Mercado e em Contexto Ideal. Volatilidade Alta Sustentada com movimento prolongado. Pressão de alta extrema. 35 sinais ativos — Movimento em fase avançada.",
    lastUpdate: "há 3 min",
    alerts: {
      squeezeCritico: false,
      breakoutAtivo: false,
      altaVolatilidade: true,
    },
  },
  {
    id: "5",
    name: "Cardano",
    ticker: "ADAUSDT",
    dominantTimeframe: "1D",
    marketRegime: "Tendência Baixista",
    operationalContext: "Contexto Adverso",
    volatilityState: "Expansão",
    directionalPressure: "Forte pressão de baixa",
    activeSignals: 24,
    strategicScenario: "Cenário de Risco",
    riskCategory: "Risco",
    priority: "Normal",
    sparklineData: [0.95, 0.89, 0.83, 0.77, 0.71, 0.68, 0.66, 0.65, 0.64, 0.63],
    narrative:
      "ADAUSDT (1D): Está em Tendência Baixista no Regime de Mercado e em Contexto Adverso. Volatilidade em Expansão favorecendo quedas. Forte pressão de baixa. 24 sinais ativos — Movimento descendente ativo.",
    lastUpdate: "há 8 min",
    alerts: {
      squeezeCritico: false,
      breakoutAtivo: false,
      altaVolatilidade: false,
    },
  },
  {
    id: "6",
    name: "Polkadot",
    ticker: "DOTUSDT",
    dominantTimeframe: "4H",
    marketRegime: "Transição",
    operationalContext: "Contexto Neutro",
    volatilityState: "Pré-Squeeze",
    directionalPressure: "Pressão indefinida",
    activeSignals: 12,
    strategicScenario: "Cenário de Atenção",
    riskCategory: "Atencao",
    priority: "Normal",
    sparklineData: [8.5, 8.7, 8.3, 8.9, 8.1, 8.6, 8.4, 8.8, 8.2, 8.7],
    narrative:
      "DOTUSDT (4H): Está em Transição no Regime de Mercado e em Contexto Neutro. Volatilidade em Pré-Squeeze indicando compressão inicial. Pressão indefinida. 12 sinais ativos — Aguardando definição direcional.",
    lastUpdate: "há 12 min",
    alerts: {
      squeezeCritico: false,
      breakoutAtivo: false,
      altaVolatilidade: false,
    },
  },
]

export default function NarrativaPage() {
  const [narratives, setNarratives] = useState<NarrativeData[]>(mockNarratives)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPriority, setSelectedPriority] = useState("Todos")
  const [selectedRisk, setSelectedRisk] = useState("Todos")
  const [showOnlyRelevant, setShowOnlyRelevant] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Filtrar narrativas
  let filteredNarratives = narratives

  if (searchTerm) {
    filteredNarratives = filteredNarratives.filter(
      (narrative) =>
        narrative.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        narrative.ticker.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  if (selectedPriority !== "Todos") {
    filteredNarratives = filteredNarratives.filter((narrative) => narrative.priority === selectedPriority)
  }

  if (selectedRisk !== "Todos") {
    filteredNarratives = filteredNarratives.filter((narrative) => narrative.riskCategory === selectedRisk)
  }

  if (showOnlyRelevant) {
    filteredNarratives = filteredNarratives.filter(
      (narrative) =>
        narrative.priority !== "Normal" ||
        narrative.alerts.squeezeCritico ||
        narrative.alerts.breakoutAtivo ||
        narrative.alerts.altaVolatilidade,
    )
  }

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedPriority("Todos")
    setSelectedRisk("Todos")
    setShowOnlyRelevant(true)
  }

  // Estatísticas
  const totalNarratives = filteredNarratives.length
  const idealCount = filteredNarratives.filter((n) => n.riskCategory === "Ideal").length
  const atencaoCount = filteredNarratives.filter((n) => n.riskCategory === "Atencao").length
  const riscoCount = filteredNarratives.filter((n) => n.riskCategory === "Risco").length

  const getRiskConfig = (category: string) => {
    switch (category) {
      case "Ideal":
        return {
          color: "border-l-emerald-500",
          badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
          icon: <Flame className="w-3 h-3" />,
        }
      case "Atencao":
        return {
          color: "border-l-amber-500",
          badge: "bg-amber-500/10 text-amber-400 border-amber-500/30",
          icon: <AlertTriangle className="w-3 h-3" />,
        }
      case "Risco":
        return {
          color: "border-l-red-500",
          badge: "bg-red-500/10 text-red-400 border-red-500/30",
          icon: <AlertCircle className="w-3 h-3" />,
        }
      default:
        return {
          color: "border-l-slate-500",
          badge: "bg-slate-500/10 text-slate-400 border-slate-500/30",
          icon: <Activity className="w-3 h-3" />,
        }
    }
  }

  return (
    <div className="space-y-5">
      {/* 1️⃣ Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FileText className="w-8 h-8 text-teal-400 mr-4" />
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Narrativa Inteligente do Mercado</h1>
            <p className="text-slate-400 mt-1">
              Leitura automatizada e tática dos ativos monitorados com base nos pilares operacionais principais
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center">
            <BarChart3 className="w-5 h-5 text-teal-400 mr-2" />
            <div>
              <p className="text-xs text-slate-400">Total Analisados</p>
              <p className="text-lg font-bold text-slate-100">{totalNarratives}</p>
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
      </div>

      {/* 2️⃣ Barra de Filtros */}
      <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
          {/* Campo de Busca */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar ativo (ex.: BTCUSDT)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-sm"
              />
            </div>
          </div>

          {/* Filtro por Prioridade */}
          <div>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-sm"
            >
              <option value="Todos">Todas Prioridades</option>
              <option value="Alta_Volatilidade">Alta Volatilidade</option>
              <option value="Squeeze">Squeeze</option>
              <option value="Breakout">Breakout</option>
              <option value="Normal">Normal</option>
            </select>
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
              <option value="Atencao">Cenário de Atenção</option>
              <option value="Risco">Cenário de Risco</option>
            </select>
          </div>

          {/* Botão Reset */}
          <div className="flex items-center space-x-2">
            <button
              onClick={resetFilters}
              className="p-2.5 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-xl text-slate-300 hover:text-emerald-400 transition-all duration-200"
              title="Resetar filtros"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowOnlyRelevant(!showOnlyRelevant)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                showOnlyRelevant
                  ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                  : "bg-slate-700/50 text-slate-300 hover:text-teal-400"
              }`}
            >
              {showOnlyRelevant ? "Relevantes" : "Mostrar Todos"}
            </button>
          </div>
        </div>
      </div>

      {/* 3️⃣ Cards de Narrativa */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredNarratives.map((narrative, index) => (
          <NarrativeCard key={narrative.id} narrative={narrative} index={index} />
        ))}
      </div>

      {filteredNarratives.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Nenhuma narrativa encontrada</p>
            <p className="text-sm">Tente ajustar os filtros de busca</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Componente NarrativeCard
function NarrativeCard({ narrative, index }: { narrative: NarrativeData; index: number }) {
  const riskConfig = getRiskConfig(narrative.riskCategory)

  // Calcular min e max para normalizar sparkline
  const minValue = Math.min(...narrative.sparklineData)
  const maxValue = Math.max(...narrative.sparklineData)
  const range = maxValue - minValue || 1

  return (
    <div
      className={`bg-slate-800/50 rounded-2xl border-l-4 ${riskConfig.color} border-t border-r border-b border-slate-700/50 hover:border-slate-600/50 transition-all duration-200 animate-fade-in-up`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              {narrative.name} ({narrative.dominantTimeframe})
            </h3>
            <p className="text-xs text-slate-400">{narrative.ticker}</p>
          </div>
          <div className="flex items-center space-x-2">
            {/* Badges de Alerta */}
            {narrative.alerts.squeezeCritico && (
              <div className="bg-red-600/10 border border-red-600/30 rounded-lg px-2 py-1 flex items-center">
                <Target className="w-3 h-3 text-red-400 mr-1" />
                <span className="text-xs text-red-400">Squeeze</span>
              </div>
            )}
            {narrative.alerts.breakoutAtivo && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg px-2 py-1 flex items-center">
                <Zap className="w-3 h-3 text-blue-400 mr-1" />
                <span className="text-xs text-blue-400">Breakout</span>
              </div>
            )}
            {narrative.alerts.altaVolatilidade && (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg px-2 py-1 flex items-center">
                <Activity className="w-3 h-3 text-purple-400 mr-1" />
                <span className="text-xs text-purple-400">Alta Vol.</span>
              </div>
            )}
            {/* Badge de Categoria de Risco */}
            <div className={`border rounded-lg px-2 py-1 flex items-center ${riskConfig.badge}`}>
              {riskConfig.icon}
              <span className="text-xs ml-1">{narrative.strategicScenario.replace("Cenário ", "")}</span>
            </div>
          </div>
        </div>

        {/* Narrativa Principal */}
        <div className="mb-4">
          <div className="bg-slate-700/30 rounded-xl p-3">
            <p className="text-sm text-slate-200 leading-relaxed">{narrative.narrative}</p>
          </div>
        </div>

        {/* Dados Técnicos Resumidos */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-slate-700/30 rounded-lg p-2">
            <p className="text-xs text-slate-400 mb-0.5">Regime de Mercado</p>
            <p className="text-xs font-medium text-slate-300">{narrative.marketRegime}</p>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-2">
            <p className="text-xs text-slate-400 mb-0.5">Contexto Operacional</p>
            <p className="text-xs font-medium text-slate-300">{narrative.operationalContext}</p>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-2">
            <p className="text-xs text-slate-400 mb-0.5">Estado da Volatilidade</p>
            <p className="text-xs font-medium text-slate-300">{narrative.volatilityState}</p>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-2">
            <p className="text-xs text-slate-400 mb-0.5">Sinais Ativos</p>
            <p className="text-xs font-bold text-teal-400">{narrative.activeSignals}</p>
          </div>
        </div>

        {/* Mini Sparkline */}
        <div className="mb-3">
          <p className="text-xs text-slate-400 mb-1">Variação Recente</p>
          <div className="flex items-end justify-between h-6 space-x-0.5">
            {narrative.sparklineData.map((value, idx) => (
              <div
                key={idx}
                className={`flex-1 rounded-t transition-all duration-300 ${
                  narrative.riskCategory === "Ideal"
                    ? "bg-emerald-400/60"
                    : narrative.riskCategory === "Atencao"
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

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
          <div className="flex items-center space-x-2">
            <Clock className="w-3 h-3 text-slate-500" />
            <span className="text-xs text-slate-500">{narrative.lastUpdate}</span>
          </div>
          <button className="flex items-center bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-teal-400 px-3 py-1.5 rounded-lg transition-all duration-200">
            <Eye className="w-3 h-3 mr-1" />
            <span className="text-xs">Ver Análise Completa</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// Função auxiliar para configuração de risco
function getRiskConfig(category: string) {
  switch (category) {
    case "Ideal":
      return {
        color: "border-l-emerald-500",
        badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        icon: <Flame className="w-3 h-3" />,
      }
    case "Atencao":
      return {
        color: "border-l-amber-500",
        badge: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        icon: <AlertTriangle className="w-3 h-3" />,
      }
    case "Risco":
      return {
        color: "border-l-red-500",
        badge: "bg-red-500/10 text-red-400 border-red-500/30",
        icon: <AlertCircle className="w-3 h-3" />,
      }
    default:
      return {
        color: "border-l-slate-500",
        badge: "bg-slate-500/10 text-slate-400 border-slate-500/30",
        icon: <Activity className="w-3 h-3" />,
      }
  }
}
