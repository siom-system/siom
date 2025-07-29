interface AssetCardProps {
  ticker: string
  timeframe: string
  finalScore: number
  confidence: number
}

export default function AssetCard({ ticker, timeframe, finalScore, confidence }: AssetCardProps) {
  // Função para determinar a cor do score final
  const getScoreColor = (score: number) => {
    return score > 0 ? "text-green-400" : "text-red-400"
  }

  // Função para determinar a cor da confiança
  const getConfidenceColor = (conf: number) => {
    const percentage = conf * 100
    if (percentage >= 75) return "text-green-400"
    if (percentage >= 50) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 hover:ring-2 hover:ring-cyan-500 hover:border-cyan-500/50 transition-all duration-200 hover:scale-[1.02]">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-cyan-400">{ticker}</h3>
        <span className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded">{timeframe}</span>
      </div>

      {/* Corpo */}
      <div className="space-y-3">
        {/* Score Final */}
        <div className="flex justify-between items-center">
          <span className="text-gray-300 text-sm">Score Final:</span>
          <span className={`font-bold text-lg ${getScoreColor(finalScore)}`}>
            {finalScore > 0 ? "+" : ""}
            {finalScore.toFixed(2)}
          </span>
        </div>

        {/* Confiança */}
        <div className="flex justify-between items-center">
          <span className="text-gray-300 text-sm">Confiança:</span>
          <span className={`font-bold text-lg ${getConfidenceColor(confidence)}`}>
            {(confidence * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Indicador visual adicional */}
      <div className="mt-4 pt-3 border-t border-gray-700">
        <div className="flex items-center justify-center">
          <div className={`w-3 h-3 rounded-full ${finalScore > 0 ? "bg-green-400" : "bg-red-400"} animate-pulse`}></div>
          <span className="ml-2 text-xs text-gray-400">{finalScore > 0 ? "Bullish" : "Bearish"}</span>
        </div>
      </div>
    </div>
  )
}
