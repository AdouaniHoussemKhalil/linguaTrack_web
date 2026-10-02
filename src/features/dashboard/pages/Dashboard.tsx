import { Link, useSearchParams } from "react-router";
import { LuPenLine } from "react-icons/lu";
import { Alert, AlertDescription, AlertTitle, Button, Skeleton } from "@quickadui/core";
import { routes } from "@/app/routes/routes";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { PeriodTabs } from "@/components/PeriodTabs";
import { parsePeriod, type Period } from "@/utils/period";
import { ErrorTypesChart } from "../components/ErrorTypesChart";
import { KpiCards } from "../components/KpiCards";
import { LastTextCard } from "../components/LastTextCard";
import { ModeDistributionChart } from "../components/ModeDistributionChart";
import { ScoreProgressChart } from "../components/ScoreProgressChart";
import { useGetStats } from "../hooks/UseStats";

const DashboardSkeleton = () => (
  <div className="flex flex-col gap-4" aria-busy aria-label="Chargement du tableau de bord">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} className="h-28 rounded-xl" />
      ))}
    </div>
    <div className="grid gap-4 lg:grid-cols-3">
      <Skeleton className="h-80 rounded-xl lg:col-span-2" />
      <Skeleton className="h-80 rounded-xl" />
    </div>
    <Skeleton className="h-40 rounded-xl" />
  </div>
);

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const period = parsePeriod(searchParams.get("period"));
  const { data: stats, isLoading, error, refetch } = useGetStats({ period });

  const setPeriod = (next: Period) => {
    setSearchParams(next === "all" ? {} : { period: next });
  };

  const newAnalysisButton = (
    <Button asChild>
      <Link to={routes.correction}>
        <LuPenLine aria-hidden />
        Nouvelle analyse
      </Link>
    </Button>
  );

  return (
    <div className="py-6">
      <PageHeader
        title="Tableau de bord"
        description="Suivez votre progression en français."
        actions={
          <>
            <PeriodTabs value={period} onChange={setPeriod} />
            {newAnalysisButton}
          </>
        }
      />

      {isLoading ? (
        <DashboardSkeleton />
      ) : error || !stats ? (
        <Alert variant="danger">
          <AlertTitle>Impossible de charger vos statistiques</AlertTitle>
          <AlertDescription className="flex flex-col items-start gap-3">
            Vérifiez votre connexion puis réessayez.
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              Réessayer
            </Button>
          </AlertDescription>
        </Alert>
      ) : stats.total_texts === 0 ? (
        <EmptyState
          icon={<LuPenLine aria-hidden />}
          title={period === "all" ? "Bienvenue sur LinguaTrack !" : "Aucune analyse sur cette période"}
          description={
            period === "all"
              ? "Analysez votre premier texte pour voir apparaître vos statistiques."
              : "Choisissez une période plus large, ou lancez une nouvelle analyse."
          }
          action={newAnalysisButton}
        />
      ) : (
        <div className="flex flex-col gap-4">
          <KpiCards stats={stats} />
          <ScoreProgressChart period={period} />
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ErrorTypesChart counts={stats.error_type_counts} />
            </div>
            <ModeDistributionChart counts={stats.mode_counts} />
          </div>
          {stats.recent_texts[0] && <LastTextCard text={stats.recent_texts[0]} />}
        </div>
      )}
    </div>
  );
}
