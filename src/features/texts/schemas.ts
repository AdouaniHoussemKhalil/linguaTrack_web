import { z } from "zod";

export const MAX_TEXT_LENGTH = 5000;

export const analyzeSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Veuillez saisir un texte à analyser")
    .max(MAX_TEXT_LENGTH, `Le texte ne doit pas dépasser ${MAX_TEXT_LENGTH} caractères`),
  mode: z.enum(["correction", "professional", "simple", "natural", "persuasive"]),
});

export type AnalyzeFormSchema = z.infer<typeof analyzeSchema>;
