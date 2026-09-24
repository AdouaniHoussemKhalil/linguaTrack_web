import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TextsService } from "@/features/texts/services/TextsService";
import type { AnalyseTextResult, TextAnalyzeRequest } from "@/features/texts/types/text";

export const useTexts = () => {
  const queryClient = useQueryClient();

  return useMutation<AnalyseTextResult, Error, TextAnalyzeRequest>({
    mutationFn: (request) => TextsService.analyse(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["texts"] });
    },
  });
};
