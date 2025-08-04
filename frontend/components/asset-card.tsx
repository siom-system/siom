// @/frontend/components/asset-card.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProcessedAsset } from "@/lib/types"; // Importamos nosso tipo de dado
import { cn } from "@/lib/utils"; // Utilitário para classes condicionais

// Define que este componente espera receber um objeto 'asset'
interface AssetCardProps {
  asset: ProcessedAsset;
}

export function AssetCard({ asset }: AssetCardProps) {
  // Extrai o ticker e o timeframe do ID do documento
  const [ticker, timeframe] = asset.id.split('_');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{ticker} - {timeframe}</CardTitle>
        {/* Placeholder para um ícone de ativo */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-muted-foreground">Score Final:</span>
          {/* Lógica de cor dinâmica para o Score */}
          <div className={cn(
            "text-2xl font-bold",
            asset.finalScore > 0 ? "text-green-500" : asset.finalScore < 0 ? "text-red-500" : ""
          )}>
            {asset.finalScore.toFixed(2)}
          </div>
        </div>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-xs text-muted-foreground">Confiança:</span>
           {/* Lógica de cor dinâmica para a Confiança */}
          <div className={cn(
            "text-lg font-semibold",
            asset.confidence >= 80 ? "text-green-500" : asset.confidence >= 65 ? "text-yellow-500" : "text-gray-500"
          )}>
            {asset.confidence}%
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Estado: {asset.estado}
        </p>
      </CardContent>
    </Card>
  );
}
