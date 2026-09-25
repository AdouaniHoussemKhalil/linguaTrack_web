import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AccountService } from "../services/AccountService";
import type { ChangePasswordRequest, UpdateProfileRequest, UserProfile } from "../types/Account";

const ME_KEY = ["users", "me"] as const;

export const useMe = () =>
  useQuery<UserProfile>({
    queryKey: ME_KEY,
    queryFn: AccountService.getMe,
    staleTime: 1000 * 60 * 10,
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
