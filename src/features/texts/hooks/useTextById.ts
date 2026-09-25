import { useQuery } from "@tanstack/react-query";
import { TextsService } from "@/features/texts/services/TextsService";
import type { AnalyseTextResult } from "@/features/texts/types/text";
import type { UseQueryResult } from "@tanstack/react-query";

export const useTextById = (id?: string, userId?: string): UseQueryResult<AnalyseTextResult, Error> => {
  return useQuery<AnalyseTextResult, Error, AnalyseTextResult, readonly ["texts", "detail", string | undefined, string | undefined]>({
    queryKey: ["texts", "detail", id, userId],
    queryFn: () => TextsService.getById(id as string, userId as string),
    enabled: Boolean(id && userId && userId),
    retry: false,
  });
};
