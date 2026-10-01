import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { AccountService } from "../services/AccountService";
import type { ChangePasswordRequest, MfaAction, UpdateProfileRequest, UserProfile } from "../types/Account";

const ME_KEY = ["users", "me"] as const;

/** Profil de l'utilisateur connecté ; sert aussi de vérification de session (ProtectedRoute). */
export const useMe = () =>
  useQuery<UserProfile>({
    queryKey: ME_KEY,
    queryFn: AccountService.getMe,
    staleTime: 1000 * 60 * 10,
    // 401 / 403 : réponse définitive (pas de session, compte bloqué…), inutile de réessayer
    retry: (failureCount, error) =>
      !(isAxiosError(error) && error.response && error.response.status < 500) && failureCount < 1,
  });

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation<UserProfile, Error, UpdateProfileRequest>({
    mutationFn: AccountService.updateMe,
    onSuccess: (profile) => queryClient.setQueryData(ME_KEY, profile),
  });
};

export const useChangePassword = () =>
  useMutation<void, Error, ChangePasswordRequest>({
    mutationFn: AccountService.changePassword,
  });

export const useRequestMfa = () => useMutation<void, Error, MfaAction>({ mutationFn: AccountService.requestMfa });

export const useConfirmMfa = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { action: MfaAction; code: string }>({
    mutationFn: AccountService.confirmMfa,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ME_KEY }),
  });
};
