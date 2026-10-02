import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { passwordRules } from "../schemas/registerSchema";
import PasswordStrength from "./PasswordStrength";

describe("PasswordStrength", () => {
  it("indique « Fort » quand toutes les règles sont respectées", () => {
    render(<PasswordStrength value="Abcdef1!" rules={passwordRules} />);
    expect(screen.getByText("Fort")).toBeInTheDocument();
    expect(screen.getAllByText(/: respectée/)).toHaveLength(passwordRules.length);
  });

  it("liste en français les règles non respectées", () => {
    render(<PasswordStrength value="abc" rules={passwordRules} />);
    expect(screen.getByText("Au moins 8 caractères")).toBeInTheDocument();
    expect(screen.getAllByText(/non respectée/).length).toBeGreaterThan(0);
  });
});
