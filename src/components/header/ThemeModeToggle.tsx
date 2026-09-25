import React from "react";
import type { IconType } from "react-icons";
import { LuMonitor, LuMoon, LuSun } from "react-icons/lu";
import { IconButton } from "@quickadui/core";
import { useTheme, type ThemeMode } from "@quickadui/theme";

const modes: { value: ThemeMode; label: string; icon: IconType }[] = [
  { value: "light", label: "Thème clair", icon: LuSun },
  { value: "dark", label: "Thème sombre", icon: LuMoon },
  { value: "system", label: "Thème du système", icon: LuMonitor },
];

const ThemeModeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Thème"
      className="flex items-center gap-0.5 rounded-full border border-neutral-6 bg-neutral-2 p-0.5"
    >
      {modes.map(({ value, label, icon: Icon }) => {
        const isActive = theme === value;

        return (
          <IconButton
            key={value}
            role="radio"
            aria-checked={isActive}
            aria-label={label}
            title={label}
            variant="ghost"
            size="sm"
            className={
              isActive
                ? "rounded-full bg-neutral-1 text-neutral-12 shadow-sm hover:bg-neutral-1"
                : "rounded-full text-neutral-10 hover:text-neutral-12"
            }
            onClick={() => setTheme(value)}
          >
            <Icon size={16} aria-hidden />
          </IconButton>
        );
      })}
    </div>
  );
};

export default ThemeModeToggle;
