import { Link } from "react-router";
import { LuArrowRight } from "react-icons/lu";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@quickadui/core";
import { routes } from "@/app/routes/routes";
import { ScoreRing } from "@/components/ScoreRing";
import { getModeLabel } from "@/features/texts";
import { getUserId } from "@/lib/session";
import { formatDateTime, truncateWords } from "@/utils/format";
import type { RecentText } from "../types/Stats";

export const LastTextCard = ({ text }: { text: RecentText }) => {
  const userId = getUserId();
  const detailPath = text.id && userId ? `${routes.correction}/${text.id}/${userId}` : routes.correction;
  const errorCount = text.errors?.length ?? 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>Dernier texte analysé</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link to={detailPath}>
            Voir la correction
            <LuArrowRight aria-hidden />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-col gap-3">
          <p className="text-lg font-semibold text-neutral-12">« {truncateWords(text.original_text, 16)} »</p>
          <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-11">
            <span>{formatDateTime(text.created_at)}</span>
            <Badge variant="outline">{getModeLabel(text.mode)}</Badge>
            <Badge variant={errorCount === 0 ? "success" : "danger"}>
              {errorCount} erreur{errorCount > 1 ? "s" : ""}
            </Badge>
          </div>
        </div>
        <ScoreRing score={text.score ?? null} />
      </CardContent>
    </Card>
  );
};
