import { isAxiosError } from "axios";

/** Message lisible (en français) pour une erreur d'appel API, à afficher à l'utilisateur. */
export const getErrorMessage = (error: unknown, fallback = "Réessayez dans quelques instants."): string => {
  if (isAxiosError(error)) {
    const detail = (error.response?.data as { detail?: unknown } | undefined)?.detail;
    if (typeof detail === "string" && detail.trim()) return detail;
    if (error.code === "ECONNABORTED") return "Le serveur a mis trop de temps à répondre. Réessayez avec un texte plus court.";
    if (!error.response) return "Impossible de joindre le serveur. Vérifiez votre connexion.";
  }
  return fallback;
};
