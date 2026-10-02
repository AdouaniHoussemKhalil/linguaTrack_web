import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HistoryService } from "@/features/history/services/HistoryService";
import type { GetHistoryRequest, HistoryPageDto } from "@/features/history/types/History";

export const useHistory = (request: GetHistoryRequest) =>
  useQuery<HistoryPageDto>({
    queryKey: ["history", request],
    queryFn: () => HistoryService.getHistory(request),
    // Garde la page affichée pendant le chargement de la suivante (pas de clignotement)
    placeholderData: keepPreviousData,
    retry: false,
  });

export const useDeleteText = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: HistoryService.deleteText,
    onSuccess: (_data, id) => {
      // Tout ce qui dépend des textes de l'utilisateur doit être recalculé
      for (const key of [["history"], ["stats"], ["progress"]]) queryClient.invalidateQueries({ queryKey: key });
      queryClient.removeQueries({ queryKey: ["texts", "detail", id] });
    },
  });
};
