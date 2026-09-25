import { z } from "zod";
import type { PasswordRule } from "@quickadui/forms";

/** Règles du mot de passe : source unique pour la validation et l'indicateur de robustesse. */
export const passwordRules: PasswordRule[] = [
  { id: "length", label: "Au moins 8 caractères", test: (value) => value.length >= 8 },
  { id: "lowercase", label: "Une lettre minuscule", test: (value) => /[a-z]/.test(value) },
  { id: "uppercase", label: "Une lettre majuscule", test: (value) => /[A-Z]/.test(value) },
  { id: "number", label: "Un chiffre", test: (value) => /[0-9]/.test(value) },
];

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
    firstName: z.string().trim().min(1, "Le prénom est requis"),
    lastName: z.string().trim().min(1, "Le nom est requis"),
    email: z.string().min(1, "L'email est requis").email("Adresse email invalide"),
    level: z.string(),
    password: z.string().superRefine((value, ctx) => {
      const failed = passwordRules.find((rule) => !rule.test(value));
      if (failed) {
        ctx.addIssue({
          code: "custom",
          message: `Mot de passe trop faible : ${failed.label.toLowerCase()} requis`,
        });
      }
    }),
    confirmPassword: z.string().min(1, "Veuillez confirmer le mot de passe"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type RegisterFormSchema = z.infer<typeof registerSchema>;
export type RegisterRequest = Omit<RegisterFormSchema, "confirmPassword">;
