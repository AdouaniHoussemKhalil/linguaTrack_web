import axios from "axios";

/** Pages accessibles sans session : un 401 n'y déclenche pas de redirection. */
const PUBLIC_PATHS = ["/login", "/register", "/verify-email", "/forgot-password"];

const api = axios.create({
  // Même origine par défaut (proxy Vite en dev, reverse proxy en production) : la session vit
  // dans des cookies httpOnly posés par l'API, le front ne manipule aucun token.
  baseURL: import.meta.env.VITE_API_URL || "",
  withCredentials: true,
  // L'analyse d'un texte appelle le LLM (Mistral) : 10 s ne suffisaient pas
  timeout: 60_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Session expirée (l'API a déjà tenté de la renouveler) : retour à la connexion.
// Les routes /auth/* (identifiants invalides…) et /users/me (géré par ProtectedRoute) sont exclues.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? "";
    if (
      error.response?.status === 401 &&
      !url.startsWith("/auth/") &&
      url !== "/users/me" &&
      !PUBLIC_PATHS.includes(window.location.pathname)
    ) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
