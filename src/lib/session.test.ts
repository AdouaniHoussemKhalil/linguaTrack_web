import { describe, expect, it } from "vitest";
import { fakeJwt, inSeconds } from "@/test/jwt";
import { clearSession, getUserId, hasValidSession, saveSession } from "./session";

describe("session", () => {
  it("accepte un token valide", () => {
    saveSession(fakeJwt({ sub: "u1", exp: inSeconds(3600) }), "u1");
    expect(hasValidSession()).toBe(true);
  });

  it("refuse et supprime un token expiré", () => {
    saveSession(fakeJwt({ sub: "u1", exp: inSeconds(-60) }), "u1");
    expect(hasValidSession()).toBe(false);
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("userId")).toBeNull();
  });

  it("refuse un token illisible", () => {
    localStorage.setItem("token", "pas-un-jwt");
    expect(hasValidSession()).toBe(false);
  });

  it("lit le userId stocké, sinon le sub du JWT (comptes antérieurs)", () => {
    saveSession(fakeJwt({ sub: "depuis-jwt", exp: inSeconds(3600) }), "stocke");
    expect(getUserId()).toBe("stocke");
    localStorage.removeItem("userId");
    expect(getUserId()).toBe("depuis-jwt");
    clearSession();
    expect(getUserId()).toBeNull();
  });
});
