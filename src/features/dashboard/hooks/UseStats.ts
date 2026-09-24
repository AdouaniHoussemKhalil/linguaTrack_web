import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/features/dashboard/services/DashboardService";
import type {
  GetStatsModel,
  GetStatsDto,
} from "@/features/dashboard/types/Stats";

export const defaultRequest: GetStatsModel = {
  period: "all",
};

export const useGetStats = (
  request?: GetStatsModel
) => {
  const req = request ?? defaultRequest;

  return useQuery<GetStatsDto>({
    queryKey: ["stats", req],

    queryFn: () =>
      DashboardService.getStats(req),

    staleTime: 1000 * 60 * 5,
  });
};