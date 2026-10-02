import type { Period } from "@/utils/period";

export type GetStatsModel = {
  period: Period;
};

export type RecentText = {
  id?: string;
  original_text: string;
  created_at: string; // ISO date string
  mode: string;
  errors: Error[];
  score?: number | null;
};

export interface Error {
  error_type: string;
  severity: string | null;
  original_fragment: string;
  corrected_fragment: string;
  explanation: string;
}

export type GetStatsDto = {
  total_texts: number;
  average_score: number | null;
  total_errors: number;
  average_processing_time: number | null;
  recent_texts: RecentText[];
  mode_counts: Record<string, number>;
  error_type_counts: Record<string, number>;
  average_score_change?: number | null;
  total_texts_change?: number | null;
  total_errors_change?: number | null;
  change_notes?: string | null;
  average_errors_per_text: number;

  mode_percentages: Record<string, number>;

  error_type_percentages: Record<string, number>;
};

export type ProgressGranularity = "hour" | "day" | "week" | "month";

/** Un intervalle de GET /texts/progress ; average_score est null quand aucun texte n'a été analysé. */
export type ProgressPoint = {
  start: string;
  texts: number;
  average_score: number | null;
  errors: number;
};

export type ProgressDto = {
  period: Period;
  granularity: ProgressGranularity;
  points: ProgressPoint[];
};
