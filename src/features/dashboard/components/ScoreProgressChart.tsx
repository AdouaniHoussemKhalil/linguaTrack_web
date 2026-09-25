import { Card, CardContent, CardDescription, CardHeader, CardTitle, Skeleton } from "@quickadui/core";
import { LineChart } from "@quickadui/charts";
import type { GetStatsModel, ProgressGranularity, ProgressPoint } from "../types/Stats";
import { useProgress } from "../hooks/useProgress";

const LABEL_FORMATS: Record<ProgressGranularity, Intl.DateTimeFormatOptions> = {
  hour: { hour: "2-digit", minute: "2-digit" },
  // Format court : l'axe peut porter une trentaine de dates
  day: { day: "2-digit", month: "2-digit" },
  week: { day: "2-digit", month: "2-digit" },
  month: { month: "short", year: "numeric" },
};

const formatBucket = (start: string, granularity: ProgressGranularity) => {
  const label = new Intl.DateTimeFormat("fr-FR", LABEL_FORMATS[granularity]).format(new Date(start));
  return granularity === "week" ? `sem. ${label}` : label;
};

const DESCRIPTIONS: Record<ProgressGranularity, string> = {
  hour: "Score moyen par heure.",
  day: "Score moyen par jour d'analyse.",
  week: "Score moyen par semaine d'analyse.",
  month: "Score moyen par mois d'analyse.",
};

export const ScoreProgressChart = ({ period }: GetStatsModel) => {
  const { data, isLoading, error } = useProgress({ period });

  // Seuls les intervalles avec des textes : LineChart trace une valeur manquante à 0
  const points = (data?.points ?? []).filter(
    (point): point is ProgressPoint & { average_score: number } => point.average_score !== null,
  );
  const chartData = data
    ? points.map((point) => ({
        label: formatBucket(point.start, data.granularity),
        score: Math.round(point.average_score),
      }))
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution du score</CardTitle>
        <CardDescription>{data ? DESCRIPTIONS[data.granularity] : "Votre score moyen au fil du temps."}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-60 w-full" />
        ) : error ? (
          <p className="py-10 text-center text-sm text-neutral-11">La courbe n'a pas pu être chargée.</p>
        ) : chartData.length < 2 ? (
          <p className="py-10 text-center text-sm text-neutral-11">
            Analysez des textes sur plusieurs {data?.granularity === "hour" ? "heures" : "jours"} pour voir votre
            progression.
          </p>
        ) : (
          <LineChart
            data={chartData}
            categoryKey="label"
            // Couleur du texte principal : bien contrastée en clair comme en sombre
            series={[{ key: "score", label: "Score moyen", color: "var(--qa-color-neutral-12)" }]}
            area
            height={240}
            valueFormatter={(value) => `${Math.round(value)} / 100`}
            aria-label="Évolution du score moyen"
          />
        )}
      </CardContent>
    </Card>
  );
};
