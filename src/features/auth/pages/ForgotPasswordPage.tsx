import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { Alert, AlertDescription, Button, Spinner } from "@quickadui/core";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, PasswordInput } from "@quickadui/forms";
import { routes } from "@/app/routes/routes";
import { getErrorMessage } from "@/lib/errors";
import { CodeForm } from "../components/CodeForm";
import PasswordStrength from "../components/PasswordStrength";
import { useForgotPassword, useResetPassword, useVerifyResetCode } from "../hooks/useAuth";
import { emailSchema, type EmailFormSchema } from "../schemas/loginSchema";
import { newPasswordSchema, passwordRules, type NewPasswordFormSchema } from "../schemas/registerSchema";

/** Étapes : email → code reçu → nouveau mot de passe (le code donne un `resetToken` à usage unique). */
type Step = { name: "email" } | { name: "code"; email: string } | { name: "password"; email: string; resetToken: string };

const SUBTITLES: Record<Step["name"], string> = {
  email: "Indiquez l'adresse de votre compte : nous vous enverrons un code.",
  code: "Si un compte existe pour cette adresse, un code vient de lui être envoyé.",
  password: "Choisissez votre nouveau mot de passe.",
};

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>({ name: "email" });
  const [error, setError] = useState<string | null>(null);
  const [resendNotice, setResendNotice] = useState<string | null>(null);
  const { mutate: sendCode, isPending: isSending } = useForgotPassword();
  const { mutate: verifyCode, isPending: isVerifying } = useVerifyResetCode();
  const { mutate: resetPassword, isPending: isResetting } = useResetPassword();

  const emailForm = useForm<EmailFormSchema>({ resolver: zodResolver(emailSchema), defaultValues: { email: "" } });
  const passwordForm = useForm<NewPasswordFormSchema>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });
  const password = useWatch({ control: passwordForm.control, name: "password" });
  const showError = (err: unknown) => setError(getErrorMessage(err));

  const onEmailSubmit = emailForm.handleSubmit(({ email }) => {
    setError(null);
    sendCode(email, { onSuccess: () => setStep({ name: "code", email }), onError: showError });
  });

  const onPasswordSubmit = passwordForm.handleSubmit(({ password: newPassword, confirmPassword }) => {
    if (step.name !== "password") return;
    setError(null);
    resetPassword(
      { email: step.email, resetToken: step.resetToken, password: newPassword, confirmPassword },
      {
        onSuccess: () =>
          navigate(routes.login, {
            replace: true,
            state: { email: step.email, message: "Mot de passe modifié. Connectez-vous avec le nouveau." },
          }),
        onError: showError,
      },
    );
  });

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
              {isSending && <Spinner size="sm" label="Envoi du code" />}
              Recevoir un code
            </Button>
          </form>
        </Form>
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
          onResend={() => {
            setError(null);
            setResendNotice(null);
            sendCode(step.email, {
              onSuccess: () => setResendNotice("Un nouveau code vous a été envoyé."),
              onError: showError,
            });
          }}
          isResending={isSending}
        />
      )}

      {step.name === "password" && (
        <Form {...passwordForm}>
          <form onSubmit={onPasswordSubmit} noValidate className="flex flex-col gap-4">
            {/* Aide les gestionnaires de mots de passe à associer le nouveau mot de passe au compte */}
            <input type="email" autoComplete="username" value={step.email} readOnly hidden />
            <FormField
              control={passwordForm.control}
              name="password"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Nouveau mot de passe</FormLabel>
                  <FormControl>
                    <PasswordInput autoComplete="new-password" autoFocus state={fieldState.invalid ? "error" : "default"} {...field} />
                  </FormControl>
                  {password && <PasswordStrength value={password} rules={passwordRules} />}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Confirmation du mot de passe</FormLabel>
                  <FormControl>
                    <PasswordInput autoComplete="new-password" state={fieldState.invalid ? "error" : "default"} {...field} />
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
            <Button type="submit" size="lg" disabled={isResetting} className="w-full">
              {isResetting && <Spinner size="sm" label="Enregistrement" />}
              Changer le mot de passe
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
