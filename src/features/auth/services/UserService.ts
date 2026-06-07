import api from "@/lib/axios";
import type { LoginModel, LoginResult, RegisterForm } from "../types/User";

export const UserService = {
  loginAsync: async (request: LoginModel): Promise<LoginResult> => {
    const response = await api.post('/users/login', request);
    const data = response.data;
    
    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
    }
    
    return data;
  },
  registerAsync: async (request: RegisterForm): Promise<LoginResult> => {
    const response = await api.post('/users/register', request);
    const data = response.data;
    
    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
    }
    
    return data;
  }
};

