const TOKEN_KEY = "token";
const USER_ID_KEY = "userId";

type TokenPayload = { exp?: number; sub?: string };

/** Contenu du JWT (sans vérifier la signature : c'est le rôle de l'API) ; null s'il est illisible. */
const readPayload = (token: string): TokenPayload | null => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as TokenPayload;
  } catch {
    return null;
  }
};

/** Vrai si le JWT est lisible et non expiré. */
const isTokenUsable = (token: string): boolean => {
  const payload = readPayload(token);
  return payload !== null && (typeof payload.exp !== "number" || payload.exp * 1000 > Date.now());
};

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);

/**
 * Identifiant de l'utilisateur connecté. Repli sur le `sub` du JWT : les comptes créés
 * avant que l'inscription n'enregistre `userId` ont un token mais pas d'identifiant stocké.
 */
export const getUserId = (): string | null => {
  const stored = localStorage.getItem(USER_ID_KEY);
  if (stored) return stored;
  const token = getToken();
  return (token && readPayload(token)?.sub) || null;
};

export const saveSession = (token: string, userId: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_ID_KEY, userId);
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
};

/** Session valide ; un token expiré ou illisible est supprimé au passage. */
export const hasValidSession = (): boolean => {
  const token = getToken();
  if (token && isTokenUsable(token)) return true;
  clearSession();
  return false;
};
