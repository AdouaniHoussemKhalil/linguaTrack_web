import type { AnalyseTextResult } from "@/features/texts";
import type { Period } from "@/utils/period";

export type HistoryItemDto = AnalyseTextResult;

export type GetHistoryRequest = {
  period?: Period;
};
