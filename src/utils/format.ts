const dateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const numberFormatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });

/** « 24/09/2026 12:00 » ; chaîne vide si la date est absente ou invalide. */
export const formatDateTime = (value: string | null | undefined): string => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : dateTimeFormatter.format(date);
};

/** Nombre au format français, une décimale au plus (« 2,8 »). */
export const formatNumber = (value: number): string => numberFormatter.format(value);

/** Les `count` premiers mots de `text`, suivis de « … » s'il a été tronqué. */
export const truncateWords = (text: string, count = 12): string => {
  const words = text.trim().split(/\s+/);
  return words.length <= count ? text.trim() : `${words.slice(0, count).join(" ")}…`;
};

/** Variation en % signée pour une tendance (« +12,5 % »). */
export const formatChange = (value: number): string =>
  `${value > 0 ? "+" : ""}${numberFormatter.format(value)} %`;
