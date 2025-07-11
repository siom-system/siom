"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  TrendingUp,
  Activity,
  Clock,
  Shield,
  BarChart3,
  CheckCircle,
  Users,
  Target,
  Wifi,
  Zap,
  FileText,
  History,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Minus,
  RefreshCw,
  Filter,
} from "lucide-react"
import { useAssets, useSystemStatus } from "@/hooks/useFirebaseData"

export default function DashboardPage() {
  const { assets, loading: assetsLoading, error: assetsError } = useAssets()
  const { status, loading: statusLoading, error: statusError } = useSystemStatus()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Fallback para dados mock se Firebase não estiver disponível
  const mockAssets = [
    { symbol: "BTCUSDT", timeframe: "4H", finalScore: 2.15, trend: "Bullish", confidence: 85 },
    { symbol: "ETHUSDT", timeframe: "1H", finalScore: -0.45, trend: "Bearish", confidence: 65 },
    { symbol: "SOLUSDT", timeframe: "1H", finalScore: 0.45, trend: "Neutral", confidence: 78 },
    { symbol: "LINKUSDT", timeframe: "4H", finalScore: 1.95, trend: "Bullish", confidence: 91 },
    { symbol: "ADAUSDT", timeframe: "1D", finalScore: -1.25, trend: "Bearish", confidence: 52 },
    { symbol: "DOTUSDT", timeframe: "4H", finalScore: 0.78, trend: "Bullish", confidence: 43 },
    { symbol: "XRPUSDT", timeframe: "1H", finalScore: -0.12, trend: "Neutral", confidence: 68 },
    { symbol: "LTCUSDT", timeframe: "4H", finalScore: 1.5, trend: "Bullish", confidence: 72 },
  ]

  // Usar dados do Firebase ou fallback para mock
  const displayAssets =
    assets.length > 0
      ? assets.map((asset) => ({
          symbol: asset.ticker,
          timeframe: asset.dominantTimeframe,
          finalScore: asset.finalScore,
          trend: asset.trend as "Bullish" | "Bearish" | "Neutral",
          confidence: asset.confidence,
        }))
      : mockAssets

  // Cálculos para o Radar Estratégico
  const totalAssets = displayAssets.length
  const bullishCount = displayAssets.filter((a) => a.trend === "Bullish").length
  const bearishCount = displayAssets.filter((a) => a.trend === "Bearish").length
  const neutroCount = totalAssets - bullishCount - bearishCount

  const bullishPercent = Math.round((bullishCount / totalAssets) * 100)
  const bearishPercent = Math.round((bearishCount / totalAssets) * 100)
  const neutroPercent = Math.round((neutroCount / totalAssets) * 100)

  const avgDirectionalForce = (displayAssets.reduce((sum, a) => sum + a.finalScore, 0) / totalAssets).toFixed(2)
  const avgConfidence = Math.round(displayAssets.reduce((sum, a) => sum + a.confidence, 0) / totalAssets)

  // Status do mercado baseado na confiança média
  const getMarketStatus = (confidence: number) => {
    if (confidence >= 70)
      return {
        text: "Estado Ideal",
        color: "text-emerald-400",
        bg: "bg-gradient-to-r from-emerald-500/20 to-teal-500/20",
        border: "border-emerald-500/30",
        sideBar: "border-l-emerald-500",
      }
    if (confidence >= 50)
      return {
        text: "Cautela",
        color: "text-amber-400",
        bg: "bg-gradient-to-r from-amber-500/20 to-orange-500/20",
        border: "border-amber-500/30",
        sideBar: "border-l-amber-500",
      }
    return {
      text: "Risco Máximo",
      color: "text-red-400",
      bg: "bg-gradient-to-r from-red-500/20 to-rose-500/20",
      border: "border-red-500/30",
      sideBar: "border-l-red-500",
    }
  }

  const marketStatus = getMarketStatus(avgConfidence)

  // Dados do sistema (Firebase ou fallback)
  const systemData = status || {
    isOnline: true,
    lastSync: "14:32:15",
    totalAnalyses: 1247,
    activeTraders: 12,
    precision: 94.7,
    marketStatus: "Operacional",
  }

  if (assetsLoading || statusLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Carregando dados do SIOM...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Status Bar Superior */}
      <div className="flex items-center justify-between py-4 px-2">
        <div className="flex items-center space-x-8">
          <div className="flex items-center">
            <Wifi className={`w-4 h-4 mr-2 ${systemData.isOnline ? "text-emerald-400" : "text-red-400"}`} />
            <span className={`font-semibold text-sm ${systemData.isOnline ? "text-emerald-400" : "text-red-400"}`}>
              SIOM {systemData.isOnline ? "Online" : "Offline"}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-slate-300" />
            <span className="font-medium text-slate-300 text-sm">Última sincronização: {systemData.lastSync}</span>
          </div>
          <div className="flex items-center">
            <Target className="w-4 h-4 mr-2 text-slate-300" />
            <span className="font-medium text-slate-300 text-sm">
              Análises processadas: {systemData.totalAnalyses.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-emerald-400" />
            <span className="font-semibold text-emerald-400 text-sm">Traders ativos: {systemData.activeTraders}</span>
          </div>
          <div className="flex items-center">
            <Activity className="w-4 h-4 mr-2 text-blue-400" />
            <span className="font-semibold text-blue-400 text-sm">Precisão: {systemData.precision}%</span>
          </div>
        </div>
      </div>

      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <BarChart3 className="w-8 h-8 text-emerald-400 mr-4" />
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Dashboard Geral — Visão Estratégica Consolidada</h1>
            <p className="text-slate-400 mt-1">
              Painel tático centralizado para leitura rápida e priorização de decisões operacionais
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

      {/* 1️⃣ RADAR ESTRATÉGICO */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <MetricCard
          title="Total de Ativos Monitorados"
          value={totalAssets.toString()}
          icon={<BarChart3 className="w-5 h-5" />}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
        />

        <MetricCard
          title="% em Tendência"
          value={`${bullishPercent}% Bullish`}
          subtitle={`${bearishPercent}% Bearish • ${neutroPercent}% Neutro`}
          icon={<TrendingUp className="w-5 h-5" />}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
        />

        <MetricCard
          title="Força Direcional Média"
          value={`${Number(avgDirectionalForce) > 0 ? "+" : ""}${avgDirectionalForce}`}
          icon={<Activity className="w-5 h-5" />}
          iconColor={Number(avgDirectionalForce) > 0 ? "text-emerald-400" : "text-red-400"}
          iconBg={Number(avgDirectionalForce) > 0 ? "bg-emerald-500/10" : "bg-red-500/10"}
        />

        <MetricCard
          title="Volatilidade Agregada"
          value="Média"
          icon={<Zap className="w-5 h-5" />}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
        />

        <MetricCard
          title="Confiança Média Geral"
          value={`${avgConfidence}%`}
          icon={<Shield className="w-5 h-5" />}
          iconColor={avgConfidence >= 70 ? "text-emerald-400" : avgConfidence >= 50 ? "text-amber-400" : "text-red-400"}
          iconBg={avgConfidence >= 70 ? "bg-emerald-500/10" : avgConfidence >= 50 ? "bg-amber-500/10" : "bg-red-500/10"}
        />

        <MetricCard
          title="Última Sincronia"
          value="agora mesmo"
          icon={<Clock className="w-5 h-5" />}
          iconColor="text-teal-400"
          iconBg="bg-teal-500/10"
        />

        {/* Selo de Status */}
        <div
          className={`md:col-span-1 p-4 rounded-2xl border-l-4 ${marketStatus.sideBar} ${marketStatus.bg} ${marketStatus.border} border-t border-r border-b shadow-lg hover:scale-[1.02] transition-all duration-200`}
        >
          <div className="flex items-center mb-2">
            <CheckCircle className="w-5 h-5 mr-2 text-emerald-400" />
            <h3 className="text-xs font-medium text-slate-300 uppercase tracking-wider">Status do Mercado</h3>
          </div>
          <p className={`text-xl font-bold ${marketStatus.color}`}>{marketStatus.text}</p>
          <div className="mt-2 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${
                avgConfidence >= 70
                  ? "from-emerald-500 to-teal-500"
                  : avgConfidence >= 50
                    ? "from-amber-500 to-orange-500"
                    : "from-red-500 to-rose-500"
              } transition-all duration-1000`}
              style={{ width: `${avgConfidence}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2️⃣ MOSAICO DE ATIVOS */}
      <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50">
        <div className="flex items-center mb-5">
          <TrendingUp className="w-5 h-5 text-emerald-400 mr-3" />
          <div>
            <h2 className="text-lg font-semibold text-slate-100">Mosaico de Ativos</h2>
            <p className="text-xs text-slate-400">Análise detalhada dos principais pares cripto</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayAssets.map((asset, index) => (
            <AssetCard key={asset.symbol} asset={asset} index={index} />
          ))}
        </div>
      </div>

      {/* 3️⃣ ANÁLISE DE SESSÕES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Por Confiança */}
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 border-l-4 border-l-emerald-500">
          <div className="flex items-center mb-3">
            <Shield className="w-4 h-4 text-emerald-400 mr-2" />
            <h3 className="text-sm font-semibold text-slate-100">Top Confiança</h3>
          </div>
          <p className="text-xs text-slate-400 mb-3">Ativos com maior e menor confiança</p>

          <div className="space-y-2">
            {displayAssets
              .sort((a, b) => b.confidence - a.confidence)
              .slice(0, 3)
              .map((asset, index) => (
                <div key={asset.symbol} className="p-2.5 bg-slate-700/30 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-300">{asset.symbol}</span>
                    <span
                      className={`font-bold text-xs ${
                        asset.confidence >= 70
                          ? "text-emerald-400"
                          : asset.confidence >= 50
                            ? "text-amber-400"
                            : "text-red-400"
                      }`}
                    >
                      {asset.confidence}%
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Regimes de Mercado */}
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 border-l-4 border-l-blue-500">
          <div className="flex items-center mb-3">
            <Activity className="w-4 h-4 text-blue-400 mr-2" />
            <h3 className="text-sm font-semibold text-slate-100">Regimes de Mercado</h3>
          </div>
          <p className="text-xs text-slate-400 mb-3">Distribuição atual dos regimes</p>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-300">Tendência Alta</span>
              <span className="text-emerald-400 font-bold text-xs">{bullishPercent}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-300">Consolidação</span>
              <span className="text-amber-400 font-bold text-xs">{neutroPercent}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-300">Tendência Baixa</span>
              <span className="text-red-400 font-bold text-xs">{bearishPercent}%</span>
            </div>
          </div>
        </div>

        {/* Gestão de Contexto */}
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 border-l-4 border-l-purple-500">
          <div className="flex items-center mb-3">
            <BarChart3 className="w-4 h-4 text-purple-400 mr-2" />
            <h3 className="text-sm font-semibold text-slate-100">Gestão de Contexto</h3>
          </div>
          <p className="text-xs text-slate-400 mb-3">Estado atual dos contextos</p>

          <div className="space-y-2">
            <div className="p-2.5 bg-slate-700/30 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-300">Macro Trend</span>
                <span className="text-emerald-400 text-xs">Ativo</span>
              </div>
            </div>
            <div className="p-2.5 bg-slate-700/30 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-300">Micro Signals</span>
                <span className="text-amber-400 text-xs">Monitorando</span>
              </div>
            </div>
            <div className="p-2.5 bg-slate-700/30 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-300">Risk Management</span>
                <span className="text-emerald-400 text-xs">Otimizado</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção Inferior Adicional */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Scanner de Volatilidade */}
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 border-l-4 border-l-amber-500">
          <div className="flex items-center mb-3">
            <Zap className="w-4 h-4 text-amber-400 mr-2" />
            <h3 className="text-sm font-semibold text-slate-100">Scanner de Volatilidade</h3>
          </div>
          <p className="text-xs text-slate-400 mb-3">Ativos em alta volatilidade</p>

          <div className="space-y-2">
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <div className="text-2xl font-bold text-amber-400 mb-1">
                {assets.filter((asset) => asset.alerts?.altaVolatilidade).length || 3}
              </div>
              <div className="text-xs text-slate-400">ativos em alta volatilidade</div>
            </div>
            <div className="space-y-1.5">
              {displayAssets.slice(0, 2).map((asset, index) => (
                <div key={asset.symbol} className="flex justify-between text-xs">
                  <span className="text-slate-300">{asset.symbol}</span>
                  <span className={index === 0 ? "text-amber-400" : "text-red-400"}>
                    {index === 0 ? "Moderada" : "Alta"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Narrativa Inteligente */}
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 border-l-4 border-l-teal-500">
          <div className="flex items-center mb-3">
            <FileText className="w-4 h-4 text-teal-400 mr-2" />
            <h3 className="text-sm font-semibold text-slate-100">Narrativa Inteligente</h3>
          </div>
          <p className="text-xs text-slate-400 mb-3">Resumo inteligente do mercado</p>

          <div className="p-3 bg-slate-700/30 rounded-lg">
            <p className="text-xs text-slate-300 leading-relaxed">
              Mercado em expansão, {bullishPercent}% dos ativos em tendência bullish, volatilidade elevada detectada em{" "}
              {assets.filter((asset) => asset.alerts?.altaVolatilidade).length || 3} pares. Confiança geral em{" "}
              {avgConfidence}%, {avgConfidence >= 70 ? "cenário favorável" : "cautela sugerida"} para posições de curto
              prazo.
            </p>
          </div>
        </div>

        {/* Últimos Eventos */}
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 border-l-4 border-l-blue-500">
          <div className="flex items-center mb-3">
            <History className="w-4 h-4 text-blue-400 mr-2" />
            <h3 className="text-sm font-semibold text-slate-100">Últimos Eventos</h3>
          </div>
          <p className="text-xs text-slate-400 mb-3">Atividade recente do sistema</p>

          <div className="space-y-2">
            <div className="flex items-start space-x-2 p-2.5 bg-slate-700/30 rounded-lg">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5"></div>
              <div className="flex-1">
                <p className="text-xs text-slate-200">
                  {displayAssets.find((a) => a.trend === "Bullish")?.symbol || "BTC"} rompeu resistência
                </p>
                <p className="text-xs text-slate-400">há 15 min</p>
              </div>
            </div>
            <div className="flex items-start space-x-2 p-2.5 bg-slate-700/30 rounded-lg">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5"></div>
              <div className="flex-1">
                <p className="text-xs text-slate-200">
                  {displayAssets.find((a) => a.trend === "Neutral")?.symbol || "ETH"} em consolidação lateral
                </p>
                <p className="text-xs text-slate-400">há 32 min</p>
              </div>
            </div>
            <div className="flex items-start space-x-2 p-2.5 bg-slate-700/30 rounded-lg">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5"></div>
              <div className="flex-1">
                <p className="text-xs text-slate-200">
                  {displayAssets.find((a) => a.trend === "Bearish")?.symbol || "SOL"} perdeu suporte
                </p>
                <p className="text-xs text-slate-400">há 1h</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de erro se houver problemas com Firebase */}
      {(assetsError || statusError) && (
        <div className="fixed bottom-4 right-4 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 max-w-sm">
          <div className="flex items-center">
            <Zap className="w-4 h-4 text-amber-400 mr-2" />
            <div>
              <p className="text-xs font-medium text-amber-400">Modo Offline</p>
              <p className="text-xs text-slate-400">Usando dados de demonstração</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Componente MetricCard refinado
function MetricCard({
  title,
  value,
  subtitle,
  detail,
  icon,
  iconColor,
  iconBg,
}: {
  title: string
  value: string
  subtitle?: string
  detail?: string
  icon: React.ReactNode
  iconColor: string
  iconBg: string
}) {
  return (
    <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${iconBg}`}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
        <p className="text-xl font-bold text-slate-100">{value}</p>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        {detail && <p className="text-xs text-slate-500">{detail}</p>}
      </div>
    </div>
  )
}

// Componente AssetCard refinado para cripto
function AssetCard({
  asset,
  index,
}: {
  asset: { symbol: string; timeframe: string; finalScore: number; trend: string; confidence: number }
  index: number
}) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence > 70) return "text-emerald-400"
    if (confidence >= 40) return "text-amber-400"
    return "text-red-400"
  }

  const getScoreColor = (score: number) => {
    return score > 0 ? "text-emerald-400" : "text-red-400"
  }

  const getTrendIcon = (trend: string) => {
    if (trend === "Bullish") return <ArrowUp className="w-3 h-3" />
    if (trend === "Bearish") return <ArrowDown className="w-3 h-3" />
    return <Minus className="w-3 h-3" />
  }

  const getRiskBadgeColor = (confidence: number) => {
    if (confidence >= 70) return "border-l-emerald-500"
    if (confidence >= 40) return "border-l-amber-500"
    return "border-l-red-500"
  }

  // Calcular gauge circular para Score Final
  const radius = 16
  const circumference = 2 * Math.PI * radius
  const scoreNormalized = Math.max(0, Math.min(100, (asset.finalScore + 3) * 16.67)) // Normalizar de -3 a +3 para 0-100
  const strokeDashoffset = circumference - (scoreNormalized / 100) * circumference

  return (
    <div
      className={`bg-slate-700/30 rounded-xl p-4 border border-slate-600/30 border-l-4 ${getRiskBadgeColor(asset.confidence)} hover:border-slate-500/50 transition-all duration-200 animate-fade-in-up`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-semibold text-slate-100">{asset.symbol}</h4>
        <span className="text-xs bg-slate-600/50 text-slate-300 px-2 py-0.5 rounded-full">{asset.timeframe}</span>
      </div>

      {/* Body com Gauge */}
      <div className="space-y-3 mb-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">Score Final:</span>
          <div className="flex items-center space-x-2">
            {/* Mini Gauge Circular */}
            <div className="relative">
              <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="text-slate-700"
                />
                <circle
                  cx="18"
                  cy="18"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className={getScoreColor(asset.finalScore)}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className={`text-sm font-bold ${getScoreColor(asset.finalScore)}`}>
              {asset.finalScore > 0 ? "+" : ""}
              {asset.finalScore.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">Tendência:</span>
          <div
            className={`flex items-center text-sm font-medium ${
              asset.trend === "Bullish"
                ? "text-emerald-400"
                : asset.trend === "Bearish"
                  ? "text-red-400"
                  : "text-amber-400"
            }`}
          >
            {getTrendIcon(asset.trend)}
            <span className="ml-1">{asset.trend}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">Confiança:</span>
          <span className={`text-sm font-bold ${getConfidenceColor(asset.confidence)}`}>{asset.confidence}%</span>
        </div>
      </div>

      {/* Footer */}
      <button className="w-full flex items-center justify-center bg-slate-600/30 hover:bg-slate-600/50 text-slate-300 hover:text-emerald-400 text-xs font-medium py-2 rounded-lg transition-all duration-200">
        Ver Análise Completa
        <ExternalLink className="w-3 h-3 ml-1" />
      </button>
    </div>
  )
}
