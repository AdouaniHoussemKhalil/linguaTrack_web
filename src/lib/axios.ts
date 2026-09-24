import axios from "axios";

const api = axios.create({
  // L'API FastAPI tourne sur le port 8000 en local (voir CLAUDE.md)
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  // L'analyse d'un texte appelle le LLM (Mistral) : 10 s ne suffisaient pas
  timeout: 60_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Ajoute le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Session expirée : on nettoie le stockage et on renvoie vers la connexion
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== "/login") {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
