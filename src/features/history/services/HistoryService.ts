import api from "@/lib/axios";
import type {GetHistoryRequest, HistoryItemDto } from "../types/History";

export const HistoryService = {
  getHistory: async (request: GetHistoryRequest): Promise<HistoryItemDto[]> => {
    const response = await api.get("/texts/history", {params: request});
    return response.data;
  },
};
