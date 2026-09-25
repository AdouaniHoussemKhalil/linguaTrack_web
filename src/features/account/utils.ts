import type { UserProfile } from "./types/Account";

/** « Houssem Adouani » → « HA » ; repli sur l'email. */
export const getInitials = (user: Pick<UserProfile, "first_name" | "last_name" | "email">): string => {
  const initials = `${user.first_name?.trim()[0] ?? ""}${user.last_name?.trim()[0] ?? ""}`.toUpperCase();
  return initials || user.email[0]?.toUpperCase() || "?";
};

export const getFullName = (user: Pick<UserProfile, "first_name" | "last_name">): string =>
  `${user.first_name} ${user.last_name}`.trim();
