import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation } from "react-router";
import { Alert, AlertDescription, Button, Spinner } from "@quickadui/core";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  PasswordInput,
} from "@quickadui/forms";
import { routes } from "@/app/routes/routes";
import { getErrorCode, getErrorMessage } from "@/lib/errors";
import { CodeForm } from "../components/CodeForm";
import { GoogleButton } from "../components/GoogleButton";
import { useCompleteSignIn, useMfaSignIn, useSignIn } from "../hooks/useAuth";
import { loginSchema, type LoginFormSchema } from "../schemas/loginSchema";
import type { LoginRequest, LoginResponse } from "../types/User";

/** Message et email transmis par les autres pages (adresse vérifiée, mot de passe réinitialisé…). */
type LoginLocationState = { message?: string; email?: string; mfaEmail?: string; from?: string } | null;

/** Seconde étape : code MFA envoyé par email. `credentials` absent (Google) : pas de renvoi possible. */
type MfaStep = { email: string; credentials?: LoginRequest };

const linkClass = "font-medium text-neutral-12 underline-offset-4 hover:underline";

export default function LoginPage() {
  const location = useLocation();
  const state = location.state as LoginLocationState;

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: state?.email ?? "", password: "" },
  });

  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | undefined>();
  // Connexion Google commencée sur la page d'inscription : le code MFA est déjà parti
  const [mfa, setMfa] = useState<MfaStep | null>(state?.mfaEmail ? { email: state.mfaEmail } : null);
  const [resendNotice, setResendNotice] = useState<string | null>(null);
  const { mutate: signIn, isPending } = useSignIn();
  const { mutate: signInWithMfa, isPending: isMfaPending } = useMfaSignIn();
  const completeSignIn = useCompleteSignIn();

  const showError = (err: unknown) => {
    setErrorCode(getErrorCode(err));
    setError(getErrorMessage(err, "Une erreur est survenue lors de la connexion."));
  };

  const handleResult = (result: LoginResponse, email: string, credentials?: LoginRequest) => {
    if (result.MFARequired) {
      setError(null);
      setMfa({ email, credentials });
    } else {
      completeSignIn();
    }
  };

  const onSubmit = form.handleSubmit((credentials) => {
    setError(null);
    signIn(credentials, {
      onSuccess: (result) => handleResult(result, credentials.email, credentials),
      onError: showError,
    });
  });

  if (mfa) {
    const { credentials } = mfa;
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-neutral-12">Vérification en deux étapes</h1>
          <p className="text-sm text-neutral-11">
            Un code de connexion vient d'être envoyé à <span className="font-medium text-neutral-12">{mfa.email}</span>.
          </p>
        </div>

        <CodeForm
          submitLabel="Valider"
          pendingLabel="Vérification…"
          isPending={isMfaPending}
          error={error}
          resendNotice={resendNotice}
          onSubmit={(mfaCode) => {
            setError(null);
            signInWithMfa({ email: mfa.email, mfaCode }, { onSuccess: completeSignIn, onError: showError });
          }}
          // Un nouveau code part en relançant la connexion
          onResend={
            credentials &&
            (() => {
              setError(null);
              setResendNotice(null);
              signIn(credentials, {
                onSuccess: () => setResendNotice("Un nouveau code vous a été envoyé."),
                onError: showError,
              });
            })
          }
          isResending={isPending}
        />

        <Button
          variant="ghost"
          onClick={() => {
            setMfa(null);
            setError(null);
            setResendNotice(null);
          }}
        >
          Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-neutral-12">Se connecter</h1>
        <p className="text-sm text-neutral-11">Heureux de vous revoir sur LinguaTrack.</p>
      </div>

      {state?.message && !error && (
        <Alert variant="success">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Adresse email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="vous@exemple.com"
                    state={fieldState.invalid ? "error" : "default"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <div className="flex items-center justify-between gap-2">
                  <FormLabel>Mot de passe</FormLabel>
                  <Link to={routes.forgotPassword} className="text-xs text-neutral-11 underline-offset-4 hover:underline">
                    Mot de passe oublié ?
                  </Link>
                </div>
                <FormControl>
                  <PasswordInput
                    autoComplete="current-password"
                    placeholder="Votre mot de passe"
                    state={fieldState.invalid ? "error" : "default"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <Alert variant="danger">
              <AlertDescription className="flex flex-col items-start gap-2">
                {error}
                {errorCode === "emailNotVerified" && (
                  <Link
                    to={routes.verifyEmail}
                    state={{ email: form.getValues("email"), resend: true }}
                    className={linkClass}
                  >
                    Vérifier mon adresse
                  </Link>
                )}
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" size="lg" disabled={isPending} className="mt-2 w-full">
            {isPending ? (
              <>
                <Spinner size="sm" label="Connexion en cours" />
                Connexion…
              </>
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>
      </Form>

      <GoogleButton
        onResult={(result, email) => handleResult(result, email)}
        onError={(message) => {
          setErrorCode(undefined);
          setError(message);
        }}
      />

      <p className="text-center text-sm text-neutral-11">
        Vous n'avez pas de compte ?{" "}
        <Link to={routes.register} className={linkClass}>
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
