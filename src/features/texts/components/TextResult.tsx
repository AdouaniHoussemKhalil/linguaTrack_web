import { useState } from "react";
import { LuMessageSquareText } from "react-icons/lu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  copyToClipboard,
} from "@quickadui/core";
import { CheckIcon, CopyIcon } from "@quickadui/icons";
import { ScoreRing } from "@/components/ScoreRing";
import { formatDateTime, formatNumber } from "@/utils/format";
import { getModeLabel, severityDisplay } from "../constants";
import type { AnalyseTextResult } from "../types/text";

interface TextResultProps {
  result: AnalyseTextResult;
}

const TextResult = ({ result }: TextResultProps) => {
  const [copied, setCopied] = useState(false);
  const errors = result.errors ?? [];

  const handleCopy = async () => {
    if (await copyToClipboard(result.corrected_text)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <CardTitle>Résultat de l'analyse</CardTitle>
          <CardDescription>{formatDateTime(result.created_at)}</CardDescription>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{getModeLabel(result.mode)}</Badge>
            {result.target_level && <Badge variant="outline">Niveau {result.target_level}</Badge>}
            {result.processing_time !== null && (
              <Badge variant="outline">{formatNumber(result.processing_time)} s</Badge>
            )}
          </div>
        </div>
        <ScoreRing score={result.score} size={96} />
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {result.feedback && (
          <section aria-label="Appréciation" className="flex gap-3 rounded-lg border border-accent-6 bg-accent-2 p-4">
            <LuMessageSquareText className="mt-0.5 size-5 shrink-0 text-accent-11" aria-hidden />
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold text-neutral-12">Appréciation</h3>
              <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-11">{result.feedback}</p>
            </div>
          </section>
        )}

        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-neutral-12">Texte corrigé</h3>
            <Button variant="ghost" size="sm" onClick={handleCopy} aria-live="polite">
              {copied ? <CheckIcon size={14} aria-hidden /> : <CopyIcon size={14} aria-hidden />}
              {copied ? "Copié" : "Copier"}
            </Button>
          </div>
          <p className="whitespace-pre-wrap rounded-lg border border-success-6 bg-success-2 p-4 leading-relaxed text-neutral-12">
            {result.corrected_text}
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-neutral-12">
            Erreurs détectées <span className="font-normal text-neutral-11">({errors.length})</span>
          </h3>

          {errors.length === 0 ? (
            <p className="rounded-lg border border-neutral-6 p-4 text-sm text-neutral-11">
              Aucune erreur détectée. Bravo !
            </p>
          ) : (
            <Accordion type="multiple" className="rounded-lg border border-neutral-6 px-4">
              {errors.map((error, index) => {
                const severity = error.severity ? severityDisplay[error.severity] : undefined;

                return (
                  <AccordionItem key={error.id ?? index} value={String(index)}>
                    <AccordionTrigger>
                      <span className="flex flex-1 flex-wrap items-center gap-2 text-left">
                        <span className="font-medium capitalize">{error.error_type}</span>
                        {severity && <Badge variant={severity.variant}>{severity.label}</Badge>}
                        <span className="hidden truncate text-sm font-normal text-neutral-11 sm:inline">
                          « {error.original_fragment} » → « {error.corrected_fragment} »
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-3 pb-2">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-11">Original</span>
                            <p className="rounded-md border border-danger-6 bg-danger-2 p-3 font-mono text-sm text-neutral-12 line-through decoration-danger-9">
                              {error.original_fragment}
                            </p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-11">Correction</span>
                            <p className="rounded-md border border-success-6 bg-success-2 p-3 font-mono text-sm text-neutral-12">
                              {error.corrected_fragment}
                            </p>
                          </div>
                        </div>
                        {error.explanation && (
                          <p className="rounded-md bg-neutral-2 p-3 text-sm leading-relaxed text-neutral-11">
                            {error.explanation}
                          </p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </section>
      </CardContent>
    </Card>
  );
};

export default TextResult;
