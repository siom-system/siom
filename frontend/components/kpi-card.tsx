// @/frontend/components/kpi-card.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}

export function KpiCard({ title, value, icon }: KpiCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
