import type { ReactNode } from "react";
import { LuFileText, LuGauge, LuTimer, LuTriangleAlert } from "react-icons/lu";
import { Card, CardContent } from "@quickadui/core";
import { StatCard, type StatCardTrend } from "@quickadui/charts";
import { formatChange, formatNumber } from "@/utils/format";
import type { GetStatsDto } from "../types/Stats";

/** Tendance « plus = mieux » ; rien si l'API n'a pas de période de comparaison. */
const toTrend = (change: number | null | undefined): StatCardTrend | undefined =>
  change === null || change === undefined
    ? undefined
    : { direction: change >= 0 ? "up" : "down", label: formatChange(change) };

const Kpi = ({ children }: { children: ReactNode }) => (
  <Card>
    <CardContent className="p-5">{children}</CardContent>
  </Card>
);

const iconClass = "size-5 text-neutral-9";

export const KpiCards = ({ stats }: { stats: GetStatsDto }) => (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <Kpi>
      <StatCard
        label="Textes analysés"
        value={stats.total_texts}
        icon={<LuFileText className={iconClass} aria-hidden />}
        trend={toTrend(stats.total_texts_change)}
      />
    </Kpi>
    <Kpi>
      <StatCard
        label="Score moyen"
        value={stats.average_score === null ? "–" : `${formatNumber(stats.average_score)} / 100`}
        icon={<LuGauge className={iconClass} aria-hidden />}
        trend={toTrend(stats.average_score_change)}
      />
    </Kpi>
    <Kpi>
      {/* Pas de flèche ici : une hausse d'erreurs est une mauvaise nouvelle, StatCard la colorerait en vert. */}
      <StatCard
        label="Erreurs détectées"
        value={stats.total_errors}
        icon={<LuTriangleAlert className={iconClass} aria-hidden />}
      >
        <p className="text-xs text-neutral-11">
          {formatNumber(stats.average_errors_per_text)} par texte
          {stats.total_errors_change !== null && stats.total_errors_change !== undefined && (
            <> · {formatChange(stats.total_errors_change)} vs période précédente</>
          )}
        </p>
      </StatCard>
    </Kpi>
    <Kpi>
      <StatCard
        label="Temps moyen d'analyse"
        value={stats.average_processing_time === null ? "–" : `${formatNumber(stats.average_processing_time)} s`}
        icon={<LuTimer className={iconClass} aria-hidden />}
      />
    </Kpi>
  </div>
);
