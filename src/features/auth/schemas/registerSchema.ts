import { z } from "zod";
import type { PasswordRule } from "@quickadui/forms";

/** Règles du mot de passe : source unique pour la validation et l'indicateur de robustesse. */
export const passwordRules: PasswordRule[] = [
  { id: "length", label: "Au moins 8 caractères", test: (value) => value.length >= 8 },
  { id: "lowercase", label: "Une lettre minuscule", test: (value) => /[a-z]/.test(value) },
  { id: "uppercase", label: "Une lettre majuscule", test: (value) => /[A-Z]/.test(value) },
  { id: "number", label: "Un chiffre", test: (value) => /[0-9]/.test(value) },
  { id: "special", label: "Un caractère spécial", test: (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value) },
];

/** Prénom / nom : 3 caractères minimum, règle du service d'authentification. */
export const nameField = (label: string) =>
  z.string().trim().min(1, `Le ${label} est requis`).min(3, `Le ${label} doit contenir au moins 3 caractères`).max(100);

/** Mot de passe conforme à `passwordRules`. */
export const strongPassword = () =>
  z.string().superRefine((value, ctx) => {
    const failed = passwordRules.find((rule) => !rule.test(value));
    if (failed) {
      ctx.addIssue({ code: "custom", message: `Mot de passe trop faible : ${failed.label.toLowerCase()} requis` });
    }
  });

export const languageLevels = [
  { value: "A1", label: "A1 - Débutant" },
  { value: "A2", label: "A2 - Élémentaire" },
  { value: "B1", label: "B1 - Intermédiaire" },
  { value: "B2", label: "B2 - Intermédiaire avancé" },
  { value: "C1", label: "C1 - Avancé" },
  { value: "C2", label: "C2 - Maîtrise" },
] as const;

export const registerSchema = z
  .object({
    firstName: nameField("prénom"),
    lastName: nameField("nom"),
    email: z.string().min(1, "L'email est requis").email("Adresse email invalide"),
    level: z.string(),
    password: strongPassword(),
    confirmPassword: z.string().min(1, "Veuillez confirmer le mot de passe"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type RegisterFormSchema = z.infer<typeof registerSchema>;

/** Nouveau mot de passe + confirmation (mot de passe oublié). */
export const newPasswordSchema = z
  .object({
    password: strongPassword(),
    confirmPassword: z.string().min(1, "Veuillez confirmer le mot de passe"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type NewPasswordFormSchema = z.infer<typeof newPasswordSchema>;
