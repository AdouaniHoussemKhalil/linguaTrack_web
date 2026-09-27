import { Link, useNavigate } from "react-router";
import { Badge, IconButton } from "@quickadui/core";
import { TrashIcon } from "@quickadui/icons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@quickadui/data";
import { routes } from "@/app/routes/routes";
import { getModeLabel, scoreVariant } from "@/features/texts";
import { formatDateTime, formatNumber, truncateWords } from "@/utils/format";
import type { HistoryItemDto } from "../types/History";

interface HistoryTableProps {
  items: HistoryItemDto[];
  /** Demande de suppression d'un texte (la confirmation est gérée par la page). */
  onDelete?: ((item: HistoryItemDto) => void) | undefined;
}

export const HistoryTable = ({ items, onDelete }: HistoryTableProps) => {
  const navigate = useNavigate();
  const detailPath = (item: HistoryItemDto) => `${routes.correction}/${item.id}`;

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
            <TableHead className="w-12">
              <span className="sr-only">Actions</span>
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
              <TableCell className="text-right">
                {onDelete && (
                  <IconButton
                    variant="ghost"
                    size="sm"
                    aria-label={`Supprimer « ${truncateWords(item.original_text, 5)} »`}
                    title="Supprimer"
                    className="text-neutral-10 hover:text-danger-11"
                    onClick={(event) => {
                      event.stopPropagation(); // ne pas ouvrir le détail
                      onDelete(item);
                    }}
                  >
                    <TrashIcon size={16} aria-hidden />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
