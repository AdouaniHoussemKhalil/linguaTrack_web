/** Jeton JWT factice (signature non vérifiée côté front) pour les tests. */
export const fakeJwt = (payload: Record<string, unknown>): string => {
  const encode = (value: object) => btoa(JSON.stringify(value)).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
  return `${encode({ alg: "HS256", typ: "JWT" })}.${encode(payload)}.signature`;
};

export const inSeconds = (seconds: number) => Math.floor(Date.now() / 1000) + seconds;
