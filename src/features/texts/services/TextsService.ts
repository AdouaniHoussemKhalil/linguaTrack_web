import api from "@/lib/axios";
import type { AnalyseTextResult, TextAnalyzeRequest } from "../types/text";

export const TextsService = {
  analyse: async (request: TextAnalyzeRequest): Promise<AnalyseTextResult> => {
    const response = await api.post("/texts/analyze", request);
    const data = response.data;
    return data;
  },

  getById: async (id: string, userId: string): Promise<AnalyseTextResult> => {
    const response = await api.get(`/texts/history/${userId}/${id}`);
    return response.data;
  },
};
