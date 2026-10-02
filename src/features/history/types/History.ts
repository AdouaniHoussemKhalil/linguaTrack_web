import type { AnalyseTextResult } from "@/features/texts";
import type { Period } from "@/utils/period";

export type HistoryItemDto = AnalyseTextResult;

export type GetHistoryRequest = {
  period?: Period;
  q?: string;
  page?: number;
  page_size?: number;
};

/** Réponse de GET /texts. */
export type HistoryPageDto = {
  items: HistoryItemDto[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
};
