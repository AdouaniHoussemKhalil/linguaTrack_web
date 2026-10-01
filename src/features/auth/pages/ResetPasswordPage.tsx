import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Alert, AlertDescription, Button } from "@quickadui/core";
import { routes } from "@/app/routes/routes";
import { getErrorCode, getErrorMessage } from "@/lib/errors";
import { NewPasswordForm } from "../components/NewPasswordForm";
import { useResetPassword } from "../hooks/useAuth";

// Jeton absent de la base : lien expiré, déjà utilisé, ou remplacé par une demande plus récente.
const UNUSABLE_LINK_CODES = new Set(["invalidCode", "expiredCode", "noPendingCode"]);

const UnusableLink = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-4">
    <Alert variant="danger">
      <AlertDescription>{children}</AlertDescription>
    </Alert>
    <Button asChild size="lg" className="w-full">
      <Link to={routes.forgotPassword}>Demander un nouveau lien</Link>
    </Button>
  </div>
);

/**
 * Page de réinitialisation ouverte par le lien reçu par e-mail (`resetPasswordUrl` de l'application) :
 * `?token=…&email=…`. Le jeton, à usage unique, est envoyé avec le nouveau mot de passe.
 */
export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Lus une seule fois : le jeton est ensuite retiré de la barre d'adresse et de l'historique.
  const [{ token, email }] = useState(() => ({
    token: searchParams.get("token") ?? "",
    email: searchParams.get("email") ?? "",
  }));
  const [error, setError] = useState<{ message: string; unusableLink: boolean } | null>(null);
  const { mutate: resetPassword, isPending } = useResetPassword();

  useEffect(() => {
    if (token) window.history.replaceState(window.history.state, "", routes.resetPassword);
  }, [token]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-neutral-12">Nouveau mot de passe</h1>
        <p className="text-sm text-neutral-11">
          {email ? (
            <>
              Choisissez le nouveau mot de passe du compte <span className="font-medium text-neutral-12">{email}</span>.
            </>
          ) : (
            "Choisissez votre nouveau mot de passe."
          )}
        </p>
      </div>

      {!token || !email ? (
        <UnusableLink>Ce lien de réinitialisation est incomplet. Demandez-en un nouveau.</UnusableLink>
      ) : error?.unusableLink ? (
        <UnusableLink>{error.message}</UnusableLink>
      ) : (
        <NewPasswordForm
          email={email}
          isPending={isPending}
          error={error?.message}
          onSubmit={({ password, confirmPassword }) => {
            setError(null);
            resetPassword(
              { email, resetToken: token, password, confirmPassword },
              {
                onSuccess: () =>
                  navigate(routes.login, {
                    replace: true,
                    state: { email, message: "Mot de passe modifié. Connectez-vous avec le nouveau." },
                  }),
                onError: (err) => {
                  const unusableLink = UNUSABLE_LINK_CODES.has(getErrorCode(err) ?? "");
                  setError({
                    unusableLink,
                    message: unusableLink
                      ? "Ce lien a expiré ou a déjà été utilisé. Demandez-en un nouveau."
                      : getErrorMessage(err),
                  });
                },
              },
            );
          }}
        />
      )}

      <p className="text-center text-sm text-neutral-11">
        <Link to={routes.login} className="font-medium text-neutral-12 underline-offset-4 hover:underline">
          Retour à la connexion
        </Link>
      </p>
    </div>
  );
}
