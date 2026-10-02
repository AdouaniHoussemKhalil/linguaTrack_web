import { AxiosError, AxiosHeaders } from "axios";
import { describe, expect, it } from "vitest";
import { getErrorCode, getErrorMessage } from "./errors";

const withResponse = (status: number, data: unknown) =>
  new AxiosError("Request failed", "ERR_BAD_RESPONSE", undefined, undefined, {
    status, data, statusText: "", headers: {}, config: { headers: new AxiosHeaders() },
  });

describe("getErrorMessage", () => {
  it("reprend le detail renvoyé par l'API", () => {
    expect(getErrorMessage(withResponse(502, { detail: "Le service d'analyse est indisponible." }))).toBe(
      "Le service d'analyse est indisponible.",
    );
  });

  it("explique un délai dépassé et une absence de réseau", () => {
    expect(getErrorMessage(new AxiosError("timeout", "ECONNABORTED"))).toMatch(/trop de temps/);
    expect(getErrorMessage(new AxiosError("Network Error", "ERR_NETWORK"))).toMatch(/joindre le serveur/);
  });

  it("ne montre jamais le message technique d'axios", () => {
    expect(getErrorMessage(withResponse(500, { detail: [{ msg: "x" }] }))).toBe("Réessayez dans quelques instants.");
    expect(getErrorMessage(new Error("boom"), "Message par défaut")).toBe("Message par défaut");
  });

  it("traduit les codes du service d'authentification", () => {
    const error = withResponse(401, { error: { status: 401, code: "invalidCredentials", message: "Invalid credentials" } });
    expect(getErrorCode(error)).toBe("invalidCredentials");
    expect(getErrorMessage(error)).toBe("Email ou mot de passe incorrect.");
  });

  it("garde le message par défaut pour un code inconnu", () => {
    expect(getErrorMessage(withResponse(400, { error: { code: "unknownCode", message: "Boom" } }))).toBe(
      "Réessayez dans quelques instants.",
    );
  });
});
