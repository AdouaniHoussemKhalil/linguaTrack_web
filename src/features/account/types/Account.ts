import type { LanguageLevel } from "./levels";

/** Réponse de GET/PATCH /users/me (l'API sérialise les noms en snake_case). */
export type UserProfile = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  level: LanguageLevel | null;
  created_at: string;
};

export type UpdateProfileRequest = {
  firstName?: string;
  lastName?: string;
  level?: LanguageLevel;
};

export type ChangePasswordRequest = {
  current_password: string;
  new_password: string;
};
