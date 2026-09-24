import { useQuery } from "@tanstack/react-query";
import { HistoryService } from "@/features/history/services/HistoryService";
import type {
  GetHistoryRequest,
  HistoryItemDto,
} from "@/features/history/types/History";
import type { UseQueryResult } from "@tanstack/react-query";

export const defaultRequest: GetHistoryRequest = {
  period: "all",
};

export const useHistory = (
  request: GetHistoryRequest,
): UseQueryResult<HistoryItemDto[]> => {
  const req = request ?? defaultRequest;
  return useQuery({
    queryKey: ["history", req],
    queryFn: () => HistoryService.getHistory(req),
    retry: false,
  });
};
