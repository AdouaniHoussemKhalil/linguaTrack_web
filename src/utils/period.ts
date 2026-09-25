/** Périodes acceptées par l'API (`?period=` sur /texts/history et /texts/dashboard). */
export type Period = "all" | "day" | "week" | "month" | "year";

export const periods: { value: Period; label: string }[] = [
  { value: "all", label: "Tout" },
  { value: "day", label: "24 h" },
  { value: "week", label: "7 jours" },
  { value: "month", label: "30 jours" },
  { value: "year", label: "12 mois" },
];

/** Lit une période depuis l'URL ; « all » si absente ou invalide. */
export const parsePeriod = (value: string | null): Period =>
  periods.some((period) => period.value === value) ? (value as Period) : "all";
