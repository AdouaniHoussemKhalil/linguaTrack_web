import api from "@/lib/axios";
import type { ChangePasswordRequest, MfaAction, UpdateProfileRequest, UserProfile } from "../types/Account";

export const AccountService = {
  getMe: async (): Promise<UserProfile> => {
    const response = await api.get("/users/me");
    return response.data;
  },
  updateMe: async (request: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await api.patch("/users/me", request);
    return response.data;
  },
  changePassword: async (request: ChangePasswordRequest): Promise<void> => {
    await api.put("/users/me/password", request);
  },
  /** Envoie par email le code qui confirme l'activation ou la désactivation de la MFA. */
  requestMfa: async (action: MfaAction): Promise<void> => {
    await api.post("/users/me/mfa/request", { action });
  },
  confirmMfa: async (request: { action: MfaAction; code: string }): Promise<void> => {
    await api.post("/users/me/mfa/confirm", request);
  },
};
