import React from "react";
import type { IconType } from "react-icons";
import { MdHistory, MdOutlineDashboard, MdOutlineEdit, MdOutlineSettings } from "react-icons/md";
import { useLocation, useNavigate } from "react-router";
import {
  Sidebar as ShellSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarNavItem,
} from "@quickadui/shell";
import { routes } from "@/app/routes/routes";

interface NavItem {
  to: string;
  label: string;
  icon: IconType;
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Menu",
    items: [
      { to: routes.dashboard, label: "Tableau de bord", icon: MdOutlineDashboard },
      { to: routes.correction, label: "Correction", icon: MdOutlineEdit },
      { to: routes.history, label: "Historique", icon: MdHistory },
    ],
  },
  {
    label: "Compte",
    items: [{ to: routes.settings, label: "Paramètres", icon: MdOutlineSettings }],
  },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // SidebarNavItem rend un <a> natif : on garde le href (ouverture dans un
  // nouvel onglet) mais on navigue côté client pour un clic simple.
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    navigate(to);
  };

  return (
    <ShellSidebar aria-label="Navigation principale">
      <SidebarContent className="p-3">
        {navGroups.map(({ label: groupLabel, items }) => (
          <SidebarGroup key={groupLabel} className="gap-1">
            <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
            {items.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);

              return (
                <SidebarNavItem
                  key={to}
                  href={to}
                  title={label}
                  active={isActive}
                  className={isActive ? "font-semibold" : undefined}
                  aria-current={isActive ? "page" : undefined}
                  icon={<Icon size={20} aria-hidden className="shrink-0" />}
                  onClick={(event) => handleClick(event, to)}
                >
                  {label}
                </SidebarNavItem>
              );
            })}
          </SidebarGroup>
        ))}
      </SidebarContent>
    </ShellSidebar>
  );
};

export default Sidebar;
