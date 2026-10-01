/** Google Identity Services : chargement du script et lecture de l'ID token. */

const GOOGLE_SCRIPT = "https://accounts.google.com/gsi/client";

export interface GoogleIdentity {
  initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void;
  renderButton: (parent: HTMLElement, options: Record<string, string | number>) => void;
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleIdentity } };
  }
}

/** Client ID OAuth Google (public) ; absent : le bouton n'est pas affiché. */
export const googleClientId: string | undefined = import.meta.env.VITE_GOOGLE_CLIENT_ID || undefined;

let scriptPromise: Promise<void> | null = null;
export const loadGoogleScript = () => {
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = GOOGLE_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Google Identity Services indisponible"));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
};

/** Email du compte Google, lu dans l'ID token : nécessaire à l'étape MFA. */
export const emailFromCredential = (credential: string): string => {
  const payload = credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(atob(payload)).email;
};
