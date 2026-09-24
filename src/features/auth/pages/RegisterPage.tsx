import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@quickadui/forms";
import { routes } from "@/app/routes/routes";
import { useRegister } from "../hooks/UseAuth";
import PasswordStrength from "../components/PasswordStrength";
import {
  languageLevels,
  passwordRules,
  registerSchema,
  type RegisterFormSchema,
} from "../schemas/registerSchema";

export default function RegisterPage() {
  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      level: "A1",
      password: "",
      confirmPassword: "",
    },
  });

  const password = useWatch({ control: form.control, name: "password" });
  const [error, setError] = useState<string | null>(null);
  const { mutate: registerUser, isPending } = useRegister();

  const onSubmit = form.handleSubmit(({ firstName, lastName, email, level, password }) => {
    setError(null);

    registerUser(
      { firstName, lastName, email, level, password },
      {
        onSuccess: (result) => {
          if (!result.is_success) {
            setError(result.error || "Une erreur est survenue lors de la création du compte");
          }
        },
        onError: () => {
          setError("Une erreur est survenue lors de la création du compte");
        },
      },
    );
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-neutral-12">Créer un compte</h1>
        <p className="text-sm text-neutral-11">Rejoignez la communauté LinguaTrack dès aujourd'hui !</p>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="given-name"
                      placeholder="Votre prénom"
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
              name="lastName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="family-name"
                      placeholder="Votre nom"
                      state={fieldState.invalid ? "error" : "default"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Niveau de français</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger ref={field.ref} onBlur={field.onBlur}>
                      <SelectValue placeholder="Choisissez votre niveau" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {languageLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    autoComplete="new-password"
                    placeholder="Choisissez un mot de passe"
                    state={fieldState.invalid ? "error" : "default"}
                    {...field}
                  />
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
                  <PasswordInput
                    autoComplete="new-password"
                    placeholder="Saisissez-le à nouveau"
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

          <Button type="submit" size="lg" disabled={isPending} className="mt-2 w-full text-neutral-1">
            {isPending ? (
              <>
                <Spinner size="sm" label="Création du compte en cours" />
                Création du compte…
              </>
            ) : (
              "Créer mon compte"
            )}
          </Button>

          <p className="text-center text-xs text-neutral-11">
            En créant un compte, vous acceptez nos{" "}
            <a href="/terms" className="font-medium text-neutral-12 underline-offset-4 hover:underline">
              Conditions d'utilisation
            </a>{" "}
            et notre{" "}
            <a href="/privacy" className="font-medium text-neutral-12 underline-offset-4 hover:underline">
              Politique de confidentialité
            </a>
            .
          </p>
        </form>
      </Form>

      <p className="text-center text-sm text-neutral-11">
        Vous avez déjà un compte ?{" "}
        <Link to={routes.login} className="font-medium text-neutral-12 underline-offset-4 hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
