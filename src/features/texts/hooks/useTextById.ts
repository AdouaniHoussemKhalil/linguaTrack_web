import { useQuery } from "@tanstack/react-query";
import { TextsService } from "@/features/texts/services/TextsService";
import type { AnalyseTextResult } from "@/features/texts/types/text";

export const useTextById = (id?: string) =>
  useQuery<AnalyseTextResult, Error>({
    queryKey: ["texts", "detail", id],
    queryFn: () => TextsService.getById(id as string),
    enabled: Boolean(id),
    retry: false,
  });
