import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScoreRing } from "./ScoreRing";

describe("ScoreRing", () => {
  it("annonce le score arrondi aux lecteurs d'écran", () => {
    render(<ScoreRing score={82.4} />);
    expect(screen.getByRole("img", { name: "Score : 82 sur 100" })).toBeInTheDocument();
    expect(screen.getByText("82")).toBeInTheDocument();
  });

  it("affiche « – » sans score", () => {
    render(<ScoreRing score={null} />);
    expect(screen.getByRole("img", { name: "Score indisponible" })).toBeInTheDocument();
    expect(screen.getByText("–")).toBeInTheDocument();
  });
});
