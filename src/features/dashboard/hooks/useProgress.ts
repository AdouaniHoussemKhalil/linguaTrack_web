import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "../services/DashboardService";
import type { GetStatsModel, ProgressDto } from "../types/Stats";

export const useProgress = (request: GetStatsModel) =>
  useQuery<ProgressDto>({
    queryKey: ["progress", request],
    queryFn: () => DashboardService.getProgress(request),
    staleTime: 1000 * 60 * 5,
  });
