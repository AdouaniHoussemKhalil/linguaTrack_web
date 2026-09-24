import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@quickadui/core";
import { DonutChart } from "@quickadui/charts";
import { getModeLabel } from "@/features/texts";

interface ModeDistributionChartProps {
  counts: Record<string, number>;
}

export const ModeDistributionChart = ({ counts }: ModeDistributionChartProps) => {
  const data = Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .map(([mode, value]) => ({ key: mode, label: getModeLabel(mode), value }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Modes utilisés</CardTitle>
        <CardDescription>Répartition de vos analyses par mode.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        {data.length === 0 ? (
          <p className="py-10 text-center text-sm text-neutral-11">Aucune analyse sur cette période.</p>
        ) : (
          <DonutChart
            data={data}
            size={200}
            valueFormatter={(value) => `${value} texte${value > 1 ? "s" : ""}`}
            aria-label="Répartition des analyses par mode"
          />
        )}
      </CardContent>
    </Card>
  );
};
