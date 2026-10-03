import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "@/lib/axios";
import { HistoryService } from "./HistoryService";

vi.mock("@/lib/axios", () => ({ default: { get: vi.fn(), delete: vi.fn() } }));

const get = vi.mocked(api.get);
const request = { period: "all", page: 1, page_size: 10 } as Parameters<typeof HistoryService.getHistory>[0];

beforeEach(() => vi.clearAllMocks());

describe("HistoryService.getHistory", () => {
  it("renvoie la page d'historique de l'API", async () => {
    const page = { items: [], total: 0, page: 1, page_size: 10, pages: 0 };
    get.mockResolvedValue({ data: page });

    await expect(HistoryService.getHistory(request)).resolves.toEqual(page);
    expect(get).toHaveBeenCalledWith("/texts", { params: request });
  });

  it("refuse une réponse sans liste (page HTML renvoyée par un proxy mal configuré)", async () => {
    get.mockResolvedValue({ data: "<!doctype html><html>…</html>" });

    await expect(HistoryService.getHistory(request)).rejects.toThrow("Réponse inattendue du serveur");
  });
});
