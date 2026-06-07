import type {
  RegisterFormSchema,
  RegisterRequest,
} from "../schemas/registerSchema";

export type LoginModel = {
  username: string;
  password: string;
};

export type LoginResult = {
  access_token?: string;
  is_success: boolean;
  error?: string;
};

export type RegisterFormValues = RegisterFormSchema;
export type RegisterForm = RegisterRequest;
