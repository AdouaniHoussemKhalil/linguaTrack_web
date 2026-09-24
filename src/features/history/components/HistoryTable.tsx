import { Link, useNavigate } from "react-router";
import { Badge } from "@quickadui/core";
import { ChevronRightIcon } from "@quickadui/icons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@quickadui/data";
import { routes } from "@/app/routes/routes";
import { getModeLabel, scoreVariant } from "@/features/texts";
import { formatDateTime, formatNumber, truncateWords } from "@/utils/format";
import type { HistoryItemDto } from "../types/History";

interface HistoryTableProps {
  items: HistoryItemDto[];
}

export const HistoryTable = ({ items }: HistoryTableProps) => {
  const navigate = useNavigate();
  const detailPath = (item: HistoryItemDto) => `${routes.correction}/${item.id}/${item.user_id}`;

  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-6 bg-neutral-1">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="md:min-w-64">Texte</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead className="hidden sm:table-cell">Mode</TableHead>
            <TableHead className="text-right">Score</TableHead>
            <TableHead className="hidden text-right sm:table-cell">Erreurs</TableHead>
            <TableHead className="hidden text-right lg:table-cell">Temps</TableHead>
            <TableHead className="w-10">
              <span className="sr-only">Ouvrir</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.id}
              className="cursor-pointer"
              // Confort souris : toute la ligne est cliquable ; le lien du texte reste la cible clavier.
              onClick={() => navigate(detailPath(item))}
            >
              <TableCell className="whitespace-normal">
                <Link
                  to={detailPath(item)}
                  onClick={(event) => event.stopPropagation()}
                  className="font-medium text-neutral-12 underline-offset-4 hover:underline"
                >
                  {truncateWords(item.original_text)}
                </Link>
                <div className="mt-1 text-xs text-neutral-11 md:hidden">{formatDateTime(item.created_at)}</div>
              </TableCell>
              <TableCell className="hidden whitespace-nowrap text-neutral-11 md:table-cell">
                {formatDateTime(item.created_at)}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge variant="outline">{getModeLabel(item.mode)}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Badge variant={scoreVariant(item.score)}>
                  {item.score === null ? "–" : Math.round(item.score)}
                </Badge>
              </TableCell>
              <TableCell className="hidden text-right tabular-nums sm:table-cell">{item.errors?.length ?? 0}</TableCell>
              <TableCell className="hidden whitespace-nowrap text-right tabular-nums text-neutral-11 lg:table-cell">
                {item.processing_time === null ? "–" : `${formatNumber(item.processing_time)} s`}
              </TableCell>
              <TableCell className="text-neutral-9">
                <ChevronRightIcon size={16} aria-hidden />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
