import { useEffect, useRef, useState } from "react";
import { useTheme } from "@quickadui/theme";
import { getErrorMessage } from "@/lib/errors";
import { useGoogleSignIn } from "../hooks/useAuth";
import type { LoginResponse } from "../types/User";
import { emailFromCredential, googleClientId, loadGoogleScript } from "../utils/google";

interface GoogleButtonProps {
  /** Session ouverte, ou MFA requise (`email` du compte Google pour la seconde étape). */
  onResult: (result: LoginResponse, email: string) => void;
  onError: (message: string) => void;
}

export const GoogleButton = ({ onResult, onError }: GoogleButtonProps) => {
  const container = useRef<HTMLDivElement>(null);
  const [unavailable, setUnavailable] = useState(false);
  const { mutate: signInWithGoogle } = useGoogleSignIn();
  const { resolvedTheme } = useTheme();

  // Rappels à jour sans réinitialiser Google à chaque rendu
  const handlers = useRef({ onResult, onError });
  useEffect(() => {
    handlers.current = { onResult, onError };
  });

  useEffect(() => {
    const clientId = googleClientId;
    if (!clientId) return;
    let cancelled = false;

    loadGoogleScript()
      .then(() => {
        const google = window.google?.accounts.id;
        if (cancelled || !google || !container.current) return;
        google.initialize({
          client_id: clientId,
          // Google renvoie un ID token : l'API l'échange contre une session (cookies)
          callback: ({ credential }) =>
            signInWithGoogle(credential, {
              onSuccess: (result) => handlers.current.onResult(result, emailFromCredential(credential)),
              onError: (error) => handlers.current.onError(getErrorMessage(error, "Connexion avec Google impossible.")),
            }),
        });
        google.renderButton(container.current, {
          theme: resolvedTheme === "dark" ? "filled_black" : "outline",
          text: "continue_with",
          size: "large",
          shape: "rectangular",
          locale: "fr",
          width: container.current.offsetWidth || 320,
        });
      })
      .catch(() => !cancelled && setUnavailable(true));

    return () => {
      cancelled = true;
    };
  }, [signInWithGoogle, resolvedTheme]);

  if (!googleClientId || unavailable) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 text-xs text-neutral-11" aria-hidden>
        <span className="h-px flex-1 bg-neutral-6" />
        ou
        <span className="h-px flex-1 bg-neutral-6" />
      </div>
      {/* min-h : évite le saut de mise en page pendant le chargement du bouton Google */}
      <div ref={container} className="flex min-h-11 w-full justify-center" />
    </div>
  );
};
