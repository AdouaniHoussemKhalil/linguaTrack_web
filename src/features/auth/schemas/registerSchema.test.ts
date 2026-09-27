import { describe, expect, it } from "vitest";
import { registerSchema } from "./registerSchema";

const valid = { firstName: "Ana", lastName: "Lima", email: "ana@exemple.com", level: "B1", password: "Abcdef12", confirmPassword: "Abcdef12" };

describe("registerSchema", () => {
  it("accepte une inscription valide", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it.each([
    ["Abc12", "au moins 8 caractères"],
    ["abcdefgh1", "une lettre majuscule"],
    ["ABCDEFGH1", "une lettre minuscule"],
    ["Abcdefghi", "un chiffre"],
  ])("refuse le mot de passe %s (%s)", (password, rule) => {
    const result = registerSchema.safeParse({ ...valid, password, confirmPassword: password });
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error?.issues)).toContain(rule);
  });

  it("exige une confirmation identique", () => {
    const result = registerSchema.safeParse({ ...valid, confirmPassword: "Autre1234" });
    expect(result.error?.issues[0].path).toEqual(["confirmPassword"]);
  });
});
