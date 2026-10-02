import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Alert, AlertDescription, AlertTitle, Button, Skeleton } from "@quickadui/core";
import { Input } from "@quickadui/forms";
import { SearchIcon } from "@quickadui/icons";
import { toast } from "@quickadui/overlays";
import { routes } from "@/app/routes/routes";
import { EmptyState } from "@/components/EmptyState";
import { ListPagination } from "@/components/ListPagination";
import { PageHeader } from "@/components/PageHeader";
import { PeriodTabs } from "@/components/PeriodTabs";
import { useDeleteText, useHistory } from "@/features/history/hooks/useHistory";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { getErrorMessage } from "@/lib/errors";
import { parsePeriod, type Period } from "@/utils/period";
import { DeleteTextDialog } from "../components/DeleteTextDialog";
import { HistoryTable } from "../components/HistoryTable";
import type { HistoryItemDto } from "../types/History";

const PAGE_SIZE = 10;

const HistoryPage = () => {
  // Période, recherche et page dans l'URL : elles survivent au rechargement et au retour arrière.
  const [searchParams, setSearchParams] = useSearchParams();
  const period = parsePeriod(searchParams.get("period"));
  const query = searchParams.get("q") ?? "";
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);

  const [search, setSearch] = useState(query);
  const debouncedSearch = useDebouncedValue(search);

  const { data, isLoading, isFetching, error, refetch } = useHistory({
    period,
    q: query || undefined,
    page,
    page_size: PAGE_SIZE,
  });
  const { mutate: deleteText, isPending: isDeleting } = useDeleteText();
  const [toDelete, setToDelete] = useState<HistoryItemDto | null>(null);

  const updateParams = (next: { period?: Period; q?: string; page?: number }) => {
    setSearchParams((current) => {
      const params = new URLSearchParams(current);
      const set = (key: string, value: string | undefined) => (value ? params.set(key, value) : params.delete(key));
      if (next.period !== undefined) set("period", next.period === "all" ? undefined : next.period);
      if (next.q !== undefined) set("q", next.q.trim() || undefined);
      // Nouvelle période ou nouvelle recherche : retour à la première page
      if (next.period !== undefined || next.q !== undefined) params.delete("page");
      if (next.page !== undefined) set("page", next.page > 1 ? String(next.page) : undefined);
      return params;
    });
  };

  // La recherche saisie n'est appliquée qu'après une courte pause de frappe
  useEffect(() => {
    if (debouncedSearch.trim() !== query) updateParams({ q: debouncedSearch });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- seule la saisie stabilisée déclenche la recherche
  }, [debouncedSearch]);

  // Page devenue vide après une suppression : revenir à la dernière page existante
  useEffect(() => {
    if (data && data.items.length === 0 && data.total > 0 && page > data.pages) updateParams({ page: data.pages });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, page]);

  const confirmDelete = (item: HistoryItemDto) => {
    deleteText(item.id, {
      onSuccess: () => {
        setToDelete(null);
        toast({ variant: "success", title: "Texte supprimé" });
      },
      onError: (deleteError) => {
        setToDelete(null);
        toast({ variant: "danger", title: "Suppression impossible", description: getErrorMessage(deleteError) });
      },
    });
  };

  const hasFilters = period !== "all" || Boolean(query);

  return (
    <div className="py-6">
      <PageHeader
        title="Historique"
        description="Retrouvez tous vos textes analysés et leurs corrections."
        actions={<PeriodTabs value={period} onChange={(next) => updateParams({ period: next })} />}
      />

      <div className="mb-4 max-w-md">
        <Input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher dans vos textes…"
          aria-label="Rechercher dans vos textes"
          startIcon={<SearchIcon size={16} aria-hidden />}
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2" aria-busy aria-label="Chargement de l'historique">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-14 w-full" />
          ))}
        </div>
      ) : error || !data ? (
        <Alert variant="danger">
          <AlertTitle>Impossible de charger l'historique</AlertTitle>
          <AlertDescription className="flex flex-col items-start gap-3">
            Vérifiez votre connexion puis réessayez.
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              Réessayer
            </Button>
          </AlertDescription>
        </Alert>
      ) : data.total === 0 ? (
        <EmptyState
          title={hasFilters ? "Aucun texte ne correspond" : "Aucun texte analysé"}
          description={
            query
              ? `Aucun texte ne contient « ${query} »${period === "all" ? "" : " sur cette période"}.`
              : hasFilters
                ? "Essayez une période plus large."
                : "Vos analyses apparaîtront ici dès votre premier texte corrigé."
          }
          action={
            hasFilters ? (
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setSearchParams({});
                }}
              >
                Effacer les filtres
              </Button>
            ) : (
              <Button asChild>
                <Link to={routes.correction}>Analyser un texte</Link>
              </Button>
            )
          }
        />
      ) : (
        <div className={`flex flex-col gap-4 transition-opacity ${isFetching ? "opacity-60" : ""}`} aria-busy={isFetching}>
          <p className="text-sm text-neutral-11" aria-live="polite">
            {data.total} texte{data.total > 1 ? "s" : ""}
            {query && <> contenant « {query} »</>}
          </p>
          <HistoryTable items={data.items} onDelete={setToDelete} />
          <ListPagination page={data.page} totalPages={data.pages} onPageChange={(next) => updateParams({ page: next })} />
        </div>
      )}

      <DeleteTextDialog item={toDelete} isPending={isDeleting} onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />
    </div>
  );
};

export default HistoryPage;
