import { describe, expect, it } from "vitest";
import { parsePeriod } from "./period";

describe("parsePeriod", () => {
  it("accepte les périodes de l'API et replie sur « all »", () => {
    expect(parsePeriod("week")).toBe("week");
    expect(parsePeriod(null)).toBe("all");
    expect(parsePeriod("decade")).toBe("all");
  });
});
