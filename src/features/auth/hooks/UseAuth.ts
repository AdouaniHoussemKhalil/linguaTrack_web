import type { LoginModel, RegisterForm } from "@/features/auth/types/User";
import { UserService } from "@/features/auth/services/UserService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { routes } from "@/app/routes/routes";

export const useSignIn = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (request: LoginModel) => UserService.loginAsync(request),
    onSuccess: (result) => {
      // Échec métier (identifiants invalides…) : affiché par la page via son propre onSuccess
      if (!result.is_success) return;
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate(routes.dashboard, { replace: true });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (request: RegisterForm) => UserService.registerAsync(request),
    onSuccess: (result) => {
      if (!result.is_success) return;
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate(routes.dashboard, { replace: true });
    },
  });
}

export const useSignOut = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return () => {
    UserService.logout();
    queryClient.clear();
    navigate(routes.login, { replace: true });
  };
};
