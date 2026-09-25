import api from "@/lib/axios"
import type { GetStatsModel, GetStatsDto } from "../types/Stats";

export const DashboardService = {
    getStats: async (request: GetStatsModel): Promise<GetStatsDto> => {
        const response = await api.get('/texts/dashboard', { params: request });
        const data = response.data;
        return data;
    }
}