import api from "@/lib/axios";
import type { GetHistoryRequest, HistoryPageDto } from "../types/History";

export const HistoryService = {
  getHistory: async (request: GetHistoryRequest): Promise<HistoryPageDto> => {
    const response = await api.get("/texts", { params: request });
    return response.data;
  },
  deleteText: async (id: string): Promise<void> => {
    await api.delete(`/texts/${id}`);
  },
};
