import api from "@/lib/axios";
import type { AnalyseTextResult, TextAnalyzeRequest } from "../types/text";

// Le backend peut basculer sur un modèle local (Ollama), lent sur CPU : jusqu'à ~3 min
const ANALYZE_TIMEOUT_MS = 240_000;

export const TextsService = {
  analyse: async (request: TextAnalyzeRequest): Promise<AnalyseTextResult> => {
    const response = await api.post("/texts/analyze", request, { timeout: ANALYZE_TIMEOUT_MS });
    const data = response.data;
    return data;
  },

  getById: async (id: string, userId: string): Promise<AnalyseTextResult> => {
    const response = await api.get(`/texts/history/${userId}/${id}`);
    return response.data;
  },
};
