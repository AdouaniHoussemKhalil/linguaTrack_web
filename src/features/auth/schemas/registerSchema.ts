import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z.string().min(1, "Nom est requis"),
    lastName: z.string().min(1, "Prénom est requis"),
    email: z.string().email("Adresse email invalide").min(1, "Email est requis"),
    level: z.string(),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(/[A-Z]/, "Au moins une lettre majuscule")
      .regex(/[a-z]/, "Au moins une lettre minuscule")
      .regex(/[0-9]/, "Au moins un chiffre"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type RegisterFormSchema = z.infer<typeof registerSchema>;
export type RegisterRequest = Omit<RegisterFormSchema, "confirmPassword">;
