import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@quickadui/core";
import { formatNumber } from "@/utils/format";

interface ErrorTypesChartProps {
  counts: Record<string, number>;
}

/**
 * Barres horizontales plutôt que le BarChart QuickadUI : ses libellés d'axe, limités
 * à la largeur d'une barre et sans rotation possible, se chevauchaient dès 5 types.
 */
export const ErrorTypesChart = ({ counts }: ErrorTypesChartProps) => {
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  const max = Math.max(0, ...Object.values(counts));
  const rows = Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .map(([type, count]) => ({
      label: type.charAt(0).toUpperCase() + type.slice(1),
      count,
      share: total ? (count / total) * 100 : 0,
      width: max ? (count / max) * 100 : 0,
    }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Types d'erreurs</CardTitle>
        <CardDescription>Ce qui revient le plus souvent dans vos textes.</CardDescription>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="py-10 text-center text-sm text-neutral-11">Aucune erreur sur cette période.</p>
        ) : (
          <ul className="flex flex-col gap-3" aria-label="Nombre d'erreurs par type">
            {rows.map((row) => (
              <li
                key={row.label}
                // Mobile : libellé et nombre sur une ligne, barre dessous ; à partir de sm : tout sur une ligne
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 text-sm sm:grid-cols-[minmax(0,7.5rem)_1fr_auto]"
                aria-label={`${row.label} : ${row.count} erreur${row.count > 1 ? "s" : ""} (${formatNumber(row.share)} %)`}
              >
                <span className="truncate text-neutral-12" title={row.label} aria-hidden>
                  {row.label}
                </span>
                <span className="text-right tabular-nums text-neutral-11 sm:order-last sm:w-20" aria-hidden>
                  <span className="font-semibold text-neutral-12">{row.count}</span> · {formatNumber(row.share)} %
                </span>
                <span className="col-span-2 h-2.5 overflow-hidden rounded-full bg-neutral-4 sm:col-span-1" aria-hidden>
                  <span className="block h-full rounded-full bg-neutral-12" style={{ width: `${row.width}%` }} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
