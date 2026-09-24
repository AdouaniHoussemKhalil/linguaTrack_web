import api from "@/lib/axios";
import { clearSession, saveSession } from "@/lib/session";
import type { LoginModel, LoginResult, RegisterForm } from "../types/User";

export const UserService = {
  loginAsync: async (request: LoginModel): Promise<LoginResult> => {
    const response = await api.post('/users/login', request);
    const data = response.data;
    
    if (data.access_token) {
      saveSession(data.access_token, data.user_id);
    }
    
    return data;
  },
  registerAsync: async (request: RegisterForm): Promise<LoginResult> => {
    const response = await api.post('/users/register', request);
    const data = response.data;
    
    if (data.access_token) {
      saveSession(data.access_token, data.user_id);
    }
    
    return data;
  },
  logout: () => {
    clearSession();
  }
};

