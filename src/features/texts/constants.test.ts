import { describe, expect, it } from "vitest";
import { analyzeSchema, MAX_TEXT_LENGTH } from "./schemas";
import { getModeLabel, scoreVariant } from "./constants";

describe("texts", () => {
  it("traduit les modes et garde une valeur inconnue", () => {
    expect(getModeLabel("professional")).toBe("Professionnel");
    expect(getModeLabel("autre")).toBe("autre");
    expect(getModeLabel(null)).toBe("");
  });

  it("colore le score par palier", () => {
    expect(scoreVariant(95)).toBe("success");
    expect(scoreVariant(60)).toBe("warning");
    expect(scoreVariant(20)).toBe("danger");
    expect(scoreVariant(null)).toBe("outline");
  });

  it("refuse un texte vide ou trop long", () => {
    expect(analyzeSchema.safeParse({ text: "   ", mode: "correction" }).success).toBe(false);
    expect(analyzeSchema.safeParse({ text: "a".repeat(MAX_TEXT_LENGTH + 1), mode: "correction" }).success).toBe(false);
    expect(analyzeSchema.safeParse({ text: "Bonjour.", mode: "simple" }).success).toBe(true);
  });
});
