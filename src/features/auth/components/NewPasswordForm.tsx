import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription, Button, Spinner } from "@quickadui/core";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, PasswordInput } from "@quickadui/forms";
import { newPasswordSchema, passwordRules, type NewPasswordFormSchema } from "../schemas/registerSchema";
import PasswordStrength from "./PasswordStrength";

interface NewPasswordFormProps {
  /** Adresse du compte : aide les gestionnaires de mots de passe à associer le nouveau mot de passe. */
  email: string;
  isPending: boolean;
  error: React.ReactNode;
  onSubmit: (values: NewPasswordFormSchema) => void;
}

/** Nouveau mot de passe + confirmation (mot de passe oublié, par code ou par lien). */
export const NewPasswordForm = ({ email, isPending, error, onSubmit }: NewPasswordFormProps) => {
  const form = useForm<NewPasswordFormSchema>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });
  const password = useWatch({ control: form.control, name: "password" });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <input type="email" autoComplete="username" value={email} readOnly hidden />
        <FormField
          control={form.control}
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
          control={form.control}
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
        <Button type="submit" size="lg" disabled={isPending} className="w-full">
          {isPending && <Spinner size="sm" label="Enregistrement" />}
          Changer le mot de passe
        </Button>
      </form>
    </Form>
  );
};
