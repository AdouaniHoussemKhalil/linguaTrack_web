import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router";
import { routes } from "@/app/routes/routes";
import { AuthService } from "../services/AuthService";

/** Après l'ouverture de la session : cache vidé (autre utilisateur possible), retour à la page demandée. */
export const useCompleteSignIn = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  return () => {
    queryClient.clear();
    navigate(from && from !== routes.login ? from : routes.dashboard, { replace: true });
  };
};

export const useSignIn = () => useMutation({ mutationFn: AuthService.login });

export const useMfaSignIn = () => useMutation({ mutationFn: AuthService.loginWithMfa });

export const useGoogleSignIn = () => useMutation({ mutationFn: AuthService.loginWithGoogle });

export const useRegister = () => useMutation({ mutationFn: AuthService.register });

export const useVerifyEmail = () => useMutation({ mutationFn: AuthService.verifyEmail });

export const useResendVerification = () => useMutation({ mutationFn: AuthService.resendVerification });

export const useForgotPassword = () => useMutation({ mutationFn: AuthService.forgotPassword });

export const useVerifyResetCode = () => useMutation({ mutationFn: AuthService.verifyResetCode });

export const useResetPassword = () => useMutation({ mutationFn: AuthService.resetPassword });

export const useSignOut = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return async () => {
    try {
      await AuthService.logout();
    } finally {
      // Déconnecté côté navigateur même si l'API ne répond pas
      queryClient.clear();
      navigate(routes.login, { replace: true });
    }
  };
};
