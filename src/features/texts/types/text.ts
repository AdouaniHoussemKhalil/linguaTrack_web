export type TextMode = "correction" | "professional" | "simple" | "natural" | "persuasive";

export type TextAnalyzeRequest = {
  text: string;
  mode: TextMode;
};

export type TextEntity = {
  id: string;
  original_text: string;
  corrected_text: string;
  created_at: string;
  score: number;
  mode?: TextMode;
  user_id?: string;
};

export type ResultUser = {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
};

export type ResultError = {
  id?: string;
  text_id?: string;
  error_type: string;
  severity: "low" | "medium" | "high" | null;
  original_fragment: string;
  corrected_fragment: string;
  explanation: string;
};

export type AnalyseTextResult = {
  id: string;
  original_text: string;
  corrected_text: string;
  mode: TextMode;
  target_level: string | null;
  score: number | null;
  processing_time: number | null;
  created_at: string;
  user?: ResultUser;
  errors?: ResultError[];
};

