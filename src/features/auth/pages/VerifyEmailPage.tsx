import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router";
import { Button, Spinner } from "@quickadui/core";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from "@quickadui/forms";
import { routes } from "@/app/routes/routes";
import { getErrorMessage } from "@/lib/errors";
import { CodeForm } from "../components/CodeForm";
import { LinkSent } from "../components/LinkSent";
import { useResendVerification, useVerifyEmail } from "../hooks/useAuth";
import { emailSchema, type EmailFormSchema } from "../schemas/loginSchema";
import type { VerificationMode } from "../types/User";

/**
 * `resend` : arrivée depuis la connexion (adresse non vérifiée), un nouveau code (ou lien) est envoyé.
 * `mode` : depuis l'inscription, code à saisir ou lien à cliquer (réglage de l'application).
 */
type VerifyEmailState = { email?: string; resend?: boolean; mode?: VerificationMode } | null;

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as VerifyEmailState;
  const [email, setEmail] = useState(state?.email ?? "");
  const [mode, setMode] = useState<VerificationMode>(state?.mode ?? "code");
  const [error, setError] = useState<string | null>(null);
  const [resendNotice, setResendNotice] = useState<string | null>(null);
  const { mutate: verifyEmail, isPending } = useVerifyEmail();
  const { mutate: resend, isPending: isResending } = useResendVerification();

  const sendCode = (address: string, notice = "Un nouveau code vous a été envoyé.") => {
    setError(null);
    setResendNotice(null);
    resend(address, {
      onSuccess: (sentMode) => {
        setMode(sentMode);
        setResendNotice(sentMode === "link" ? "Un nouveau lien vous a été envoyé." : notice);
      },
      onError: (err) => setError(getErrorMessage(err)),
    });
  };

  // Depuis la connexion, l'ancien code a pu expirer : on en envoie un nouveau (une seule fois)
  const resentOnArrival = useRef(false);
  useEffect(() => {
    if (state?.resend && state.email && !resentOnArrival.current) {
      resentOnArrival.current = true;
      sendCode(state.email, "Un code de vérification vous a été envoyé.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- uniquement à l'arrivée sur la page
  }, []);

  const emailForm = useForm<EmailFormSchema>({ resolver: zodResolver(emailSchema), defaultValues: { email: "" } });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-neutral-12">Vérifiez votre adresse email</h1>
        <p className="text-sm text-neutral-11">
          {!email ? (
            "Indiquez l'adresse de votre compte pour recevoir un code ou un lien de vérification."
          ) : mode === "link" ? (
            "Dernière étape avant d'utiliser LinguaTrack."
          ) : (
            <>
              Saisissez le code envoyé à <span className="font-medium text-neutral-12">{email}</span>.
            </>
          )}
        </p>
      </div>

      {email && mode === "link" ? (
        <LinkSent
          onResend={() => sendCode(email)}
          isResending={isResending}
          resendNotice={resendNotice}
          error={error}
        >
          Nous avons envoyé un lien de confirmation à <span className="font-medium">{email}</span>. Cliquez dessus
          pour activer votre compte, puis connectez-vous.
        </LinkSent>
      ) : email ? (
        <CodeForm
          submitLabel="Vérifier mon adresse"
          pendingLabel="Vérification…"
          isPending={isPending}
          error={error}
          resendNotice={resendNotice}
          onSubmit={(code) => {
            setError(null);
            verifyEmail(
              { email, code },
              {
                // La vérification n'ouvre pas de session : on passe par la connexion
                onSuccess: () =>
                  navigate(routes.login, {
                    replace: true,
                    state: { email, message: "Adresse vérifiée. Vous pouvez vous connecter." },
                  }),
                onError: (err) => setError(getErrorMessage(err)),
              },
            );
          }}
          onResend={() => sendCode(email)}
          isResending={isResending}
        />
      ) : (
        <Form {...emailForm}>
          <form
            onSubmit={emailForm.handleSubmit(({ email: address }) => {
              setEmail(address);
              sendCode(address, "Un code de vérification vous a été envoyé.");
            })}
            noValidate
            className="flex flex-col gap-4"
          >
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Adresse email</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="email" state={fieldState.invalid ? "error" : "default"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="lg" disabled={isResending} className="w-full">
              {isResending && <Spinner size="sm" label="Envoi" />}
              Vérifier mon adresse
            </Button>
          </form>
        </Form>
      )}

      <p className="text-center text-sm text-neutral-11">
        <Link to={routes.login} className="font-medium text-neutral-12 underline-offset-4 hover:underline">
          Retour à la connexion
        </Link>
      </p>
    </div>
  );
}
