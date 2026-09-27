import { describe, expect, it } from "vitest";
import { formatChange, formatDateTime, formatNumber, truncateWords } from "./format";

describe("format", () => {
  it("formate les nombres et variations à la française", () => {
    expect(formatNumber(2.84)).toBe("2,8");
    expect(formatChange(12.5)).toBe("+12,5 %");
    expect(formatChange(-3)).toBe("-3 %");
  });

  it("gère les dates absentes ou invalides", () => {
    expect(formatDateTime(null)).toBe("");
    expect(formatDateTime("pas une date")).toBe("");
    expect(formatDateTime("2026-09-24T10:05:00Z")).toMatch(/24\/09\/2026/);
  });

  it("tronque au nombre de mots demandé", () => {
    expect(truncateWords("un deux trois", 5)).toBe("un deux trois");
    expect(truncateWords("un deux trois quatre", 2)).toBe("un deux…");
  });
});
