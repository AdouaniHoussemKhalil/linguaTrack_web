import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { saveSession } from "@/lib/session";
import { fakeJwt, inSeconds } from "@/test/jwt";
import type { HistoryItemDto } from "../types/History";
import { HistoryTable } from "./HistoryTable";

const item: HistoryItemDto = {
  id: "texte-1", original_text: "Les enfants joue dans le jardin.", corrected_text: "Les enfants jouent dans le jardin.",
  mode: "correction", target_level: null, score: 80, processing_time: 3.2, created_at: "2026-09-25T10:00:00Z", errors: [],
};

describe("HistoryTable", () => {
  it("ouvre le détail avec l'identifiant de la session (l'API ne renvoie pas user_id)", () => {
    saveSession(fakeJwt({ sub: "user-1", exp: inSeconds(3600) }), "user-1");
    render(<MemoryRouter><HistoryTable items={[item]} /></MemoryRouter>);
    expect(screen.getByRole("link", { name: /Les enfants joue/ })).toHaveAttribute("href", "/correction/texte-1/user-1");
  });

  it("affiche le mode et le score", () => {
    saveSession(fakeJwt({ sub: "user-1", exp: inSeconds(3600) }), "user-1");
    render(<MemoryRouter><HistoryTable items={[item]} /></MemoryRouter>);
    expect(screen.getByText("Correction")).toBeInTheDocument();
    expect(screen.getByText("80")).toBeInTheDocument();
  });
});
