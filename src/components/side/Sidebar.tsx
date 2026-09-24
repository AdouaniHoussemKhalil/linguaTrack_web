import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { style, classes } from "typestyle";
import { colors } from "../common/Colors";
import { ScrollBar } from "../ui/ScrollBar";

interface SidebarItemProps {
  to: string;
  label: string;
  icon: string;
  current: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  to,
  label,
  icon,
  current,
}) => {
  const isActive = current === to;

  return (
    <Link
      to={to}
      className={classes(sidebarItemStyle, isActive && activeItemStyle)}
    >
      <span className="material-symbols-outlined">{icon}</span>

      <span>{label}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 900);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <aside className={classes(sidebarStyle, collapsed && collapsedStyle, "ScrollBar")}>
      <div className={topBarStyle}>
        <button
          aria-label={collapsed ? "Ouvrir le menu" : "Fermer le menu"}
          className={toggleButtonStyle}
          onClick={() => setCollapsed((s) => !s)}
        >
          <span className="material-symbols-outlined">{collapsed ? "menu" : "chevron_left"}</span>
        </button>
      </div>

      {/* TOP */}
      <div className={topSectionStyle}>
        <div className={sectionTitleStyle}>MENU</div>

        <SidebarItem
          to="/dashboard"
          label="Tableau de bord"
          icon="dashboard"
          current={location.pathname}
        />

        <SidebarItem
          to="/correction"
          label="Correction"
          icon="edit"
          current={location.pathname}
        />

        <SidebarItem
          to="/history"
          label="Historique"
          icon="History"
          current={location.pathname}
        />
      </div>

      {/* <div className={bottomSectionStyle}>
        <Link to="/preferences" className={sidebarItemStyle}>
          <span className="material-symbols-outlined">tune</span>

          <span>Préférences</span>
        </Link>
      </div> */}
    </aside>
  );
};

export default Sidebar;

/* =========================
   SIDEBAR
========================= */

const sidebarStyle = style({
  width: "260px",

  backgroundColor: colors.white,

  borderRight: `1px solid ${colors.mywhite}`,

  padding: "20px 14px",


  display: "flex",
  flexDirection: "column",

  boxSizing: "border-box",
});

/* =========================
   TOP
========================= */

const topSectionStyle = style({
  display: "flex",
  flexDirection: "column",
  gap: "6px",
});

/* =========================
   BOTTOM
========================= */

// const bottomSectionStyle = style({
//   marginTop: "auto",

//   paddingTop: "20px",

//   borderTop: `1px solid ${colors.mywhite}`,
// });

/* =========================
   SECTION TITLE
========================= */

const sectionTitleStyle = style({
  padding: "0 12px",

  marginBottom: "10px",

  fontSize: "11px",

  fontWeight: 700,

  letterSpacing: "1.5px",

  color: "#9ca3af",

  textTransform: "uppercase",
});

/* =========================
   ITEM
========================= */

const sidebarItemStyle = style({
  display: "flex",
  alignItems: "center",

  gap: "12px",

  padding: "12px 14px",

  borderRadius: "12px",

  textDecoration: "none",

  color: colors.mygray,

  fontSize: "14px",

  fontWeight: 500,

  transition: "all .2s ease",

  $nest: {
    "&:hover": {
      backgroundColor: colors.mywhite,
      color: colors.primary,
    },

    "& .material-symbols-outlined": {
      fontSize: "20px",
    },
  },
});

/* =========================
   ACTIVE
========================= */
const activeItemStyle = style({
  backgroundColor: "#eff6ff",
  color: colors.primary,
  borderLeft: `4px solid ${colors.primary}`,
  paddingLeft: "10px",
});

const collapsedStyle = style({
  width: "72px",
  padding: "12px 8px",
  $nest: {
    "& a": {
      justifyContent: "center",
      padding: "10px",
    },
    "& a span:last-child": {
      display: "none",
    },
    "& .material-symbols-outlined": {
      fontSize: "22px",
    },
  },
});

const topBarStyle = style({
  display: "flex",
  justifyContent: "flex-end",
  marginBottom: "8px",
});

const toggleButtonStyle = style({
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: "6px",
  borderRadius: "8px",
  $nest: {
    "&:hover": {
      backgroundColor: colors.mywhite,
    },
    "& .material-symbols-outlined": {
      verticalAlign: "middle",
      fontSize: "20px",
    },
  },
});
