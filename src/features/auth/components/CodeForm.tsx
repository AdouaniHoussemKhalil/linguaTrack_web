import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription, Button, Spinner } from "@quickadui/core";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from "@quickadui/forms";
import { codeSchema, type CodeFormSchema } from "../schemas/loginSchema";

interface CodeFormProps {
  /** Texte du bouton de validation. */
  submitLabel: string;
  pendingLabel: string;
  isPending: boolean;
  error: string | null;
  onSubmit: (code: string) => void;
  /** Absent : pas de bouton « Renvoyer le code ». */
  onResend?: () => void;
  isResending?: boolean;
  resendNotice?: string | null;
}

/** Saisie d'un code reçu par email (vérification d'adresse, MFA, mot de passe oublié). */
export const CodeForm = ({
  submitLabel,
  pendingLabel,
  isPending,
  error,
  onSubmit,
  onResend,
  isResending = false,
  resendNotice,
}: CodeFormProps) => {
  const form = useForm<CodeFormSchema>({ resolver: zodResolver(codeSchema), defaultValues: { code: "" } });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(({ code }) => onSubmit(code))} noValidate className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="code"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Code reçu par email</FormLabel>
              <FormControl>
                <Input
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  autoFocus
                  placeholder="123456"
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
        {resendNotice && !error && (
          <Alert variant="success">
            <AlertDescription>{resendNotice}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" size="lg" disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Spinner size="sm" label={pendingLabel} />
              {pendingLabel}
            </>
          ) : (
            submitLabel
          )}
        </Button>

        {onResend && (
          <Button type="button" variant="ghost" onClick={onResend} disabled={isResending} className="w-full">
            {isResending && <Spinner size="sm" label="Envoi du code" />}
            Renvoyer le code
          </Button>
        )}
      </form>
    </Form>
  );
};
