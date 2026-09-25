import type { TextMode } from "./types/text";

export const textModes: { value: TextMode; label: string; description: string }[] = [
  { value: "correction", label: "Correction", description: "Corrige les fautes sans changer le style" },
  { value: "professional", label: "Professionnel", description: "Ton soutenu, adapté au travail" },
  { value: "simple", label: "Simple", description: "Phrases courtes et claires" },
  { value: "natural", label: "Naturel", description: "Formulation fluide et courante" },
  { value: "persuasive", label: "Persuasif", description: "Argumentation plus convaincante" },
];

/** Libellé français d'un mode renvoyé par l'API (valeur brute si inconnue). */
export const getModeLabel = (mode: string | null | undefined): string =>
  textModes.find((item) => item.value === mode)?.label ?? mode ?? "";

export const severityDisplay: Record<string, { label: string; variant: "soft" | "warning" | "danger" }> = {
  low: { label: "Mineure", variant: "soft" },
  medium: { label: "Modérée", variant: "warning" },
  high: { label: "Majeure", variant: "danger" },
};

/** Variante de Badge selon le score /100. */
export const scoreVariant = (score: number | null | undefined): "success" | "warning" | "danger" | "outline" => {
  if (score === null || score === undefined) return "outline";
  return score >= 80 ? "success" : score >= 50 ? "warning" : "danger";
};
