import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
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
import { useSignIn } from "@/features/auth/hooks/UseAuth";
import { loginSchema, type LoginFormSchema } from "../schemas/loginSchema";

export default function LoginPage() {
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const [error, setError] = useState<string | null>(null);
  const { mutate: signIn, isPending } = useSignIn();

  const onSubmit = form.handleSubmit(({ email, password }) => {
    setError(null);

    signIn(
      { username: email, password },
      {
        onSuccess: (result) => {
          if (!result.is_success) {
            setError(result.error || "Email ou mot de passe non valide");
          }
        },
        onError: () => {
          setError("Une erreur est survenue lors de la connexion");
        },
      },
    );
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-neutral-12">Se connecter</h1>
        <p className="text-sm text-neutral-11">Heureux de vous revoir sur LinguaTrack.</p>
      </div>

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
                <FormLabel>Mot de passe</FormLabel>
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
              <AlertDescription>{error}</AlertDescription>
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

      <p className="text-center text-sm text-neutral-11">
        Vous n'avez pas de compte ?{" "}
        <Link to={routes.register} className="font-medium text-neutral-12 underline-offset-4 hover:underline">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
