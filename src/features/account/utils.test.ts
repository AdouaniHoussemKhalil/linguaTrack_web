import { describe, expect, it } from "vitest";
import { getFullName, getInitials } from "./utils";

describe("initiales et nom", () => {
  it("prend la première lettre du prénom et du nom", () => {
    expect(getInitials({ first_name: "houssem", last_name: "Adouani", email: "h@x.com" })).toBe("HA");
    expect(getFullName({ first_name: "Ana", last_name: "Lima" })).toBe("Ana Lima");
  });

  it("se replie sur l'email", () => {
    expect(getInitials({ first_name: " ", last_name: "", email: "zoe@x.com" })).toBe("Z");
  });
});
