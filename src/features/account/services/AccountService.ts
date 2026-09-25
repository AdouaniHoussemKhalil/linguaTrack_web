import api from "@/lib/axios";
import type { ChangePasswordRequest, UpdateProfileRequest, UserProfile } from "../types/Account";

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
};
