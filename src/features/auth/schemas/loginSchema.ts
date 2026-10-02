import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "L'email est requis").email("Adresse email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export type LoginFormSchema = z.infer<typeof loginSchema>;

/** Code reçu par email (vérification d'adresse, MFA, mot de passe oublié). */
export const codeSchema = z.object({
  code: z.string().trim().min(1, "Le code est requis"),
});

export type CodeFormSchema = z.infer<typeof codeSchema>;

export const emailSchema = loginSchema.pick({ email: true });

export type EmailFormSchema = z.infer<typeof emailSchema>;
