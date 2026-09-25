const TOKEN_KEY = "token";
const USER_ID_KEY = "userId";

/** Vrai si le JWT est lisible et non expiré (sans vérifier la signature : c'est le rôle de l'API). */
const isTokenUsable = (token: string): boolean => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return false;
    const { exp } = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as { exp?: number };
    return typeof exp !== "number" || exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);

export const getUserId = (): string | null => localStorage.getItem(USER_ID_KEY);

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
