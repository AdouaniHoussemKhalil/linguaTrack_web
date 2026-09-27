import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import type { HistoryItemDto } from "../types/History";
import { HistoryTable } from "./HistoryTable";

const item: HistoryItemDto = {
  id: "texte-1", original_text: "Les enfants joue dans le jardin.", corrected_text: "Les enfants jouent dans le jardin.",
  mode: "correction", target_level: null, score: 80, processing_time: 3.2, created_at: "2026-09-25T10:00:00Z", errors: [],
};

const renderTable = (onDelete?: (item: HistoryItemDto) => void) =>
  render(<MemoryRouter><HistoryTable items={[item]} onDelete={onDelete} /></MemoryRouter>);

describe("HistoryTable", () => {
  it("ouvre le détail à l'adresse /correction/{id}", () => {
    renderTable();
    expect(screen.getByRole("link", { name: /Les enfants joue/ })).toHaveAttribute("href", "/correction/texte-1");
  });

  it("affiche le mode et le score", () => {
    renderTable();
    expect(screen.getByText("Correction")).toBeInTheDocument();
    expect(screen.getByText("80")).toBeInTheDocument();
  });

  it("demande la suppression du texte sans ouvrir son détail", async () => {
    const onDelete = vi.fn();
    renderTable(onDelete);
    await userEvent.click(screen.getByRole("button", { name: /Supprimer « Les enfants joue/ }));
    expect(onDelete).toHaveBeenCalledWith(item);
  });

  it("n'affiche pas de bouton de suppression sans action", () => {
    renderTable();
    expect(screen.queryByRole("button", { name: /Supprimer/ })).not.toBeInTheDocument();
  });
});
