import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@quickadui/core";
import { BarChart } from "@quickadui/charts";

interface ErrorTypesChartProps {
  counts: Record<string, number>;
}

export const ErrorTypesChart = ({ counts }: ErrorTypesChartProps) => {
  const data = Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .map(([type, count]) => ({ type: type.charAt(0).toUpperCase() + type.slice(1), count }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Types d'erreurs</CardTitle>
        <CardDescription>Ce qui revient le plus souvent dans vos textes.</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-10 text-center text-sm text-neutral-11">Aucune erreur sur cette période.</p>
        ) : (
          <BarChart
            data={data}
            categoryKey="type"
            series={[{ key: "count", label: "Erreurs" }]}
            height={260}
            valueFormatter={(value) => String(Math.round(value))}
            aria-label="Nombre d'erreurs par type"
          />
        )}
      </CardContent>
    </Card>
  );
};
