import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
import tsconfigPaths from "vite-tsconfig-paths"

// L'API (FastAPI) est servie sous la même origine que le front : les cookies de session
// (httpOnly, posés par l'API) et les appels passent sans CORS. En production, servir front et
// API sur le même domaine (reverse proxy) avec ces mêmes préfixes.
const apiTarget = process.env.API_PROXY_TARGET || "http://localhost:8000";
const apiProxy = Object.fromEntries(["/auth", "/users", "/texts", "/health"].map((prefix) => [prefix, apiTarget]));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  server: {
    host: true,
    port: 5173,
    proxy: apiProxy,
    watch: {
      usePolling: true
    }
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
  },
})
