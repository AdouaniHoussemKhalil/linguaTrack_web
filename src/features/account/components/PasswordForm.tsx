import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Spinner } from "@quickadui/core";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, PasswordInput } from "@quickadui/forms";
import { toast } from "@quickadui/overlays";
import { PasswordStrength, passwordRules } from "@/features/auth";
import { getErrorMessage } from "@/lib/errors";
import { useChangePassword } from "../hooks/useAccount";
import { passwordSchema, type PasswordFormSchema } from "../schemas";

const EMPTY: PasswordFormSchema = { currentPassword: "", newPassword: "", confirmPassword: "" };

export const PasswordForm = () => {
  const form = useForm<PasswordFormSchema>({ resolver: zodResolver(passwordSchema), defaultValues: EMPTY });
  const newPassword = useWatch({ control: form.control, name: "newPassword" });
  const { mutate: changePassword, isPending } = useChangePassword();

  const onSubmit = form.handleSubmit(({ currentPassword, newPassword }) => {
    changePassword(
      { current_password: currentPassword, new_password: newPassword },
      {
        onSuccess: () => {
          form.reset(EMPTY);
          toast({ variant: "success", title: "Mot de passe modifié" });
        },
        onError: (error) => {
          const message = getErrorMessage(error);
          // Erreur sur le mot de passe actuel : affichée sous le champ concerné
          if (message.includes("actuel incorrect")) form.setError("currentPassword", { message });
          else toast({ variant: "danger", title: "Modification impossible", description: message });
        },
      },
    );
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mot de passe</CardTitle>
        <CardDescription>Votre mot de passe actuel est demandé pour le changer.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Mot de passe actuel</FormLabel>
                  <FormControl>
                    <PasswordInput autoComplete="current-password" state={fieldState.invalid ? "error" : "default"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Nouveau mot de passe</FormLabel>
                  <FormControl>
                    <PasswordInput autoComplete="new-password" state={fieldState.invalid ? "error" : "default"} {...field} />
                  </FormControl>
                  {newPassword && <PasswordStrength value={newPassword} rules={passwordRules} />}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Confirmation du nouveau mot de passe</FormLabel>
                  <FormControl>
                    <PasswordInput autoComplete="new-password" state={fieldState.invalid ? "error" : "default"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} className="self-start">
              {isPending && <Spinner size="sm" label="Modification en cours" />}
              Changer le mot de passe
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
