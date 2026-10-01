import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearchParams } from "react-router";
import { Alert, AlertDescription, Button, Spinner } from "@quickadui/core";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from "@quickadui/forms";
import { routes } from "@/app/routes/routes";
import { getErrorMessage } from "@/lib/errors";
import { useResendVerification } from "../hooks/useAuth";
import { emailSchema, type EmailFormSchema } from "../schemas/loginSchema";

const REASONS = {
  expired: {
    title: "Ce lien a expiré",
    text: "Les liens de vérification sont valables 24 heures. Demandez-en un nouveau ci-dessous.",
  },
  invalid: {
    title: "Ce lien n'est pas valide",
    text: "Il a peut-être déjà été remplacé par un lien plus récent, ou il est incomplet. Demandez-en un nouveau ci-dessous.",
  },
} as const;

/**
 * Page « lien invalide » : le service d'authentification redirige ici (`emailVerificationFailedUrl`)
 * avec `?reason=expired|invalid` quand un lien de vérification ne peut pas être utilisé.
 */
export default function EmailVerificationFailedPage() {
  const [searchParams] = useSearchParams();
  const reason = REASONS[searchParams.get("reason") === "expired" ? "expired" : "invalid"];
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { mutate: resend, isPending } = useResendVerification();
  const form = useForm<EmailFormSchema>({ resolver: zodResolver(emailSchema), defaultValues: { email: "" } });

  const onSubmit = form.handleSubmit(({ email }) => {
    setError(null);
    resend(email, { onSuccess: () => setSentTo(email), onError: (err) => setError(getErrorMessage(err)) });
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-neutral-12">{reason.title}</h1>
        <p className="text-sm text-neutral-11">{reason.text}</p>
      </div>

      {sentTo ? (
        <Alert variant="success">
          <AlertDescription>
            Si l'adresse {sentTo} doit encore être vérifiée, un nouveau lien vient de lui être envoyé.
          </AlertDescription>
        </Alert>
      ) : (
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
            {error && (
              <Alert variant="danger">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" size="lg" disabled={isPending} className="w-full">
              {isPending && <Spinner size="sm" label="Envoi du lien" />}
              Recevoir un nouveau lien
            </Button>
          </form>
        </Form>
      )}

      <p className="text-center text-sm text-neutral-11">
        Adresse déjà confirmée ?{" "}
        <Link to={routes.login} className="font-medium text-neutral-12 underline-offset-4 hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
