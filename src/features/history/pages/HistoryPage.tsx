import { Link, useSearchParams } from "react-router";
import { Alert, AlertDescription, AlertTitle, Button, Skeleton } from "@quickadui/core";
import { routes } from "@/app/routes/routes";
import { EmptyState } from "@/components/EmptyState";
import { ListPagination } from "@/components/ListPagination";
import { PageHeader } from "@/components/PageHeader";
import { PeriodTabs } from "@/components/PeriodTabs";
import { useHistory } from "@/features/history/hooks/useHistory";
import { parsePeriod, type Period } from "@/utils/period";
import { HistoryTable } from "../components/HistoryTable";

const PAGE_SIZE = 10;

const HistoryPage = () => {
  // Période et page dans l'URL : elles survivent au rechargement et au retour arrière.
  const [searchParams, setSearchParams] = useSearchParams();
  const period = parsePeriod(searchParams.get("period"));
  const requestedPage = Number(searchParams.get("page")) || 1;

  const { data = [], isLoading, error, refetch } = useHistory({ period });

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const page = Math.min(Math.max(requestedPage, 1), totalPages);
  const pageItems = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateParams = (next: { period?: Period; page?: number }) => {
    const params = new URLSearchParams(searchParams);
    if (next.period !== undefined) {
      if (next.period === "all") params.delete("period");
      else params.set("period", next.period);
      params.delete("page");
    }
    if (next.page !== undefined) {
      if (next.page <= 1) params.delete("page");
      else params.set("page", String(next.page));
    }
    setSearchParams(params);
  };

  return (
    <div className="py-6">
      <PageHeader
        title="Historique"
        description="Retrouvez tous vos textes analysés et leurs corrections."
        actions={<PeriodTabs value={period} onChange={(next) => updateParams({ period: next })} />}
      />

      {isLoading ? (
        <div className="flex flex-col gap-2" aria-busy aria-label="Chargement de l'historique">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-14 w-full" />
          ))}
        </div>
      ) : error ? (
        <Alert variant="danger">
          <AlertTitle>Impossible de charger l'historique</AlertTitle>
          <AlertDescription className="flex flex-col items-start gap-3">
            Vérifiez votre connexion puis réessayez.
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              Réessayer
            </Button>
          </AlertDescription>
        </Alert>
      ) : data.length === 0 ? (
        <EmptyState
          title={period === "all" ? "Aucun texte analysé" : "Aucun texte sur cette période"}
          description={
            period === "all"
              ? "Vos analyses apparaîtront ici dès votre premier texte corrigé."
              : "Essayez une période plus large."
          }
          action={
            <Button asChild>
              <Link to={routes.correction}>Analyser un texte</Link>
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-neutral-11">
            {data.length} texte{data.length > 1 ? "s" : ""}
          </p>
          <HistoryTable items={pageItems} />
          <ListPagination page={page} totalPages={totalPages} onPageChange={(next) => updateParams({ page: next })} />
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
