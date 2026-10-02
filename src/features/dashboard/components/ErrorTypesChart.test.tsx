import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ErrorTypesChart } from "./ErrorTypesChart";

describe("ErrorTypesChart", () => {
  it("liste les types du plus fréquent au moins fréquent, avec nombre et part", () => {
    render(<ErrorTypesChart counts={{ accord: 1, orthographe: 3 }} />);

    const rows = screen.getAllByRole("listitem");
    expect(rows.map((row) => row.getAttribute("aria-label"))).toEqual([
      "Orthographe : 3 erreurs (75 %)",
      "Accord : 1 erreur (25 %)",
    ]);
  });

  it("affiche un message quand il n'y a aucune erreur", () => {
    render(<ErrorTypesChart counts={{}} />);

    expect(screen.getByText("Aucune erreur sur cette période.")).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
});
