import type { LanguageLevel } from "./levels";

/** Réponse de GET/PATCH /users/me (l'API sérialise les noms en snake_case). */
export type UserProfile = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  level: LanguageLevel | null;
  created_at: string;
  /** Vérification en deux étapes (code par email à la connexion) */
  mfa_enabled: boolean;
};

export type UpdateProfileRequest = {
  firstName?: string;
  lastName?: string;
  level?: LanguageLevel;
};

export type MfaAction = "activate" | "deactivate";

export type ChangePasswordRequest = {
  current_password: string;
  new_password: string;
};
