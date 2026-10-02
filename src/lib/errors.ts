import { isAxiosError } from "axios";

/** Codes d'erreur du service d'authentification (relayés par l'API sous `error.code`). */
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  invalidCredentials: "Email ou mot de passe incorrect.",
  emailNotVerified: "Votre adresse email n'est pas encore vérifiée.",
  UserBlocked: "Ce compte est bloqué. Contactez le support.",
  useGoogleSignIn:
    "Ce compte utilise la connexion Google : choisissez « Continuer avec Google », ou définissez un mot de passe avec « Mot de passe oublié ».",
  invalidCode: "Code incorrect.",
  expiredCode: "Ce code a expiré. Demandez-en un nouveau.",
  noPendingCode: "Aucun code en attente. Demandez-en un nouveau.",
  invalidMfaVerification: "Code incorrect ou expiré. Demandez-en un nouveau.",
  currentPasswordNotCorrect: "Mot de passe actuel incorrect.",
  passwordsDoNotMatch: "Les mots de passe ne correspondent pas.",
  userAlreadyExists: "Un compte existe déjà avec cette adresse email.",
  validationError: "Certaines informations sont invalides. Vérifiez le formulaire.",
  tooManyRequests: "Trop de tentatives. Patientez quelques minutes avant de réessayer.",
  invalidRefreshToken: "Votre session a expiré. Reconnectez-vous.",
  invalidAppClient: "Le service de connexion est mal configuré. Réessayez plus tard.",
  googleSignInDisabled: "La connexion avec Google n'est pas disponible.",
  invalidGoogleToken: "La connexion avec Google a échoué. Réessayez.",
  googleEmailNotVerified: "Votre adresse Google n'est pas vérifiée.",
  authUnavailable: "Le service de connexion est indisponible. Réessayez dans un instant.",
};

type ApiErrorBody = { detail?: unknown; error?: { code?: unknown } };

/** Code d'erreur du service d'authentification (`invalidCredentials`…), s'il y en a un. */
export const getErrorCode = (error: unknown): string | undefined => {
  if (!isAxiosError(error)) return undefined;
  const code = (error.response?.data as ApiErrorBody | undefined)?.error?.code;
  return typeof code === "string" ? code : undefined;
};

/** Message lisible (en français) pour une erreur d'appel API, à afficher à l'utilisateur. */
export const getErrorMessage = (error: unknown, fallback = "Réessayez dans quelques instants."): string => {
  if (isAxiosError(error)) {
    const code = getErrorCode(error);
    if (code && AUTH_ERROR_MESSAGES[code]) return AUTH_ERROR_MESSAGES[code];
    const detail = (error.response?.data as ApiErrorBody | undefined)?.detail;
    if (typeof detail === "string" && detail.trim()) return detail;
    if (error.code === "ECONNABORTED") return "Le serveur a mis trop de temps à répondre. Réessayez dans quelques instants ou avec un texte plus court.";
    if (!error.response) return "Impossible de joindre le serveur. Vérifiez votre connexion.";
  }
  return fallback;
};
