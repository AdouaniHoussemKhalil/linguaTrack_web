import type { AnalyseTextResult } from "@/features/texts/types/text";

export type HistoryItemDto = AnalyseTextResult;

export type GetHistoryRequest = {
  period?: "all" | "day" | "week" | "month" | "year";
};
