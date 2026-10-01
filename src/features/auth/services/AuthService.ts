import api from "@/lib/axios";
import type {
  LoginRequest,
  LoginResponse,
  MfaLoginRequest,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  VerifyEmailRequest,
  VerifyResetCodeRequest,
} from "../types/User";

/** Routes /auth de l'API, qui relaie le service d'authentification et pose la session en cookies. */
export const AuthService = {
  login: async (request: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post("/auth/login", request);
    return response.data;
  },
  loginWithMfa: async (request: MfaLoginRequest): Promise<LoginResponse> => {
    const response = await api.post("/auth/login/mfa", request);
    return response.data;
  },
  /** `token` : ID token renvoyé par Google Identity Services. */
  loginWithGoogle: async (token: string): Promise<LoginResponse> => {
    const response = await api.post("/auth/google", { token });
    return response.data;
  },
  register: async (request: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post("/auth/register", request);
    return response.data;
  },
  verifyEmail: async (request: VerifyEmailRequest): Promise<void> => {
    await api.post("/auth/verify-email", request);
  },
  resendVerification: async (email: string): Promise<void> => {
    await api.post("/auth/resend-verification", { email });
  },
  forgotPassword: async (email: string): Promise<void> => {
    await api.post("/auth/forgot-password", { email });
  },
  verifyResetCode: async (request: VerifyResetCodeRequest): Promise<string> => {
    const response = await api.post("/auth/verify-reset-code", request);
    return response.data.resetToken;
  },
  resetPassword: async (request: ResetPasswordRequest): Promise<void> => {
    await api.put("/auth/reset-password", request);
  },
  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
};
