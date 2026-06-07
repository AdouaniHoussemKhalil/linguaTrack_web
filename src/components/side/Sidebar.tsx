import React from "react";
import { Link, useLocation } from "react-router";
import { style, classes } from "typestyle";
import { colors } from "../common/Colors";

interface SidebarItemProps {
  to: string;
  label: string;
  current: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, label, current }) => {
  const isActive = current === to;

  return (
    <Link to={to} className={classes(itemStyle, isActive && activeItemStyle)}>
      {label}
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className={sidebarStyle}>
      <nav className={menuStyle}>
        <SidebarItem
          to="/dashboard"
          label="Dashboard"
          current={location.pathname}
        />
        <SidebarItem
          to="/courses"
          label="Courses"
          current={location.pathname}
        />
        <SidebarItem
          to="/progress"
          label="Progress"
          current={location.pathname}
        />
        <SidebarItem
          to="/settings"
          label="Settings"
          current={location.pathname}
        />
      </nav>
    </div>
  );
};

export default Sidebar;

const sidebarStyle = style({
  width: "220px",
  backgroundColor: colors.white,
  borderRight: `1px solid ${colors.mywhite}`,
  padding: "20px 10px",
});

const menuStyle = style({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
});

const itemStyle = style({
  padding: "10px 14px",
  borderRadius: "6px",
  textDecoration: "none",
  color: colors.mygray,
  fontSize: "14px",
  transition: "all 0.2s",

  $nest: {
    "&:hover": {
      backgroundColor: colors.mywhite,
      color:colors.primary,
    },
  },
});

const activeItemStyle = style({
  backgroundColor:colors.primary,
  color: colors.white,
});
