import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { Alert, AlertDescription, Button, Spinner } from "@quickadui/core";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from "@quickadui/forms";
import { routes } from "@/app/routes/routes";
import { getErrorMessage } from "@/lib/errors";
import { CodeForm } from "../components/CodeForm";
import { LinkSent } from "../components/LinkSent";
import { NewPasswordForm } from "../components/NewPasswordForm";
import { useForgotPassword, useResetPassword, useVerifyResetCode } from "../hooks/useAuth";
import { emailSchema, type EmailFormSchema } from "../schemas/loginSchema";

/**
 * Étapes selon le réglage de l'application :
 * - code : email → code reçu → nouveau mot de passe (le code donne un `resetToken` à usage unique) ;
 * - lien : email → « lien envoyé » ; la page /reset-password ouverte par le lien fait le reste.
 */
type Step =
  | { name: "email" }
  | { name: "code"; email: string }
  | { name: "link"; email: string }
  | { name: "password"; email: string; resetToken: string };

const SUBTITLES: Record<Step["name"], string> = {
  email: "Indiquez l'adresse de votre compte : nous vous enverrons de quoi choisir un nouveau mot de passe.",
  code: "Si un compte existe pour cette adresse, un code vient de lui être envoyé.",
  link: "Consultez votre boîte de réception.",
  password: "Choisissez votre nouveau mot de passe.",
};

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>({ name: "email" });
  const [error, setError] = useState<string | null>(null);
  const [resendNotice, setResendNotice] = useState<string | null>(null);
  const { mutate: sendRequest, isPending: isSending } = useForgotPassword();
  const { mutate: verifyCode, isPending: isVerifying } = useVerifyResetCode();
  const { mutate: resetPassword, isPending: isResetting } = useResetPassword();

  const emailForm = useForm<EmailFormSchema>({ resolver: zodResolver(emailSchema), defaultValues: { email: "" } });
  const showError = (err: unknown) => setError(getErrorMessage(err));

  const onEmailSubmit = emailForm.handleSubmit(({ email }) => {
    setError(null);
    sendRequest(email, {
      onSuccess: (mode) => setStep(mode === "link" ? { name: "link", email } : { name: "code", email }),
      onError: showError,
    });
  });

  const resend = (email: string) => {
    setError(null);
    setResendNotice(null);
    sendRequest(email, {
      onSuccess: (mode) =>
        setResendNotice(mode === "link" ? "Un nouveau lien vous a été envoyé." : "Un nouveau code vous a été envoyé."),
      onError: showError,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-neutral-12">Mot de passe oublié</h1>
        <p className="text-sm text-neutral-11">{SUBTITLES[step.name]}</p>
      </div>

      {step.name === "email" && (
        <Form {...emailForm}>
          <form onSubmit={onEmailSubmit} noValidate className="flex flex-col gap-4">
            <FormField
              control={emailForm.control}
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
            {error && (
              <Alert variant="danger">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" size="lg" disabled={isSending} className="w-full">
              {isSending && <Spinner size="sm" label="Envoi" />}
              Continuer
            </Button>
          </form>
        </Form>
      )}

      {step.name === "link" && (
        <LinkSent onResend={() => resend(step.email)} isResending={isSending} resendNotice={resendNotice} error={error}>
          Si un compte existe pour <span className="font-medium">{step.email}</span>, un lien pour choisir un nouveau
          mot de passe vient de lui être envoyé. Il est valable quelques minutes.
        </LinkSent>
      )}

      {step.name === "code" && (
        <CodeForm
          submitLabel="Continuer"
          pendingLabel="Vérification…"
          isPending={isVerifying}
          error={error}
          resendNotice={resendNotice}
          onSubmit={(resetCode) => {
            setError(null);
            verifyCode(
              { email: step.email, resetCode },
              { onSuccess: (resetToken) => setStep({ name: "password", email: step.email, resetToken }), onError: showError },
            );
          }}
          onResend={() => resend(step.email)}
          isResending={isSending}
        />
      )}

      {step.name === "password" && (
        <NewPasswordForm
          email={step.email}
          isPending={isResetting}
          error={error}
          onSubmit={({ password, confirmPassword }) => {
            setError(null);
            resetPassword(
              { email: step.email, resetToken: step.resetToken, password, confirmPassword },
              {
                onSuccess: () =>
                  navigate(routes.login, {
                    replace: true,
                    state: { email: step.email, message: "Mot de passe modifié. Connectez-vous avec le nouveau." },
                  }),
                onError: showError,
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
