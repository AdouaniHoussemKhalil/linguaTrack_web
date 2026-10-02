import React from "react";
import { Link, useLocation } from "react-router";
import {
  Avatar,
  AvatarFallback,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@quickadui/core";
import { UserIcon } from "@quickadui/icons";
import {
  Navbar as ShellNavbar,
  NavbarActions,
  NavbarBrand,
  SidebarTrigger,
  useSidebar,
} from "@quickadui/shell";
import { routes } from "@/app/routes/routes";
import ThemeModeToggle from "./ThemeModeToggle";

export interface NavbarUser {
  name: string;
  email: string;
  initials: string;
}

interface NavbarProps {
  /** À activer uniquement sous un `DashboardLayout` / `SidebarProvider`. */
  showSidebarTrigger?: boolean | undefined;
  onLogout?: (() => void) | undefined;
  /** Utilisateur connecté ; tant qu'il n'est pas chargé, l'avatar affiche une icône. */
  user?: NavbarUser | undefined;
}

const Navbar: React.FC<NavbarProps> = ({ showSidebarTrigger, onLogout, user }) => {
  const location = useLocation();

  const isLoginPage = location.pathname === routes.login;
  const isRegisterPage = location.pathname === routes.register;

  return (
    <ShellNavbar className="h-16 px-4 md:px-6">
      <NavbarBrand>
        {showSidebarTrigger && <FrenchSidebarTrigger />}

        <Link to={routes.dashboard} aria-label="LinguaTrack - Accueil">
          <img src="/linguatrack-logo.svg" alt="LinguaTrack" className="block size-10 object-contain" />
        </Link>
      </NavbarBrand>

      <NavbarActions className="ml-auto gap-3">
        <ThemeModeToggle />

        {isLoginPage ? (
          <Button asChild size="sm">
            <Link to={routes.register}>Créer un compte</Link>
          </Button>
        ) : isRegisterPage ? (
          <Button asChild variant="outline" size="sm">
            <Link to={routes.login}>Se connecter</Link>
          </Button>
        ) : onLogout ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={user ? `Menu du compte de ${user.name}` : "Menu du compte"}
                className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-8"
              >
                <Avatar>
                  <AvatarFallback className="font-semibold">
                    {user ? user.initials : <UserIcon size={18} aria-hidden />}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="min-w-56">
              {user && (
                <>
                  <DropdownMenuLabel className="flex flex-col gap-0.5">
                    <span className="truncate text-sm font-semibold text-neutral-12">{user.name}</span>
                    <span className="truncate text-xs font-normal text-neutral-11">{user.email}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem asChild>
                <Link to={routes.settings}>Paramètres</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={onLogout}>Se déconnecter</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </NavbarActions>
    </ShellNavbar>
  );
};

/** `SidebarTrigger` avec un libellé accessible en français. */
const FrenchSidebarTrigger: React.FC = () => {
  const { collapsed } = useSidebar();

  return <SidebarTrigger aria-label={collapsed ? "Ouvrir le menu" : "Réduire le menu"} />;
};

export default Navbar;
