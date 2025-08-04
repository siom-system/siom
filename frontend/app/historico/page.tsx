"use client"
import { useState, useEffect } from "react"
import {
  Search,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  Download,
  Settings,
  RefreshCw,
  X,
  ArrowUp,
  ArrowDown,
  BarChart3,
  Shield,
  Activity,
} from "lucide-react"

interface HistoricalSignal {
  id: string
  asset: string
  timeframe: string
  timestamp: string
  score: number
  confidence: number
  trend: "Bullish" | "Bearish" | "Neutro"
  marketState: string
  details: {
    volume: string
    rsi: number
    macd: string
    support: string
    resistance: string
  }
}

const mockSignals: HistoricalSignal[] = [
  {
    id: "1",
    asset: "BTCUSDT",
    timeframe: "4h",
    timestamp: "2025-01-07T14:32:15Z",
    score: 1.85,
    confidence: 87,
    trend: "Bullish",
    marketState: "Tendência de Alta",
    details: {
      volume: "Alto",
      rsi: 68.5,
      macd: "Positivo",
      support: "$44,200",
      resistance: "$46,800",
    },
  },
  {
    id: "2",
    asset: "ETHUSDT",
    timeframe: "1h",
    timestamp: "2025-01-07T13:45:22Z",
    score: -0.92,
    confidence: 73,
    trend: "Bearish",
    marketState: "Correção",
    details: {
      volume: "Médio",
      rsi: 32.1,
      macd: "Negativo",
      support: "$3,180",
      resistance: "$3,420",
    },
  },
  {
    id: "3",
    asset: "SOLUSDT",
    timeframe: "4h",
    timestamp: "2025-01-07T12:18:45Z",
    score: 0.45,
    confidence: 61,
    trend: "Bullish",
    marketState: "Consolidação",
    details: {
      volume: "Baixo",
      rsi: 55.8,
      macd: "Neutro",
      support: "$94.50",
      resistance: "$98.20",
    },
  },
  {
    id: "4",
    asset: "ADAUSDT",
    timeframe: "1d",
    timestamp: "2025-01-07T11:22:10Z",
    score: -1.34,
    confidence: 79,
    trend: "Bearish",
    marketState: "Tendência de Baixa",
    details: {
      volume: "Alto",
      rsi: 28.9,
      macd: "Negativo",
      support: "$0.85",
      resistance: "$0.92",
    },
  },
  {
    id: "5",
    asset: "LINKUSDT",
    timeframe: "1h",
    timestamp: "2025-01-07T10:55:33Z",
    score: 2.12,
    confidence: 91,
    trend: "Bullish",
    marketState: "Breakout",
    details: {
      volume: "Muito Alto",
      rsi: 72.3,
      macd: "Forte Positivo",
      support: "$22.80",
      resistance: "$25.40",
    },
  },
  {
    id: "6",
    asset: "DOTUSDT",
    timeframe: "4h",
    timestamp: "2025-01-07T09:41:18Z",
    score: 0.78,
    confidence: 58,
    trend: "Bullish",
    marketState: "Acumulação",
    details: {
      volume: "Médio",
      rsi: 61.2,
      macd: "Positivo",
      support: "$8.45",
      resistance: "$9.20",
    },
  },
]

export default function HistoricoPage() {
  const [signals, setSignals] = useState<HistoricalSignal[]>(mockSignals)
  const [filteredSignals, setFilteredSignals] = useState<HistoricalSignal[]>(mockSignals)
  const [selectedSignal, setSelectedSignal] = useState<HistoricalSignal | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Estados dos filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTimeframe, setSelectedTimeframe] = useState("Todos")
  const [selectedTrend, setSelectedTrend] = useState("Todos")
  const [confidenceRange, setConfidenceRange] = useState([0, 100])
  const [dateRange, setDateRange] = useState({ start: "", end: "" })

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Aplicar filtros
  useEffect(() => {
    let filtered = signals

    if (searchTerm) {
      filtered = filtered.filter((signal) => signal.asset.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (selectedTimeframe !== "Todos") {
      filtered = filtered.filter((signal) => signal.timeframe === selectedTimeframe)
    }

    if (selectedTrend !== "Todos") {
      filtered = filtered.filter((signal) => signal.trend === selectedTrend)
    }

    filtered = filtered.filter(
      (signal) => signal.confidence >= confidenceRange[0] && signal.confidence <= confidenceRange[1],
    )

    setFilteredSignals(filtered)
  }, [searchTerm, selectedTimeframe, selectedTrend, confidenceRange, signals])

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedTimeframe("Todos")
    setSelectedTrend("Todos")
    setConfidenceRange([0, 100])
    setDateRange({ start: "", end: "" })
  }

  const openDetailModal = (signal: HistoricalSignal) => {
    setSelectedSignal(signal)
    setShowDetailModal(true)
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
      timeZoneName: "short",
    })
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
        return <ArrowUp className="w-4 h-4" />
      case "Bearish":
        return <ArrowDown className="w-4 h-4" />
      default:
        return <Minus className="w-4 h-4" />
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 75) return "text-emerald-400"
    if (confidence >= 50) return "text-amber-400"
    return "text-red-400"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Clock className="w-8 h-8 text-blue-400 mr-4" />
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Histórico de Sinais</h1>
          <p className="text-slate-400 mt-1">Diário oficial completo dos sinais gerados pelo SIOM</p>
        </div>
      </div>

      {/* 1️⃣ Barra Superior de Filtros */}
      <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-3">
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

          {/* Filtro Timeframe */}
          <div>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-sm"
            >
              <option value="Todos">Todos os Timeframes</option>
              <option value="15m">15m</option>
              <option value="1h">1h</option>
              <option value="4h">4h</option>
              <option value="1d">1d</option>
              <option value="1w">1w</option>
            </select>
          </div>

          {/* Filtro Tipo de Sinal */}
          <div>
            <select
              value={selectedTrend}
              onChange={(e) => setSelectedTrend(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-sm"
            >
              <option value="Todos">Todos os Sinais</option>
              <option value="Bullish">Bullish</option>
              <option value="Bearish">Bearish</option>
              <option value="Neutro">Neutro</option>
            </select>
          </div>

          {/* Botão Reset */}
          <div>
            <button
              onClick={resetFilters}
              className="p-2.5 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-xl text-slate-300 hover:text-emerald-400 transition-all duration-200"
              title="Resetar filtros"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filtro de Confiança */}
        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-400 whitespace-nowrap">Confiança mín.:</span>
          <div className="flex-1 flex items-center space-x-3">
            <span className="text-xs text-slate-300 w-8">{confidenceRange[0]}%</span>
            <div className="flex-1 relative">
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${confidenceRange[0]}%` }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={confidenceRange[0]}
                onChange={(e) => setConfidenceRange([Number(e.target.value), 100])}
                className="absolute inset-0 w-full h-1.5 opacity-0 cursor-pointer slider-thumb"
                style={{
                  background: "transparent",
                }}
              />
              <div
                className="absolute top-1/2 w-3 h-3 bg-white border-2 border-slate-600 rounded-full shadow-lg transform -translate-y-1/2 transition-all duration-200 pointer-events-none"
                style={{
                  left: `calc(${confidenceRange[0]}% - 6px)`,
                }}
              />
            </div>
            <span className="text-xs font-medium text-emerald-400 w-8">100%</span>
          </div>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center">
            <BarChart3 className="w-5 h-5 text-blue-400 mr-2" />
            <div>
              <p className="text-xs text-slate-400">Total de Sinais</p>
              <p className="text-lg font-bold text-slate-100">{filteredSignals.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 text-emerald-400 mr-2" />
            <div>
              <p className="text-xs text-slate-400">Bullish</p>
              <p className="text-lg font-bold text-emerald-400">
                {filteredSignals.filter((s) => s.trend === "Bullish").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center">
            <TrendingDown className="w-5 h-5 text-red-400 mr-2" />
            <div>
              <p className="text-xs text-slate-400">Bearish</p>
              <p className="text-lg font-bold text-red-400">
                {filteredSignals.filter((s) => s.trend === "Bearish").length}
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
                {Math.round(filteredSignals.reduce((sum, s) => sum + s.confidence, 0) / filteredSignals.length || 0)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2️⃣ Timeline Cronológica */}
      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
        <div className="flex items-center mb-6">
          <Activity className="w-6 h-6 text-emerald-400 mr-3" />
          <h2 className="text-xl font-semibold text-slate-100">Timeline de Sinais</h2>
        </div>

        <div className="space-y-3">
          {filteredSignals.map((signal, index) => (
            <div
              key={signal.id}
              className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200 animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {/* Cabeçalho */}
                  <div className="flex items-center mb-2">
                    <h3 className="text-sm font-semibold text-slate-100 mr-3">
                      {signal.asset} — {signal.timeframe}
                    </h3>
                    <span className="text-xs bg-slate-600/50 text-slate-300 px-2 py-0.5 rounded-full">
                      {formatTimestamp(signal.timestamp)}
                    </span>
                  </div>

                  {/* Dados do Sinal */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">Score</p>
                      <p className={`text-sm font-bold ${signal.score > 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {signal.score > 0 ? "+" : ""}
                        {signal.score.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">Confiança</p>
                      <p className={`text-sm font-bold ${getConfidenceColor(signal.confidence)}`}>
                        {signal.confidence}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">Tendência</p>
                      <div className={`flex items-center text-sm font-bold ${getTrendColor(signal.trend)}`}>
                        {getTrendIcon(signal.trend)}
                        <span className="ml-1">{signal.trend}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">Estado</p>
                      <p className="text-sm font-medium text-slate-300">{signal.marketState}</p>
                    </div>
                  </div>
                </div>

                {/* Botão Ver Detalhes */}
                <button
                  onClick={() => openDetailModal(signal)}
                  className="ml-4 flex items-center bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-105"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  <span className="text-xs">Ver Detalhes</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredSignals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Nenhum sinal encontrado</p>
              <p className="text-sm">Tente ajustar os filtros de busca</p>
            </div>
          </div>
        )}
      </div>

      {/* 3️⃣ Rodapé com Opções Avançadas */}
      <div className="bg-slate-800/50 rounded-2xl p-3 border border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 mb-0.5">Opções Avançadas</h3>
            <p className="text-xs text-slate-400">Gerenciar e exportar dados históricos</p>
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-emerald-400 px-2.5 py-1.5 rounded-lg transition-all duration-200 text-xs">
              <Download className="w-3 h-3 mr-1" />
              Exportar
            </button>
            <button className="flex items-center bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-blue-400 px-2.5 py-1.5 rounded-lg transition-all duration-200 text-xs">
              <Settings className="w-3 h-3 mr-1" />
              Configurar
            </button>
          </div>
        </div>
      </div>

      {/* Painel Lateral de Detalhes */}
      {showDetailModal && selectedSignal && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={() => setShowDetailModal(false)} />

          {/* Painel Lateral */}
          <div className="fixed right-0 top-0 h-full w-96 bg-slate-800 border-l border-slate-700 z-50 transform transition-transform duration-300 ease-out overflow-y-auto">
            <div className="p-6">
              {/* Header do Painel */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700">
                <div>
                  <h2 className="text-xl font-bold text-slate-100">{selectedSignal.asset}</h2>
                  <p className="text-sm text-slate-400">
                    {selectedSignal.timeframe} • {formatTimestamp(selectedSignal.timestamp)}
                  </p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Dados Principais */}
              <div className="space-y-4 mb-6">
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-1">Score Gerado</p>
                  <p className={`text-2xl font-bold ${selectedSignal.score > 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {selectedSignal.score > 0 ? "+" : ""}
                    {selectedSignal.score.toFixed(2)}
                  </p>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-1">Confiança Calculada</p>
                  <p className={`text-2xl font-bold ${getConfidenceColor(selectedSignal.confidence)}`}>
                    {selectedSignal.confidence}%
                  </p>
                </div>
              </div>

              {/* Estado e Tendência */}
              <div className="space-y-4 mb-6">
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-1">Estado do Mercado</p>
                  <p className="text-lg font-semibold text-slate-100">{selectedSignal.marketState}</p>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-1">Tendência Detectada</p>
                  <div className={`flex items-center text-lg font-semibold ${getTrendColor(selectedSignal.trend)}`}>
                    {getTrendIcon(selectedSignal.trend)}
                    <span className="ml-2">{selectedSignal.trend}</span>
                  </div>
                </div>
              </div>

              {/* Detalhes Técnicos */}
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-slate-100 mb-3">Análise Técnica</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-400">Volume</span>
                    <span className="text-sm font-medium text-slate-200">{selectedSignal.details.volume}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-400">RSI</span>
                    <span className="text-sm font-medium text-slate-200">{selectedSignal.details.rsi}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-400">MACD</span>
                    <span className="text-sm font-medium text-slate-200">{selectedSignal.details.macd}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-400">Suporte</span>
                    <span className="text-sm font-medium text-slate-200">{selectedSignal.details.support}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-400">Resistência</span>
                    <span className="text-sm font-medium text-slate-200">{selectedSignal.details.resistance}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
