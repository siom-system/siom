// @/components/kpi-card.tsx
import { ReactNode } from 'react';

interface KpiCardProps {
  title: string;
  value: ReactNode;
  icon: ReactNode;
  color?: string;
}

export function KpiCard({ title, value, icon, color = 'text-white' }: KpiCardProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center space-x-4">
      <div className="text-gray-400">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider">{title}</p>
        {/* A TAG <p> FOI TROCADA POR <div> PARA CORRIGIR O ERRO DE HIDRATAÇÃO */}
        <div className={`text-xl font-bold ${color}`}>{value}</div>
      </div>
    </div>
  );
}