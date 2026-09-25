import { useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import { Alert, AlertDescription, AlertTitle, Button, Card, CardContent, CardHeader, Skeleton } from "@quickadui/core";
import { toast } from "@quickadui/overlays";
import { PlusIcon } from "@quickadui/icons";
import { routes } from "@/app/routes/routes";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { getErrorMessage } from "@/lib/errors";
import { useTextById } from "@/features/texts/hooks/useTextById";
import { useTexts } from "@/features/texts/hooks/useTexts";
import { AnalyzeForm } from "../components/AnalyzeForm";
import TextResult from "../components/TextResult";
import type { AnalyzeFormSchema } from "../schemas";

const ResultSkeleton = () => (
  <Card aria-busy>
    <CardHeader className="flex flex-row items-start justify-between gap-4">
      <div className="flex flex-1 flex-col gap-3">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="size-24 rounded-full" />
    </CardHeader>
    <CardContent className="flex flex-col gap-3">
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </CardContent>
  </Card>
);

const TextsPage = () => {
  const { id, userId } = useParams<{ id?: string; userId?: string }>();
  const location = useLocation();
  const { data: loadedResult, isLoading: isLoadingText, error: loadError } = useTextById(id, userId);
  const { mutate: analyze, isPending, data: analyzedResult } = useTexts();

  // Un résultat d'analyse ne vaut que pour la navigation où il a été demandé :
  // en ouvrant un autre texte, « Nouveau texte » ou la Sidebar, on repart du texte chargé.
  const [analyzedAt, setAnalyzedAt] = useState<string | null>(null);
  const result = analyzedResult && analyzedAt === location.key ? analyzedResult : loadedResult;

  const handleSubmit = (values: AnalyzeFormSchema) => {
    setAnalyzedAt(location.key);
    analyze(values, {
      onError: (error) => {
        toast({
          variant: "danger",
          title: "L'analyse a échoué",
          description: getErrorMessage(error),
        });
      },
    });
  };

  return (
    <div className="py-6">
      <PageHeader
        title="Analyse de texte"
        description="Saisissez votre texte et choisissez un mode : LinguaTrack le corrige et explique chaque erreur."
        actions={
          id && (
            <Button asChild variant="outline">
              <Link to={routes.correction}>
                <PlusIcon size={16} aria-hidden />
                Nouveau texte
              </Link>
            </Button>
          )
        }
      />

      {loadError && (
        <Alert variant="danger" className="mb-6">
          <AlertTitle>Texte introuvable</AlertTitle>
          <AlertDescription>Impossible de récupérer ce texte. Il a peut-être été supprimé.</AlertDescription>
        </Alert>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        {isLoadingText ? (
          <Skeleton className="h-[480px] w-full rounded-xl" />
        ) : (
          <AnalyzeForm
            // Formulaire remis à zéro à chaque navigation (autre texte, « Nouveau texte »…)
            key={location.key}
            defaultValues={{
              text: loadedResult?.original_text ?? "",
              mode: loadedResult?.mode ?? "correction",
            }}
            isPending={isPending}
            onSubmit={handleSubmit}
          />
        )}

        <section aria-live="polite" aria-label="Résultat">
          {isPending || isLoadingText ? (
            <ResultSkeleton />
          ) : result ? (
            <TextResult result={result} />
          ) : (
            <EmptyState
              title="Aucun résultat pour le moment"
              description="Lancez une analyse, ou ouvrez un texte depuis l'historique pour revoir sa correction."
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default TextsPage;
