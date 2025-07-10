// @/components/asset-card.tsx
import { ReactNode } from 'react';

// A interface foi atualizada para aceitar o novo 'trendComponent'
interface AssetCardProps {
  ticker: string;
  timeframe: string;
  finalScore: number;
  confidence: number;
  trendComponent: ReactNode; // NOVA PROPRIEDADE
}

// Corrigido para export default, que é o padrão esperado pelo seu projeto
export default function AssetCard({ 
  ticker, 
  timeframe, 
  finalScore, 
  confidence, 
  trendComponent 
}: AssetCardProps) {
  
  const scoreColor = finalScore > 0 ? 'text-green-500' : finalScore < 0 ? 'text-red-500' : 'text-gray-400';
  const confidenceColor = confidence > 70 ? 'text-green-400' : confidence > 40 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 shadow-lg border border-gray-700/50 space-y-3 transition-all hover:bg-gray-800/80 hover:border-gray-600">
      <div className="flex justify-between items-center">
        <span className="font-bold text-lg text-white">{ticker}</span>
        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">{timeframe}</span>
      </div>
      <div className="flex justify-between items-baseline">
        <span className="text-sm text-gray-400">Score Final:</span>
        <span className={`font-bold text-xl ${scoreColor}`}>
          {finalScore > 0 ? `+${finalScore.toFixed(2)}` : finalScore.toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between items-baseline">
        <span className="text-sm text-gray-400">Confiança:</span>
        <span className={`font-bold text-xl ${confidenceColor}`}>{confidence}%</span>
      </div>
      
      {/* LOCAL ONDE O NOVO COMPONENTE DE TENDÊNCIA É RENDERIZADO */}
      <div className="flex justify-between items-center pt-2 border-t border-gray-700/50">
          <span className="text-sm text-gray-400">Tendência:</span>
          <div className="font-bold text-sm">{trendComponent}</div>
      </div>
    </div>
  );
}