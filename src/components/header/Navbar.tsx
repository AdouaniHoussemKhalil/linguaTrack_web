import React from "react";
import { Link, useLocation } from "react-router";
import {
  Avatar,
  AvatarFallback,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

interface NavbarProps {
  /** À activer uniquement sous un `DashboardLayout` / `SidebarProvider`. */
  showSidebarTrigger?: boolean | undefined;
  onLogout?: (() => void) | undefined;
}

const Navbar: React.FC<NavbarProps> = ({ showSidebarTrigger, onLogout }) => {
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
                aria-label="Menu du compte"
                className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-8"
              >
                <Avatar>
                  <AvatarFallback>
                    <UserIcon size={18} />
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
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
