import { z } from "zod";
import { passwordRules } from "@/features/auth";

export const profileSchema = z.object({
  firstName: z.string().trim().min(1, "Le prénom est requis").max(100),
  lastName: z.string().trim().min(1, "Le nom est requis").max(100),
  level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
});

export type ProfileFormSchema = z.infer<typeof profileSchema>;

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),
    newPassword: z.string().superRefine((value, ctx) => {
      const failed = passwordRules.find((rule) => !rule.test(value));
      if (failed) {
        ctx.addIssue({ code: "custom", message: `Mot de passe trop faible : ${failed.label.toLowerCase()} requis` });
      }
    }),
    confirmPassword: z.string().min(1, "Veuillez confirmer le mot de passe"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "Le nouveau mot de passe doit être différent de l'actuel",
    path: ["newPassword"],
  });

export type PasswordFormSchema = z.infer<typeof passwordSchema>;
