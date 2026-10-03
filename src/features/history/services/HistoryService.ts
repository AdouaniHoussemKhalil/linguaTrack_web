import api from "@/lib/axios";
import type { GetHistoryRequest, HistoryPageDto } from "../types/History";

export const HistoryService = {
  getHistory: async (request: GetHistoryRequest): Promise<HistoryPageDto> => {
    const response = await api.get("/texts", { params: request });
    // Une réponse sans liste (page HTML d'un proxy mal configuré…) ferait planter la page : erreur explicite.
    if (!Array.isArray(response.data?.items)) throw new Error("Réponse inattendue du serveur pour l'historique.");
    return response.data;
  },
  deleteText: async (id: string): Promise<void> => {
    await api.delete(`/texts/${id}`);
  },
};
