import type { RegisterFormSchema } from "../schemas/registerSchema";

/** Utilisateur renvoyé par le service d'authentification (via les routes /auth de l'API). */
export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

/** Connexion réussie (`user`, session ouverte en cookies) ou code MFA envoyé par email. */
export type LoginResponse = {
  user?: AuthUser;
  MFARequired?: boolean;
  isNewUser?: boolean;
};

export type MfaLoginRequest = {
  email: string;
  mfaCode: string;
};

export type RegisterFormValues = RegisterFormSchema;
export type RegisterRequest = RegisterFormSchema;

/** Vérification d'e-mail et mot de passe oublié : code à saisir ou lien reçu par e-mail (réglage de l'application). */
export type VerificationMode = "code" | "link";

/** Sans `emailVerificationRequired`, la session est déjà ouverte. */
export type RegisterResponse = {
  user: AuthUser;
  emailVerificationRequired?: boolean;
  emailVerificationMode?: VerificationMode;
};

export type VerifyEmailRequest = {
  email: string;
  code: string;
};

export type VerifyResetCodeRequest = {
  email: string;
  resetCode: string;
};

export type ResetPasswordRequest = {
  email: string;
  resetToken: string;
  password: string;
  confirmPassword: string;
};
