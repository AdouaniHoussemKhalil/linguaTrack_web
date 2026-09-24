import React from "react";
import { Link, useLocation } from "react-router";
import { style } from "typestyle";
import { colors } from "../common/Colors";
import { routes } from "@/app/routes/routes";

const Navbar: React.FC = () => {
  const location = useLocation();

  const isLoginPage = location.pathname === routes.login;
  const isRegisterPage = location.pathname === routes.register;

  const logo = "/linguatrack-logo.svg";

  return (
    <header className={navbarStyle}>
      {/* LOGO */}
      <Link to="/" className={brandStyle}>
        <div className={logoContainerStyle}>
          <img src={logo} alt="LinguaTrack" className={logoImageStyle} />
        </div>
      </Link>

      {/* MENU */}
      <nav className={navStyle}></nav>

      {/* ACTIONS */}
      <div className={actionsStyle}>
        <nav className={navStyle}>

          <Link to="/contact" className={navLinkStyle}>
            Contactez-nous
          </Link>

          <Link to="/about" className={navLinkStyle}>
            En savoir plus
          </Link>

          <Link to="/settings" className={navLinkStyle}>
            Paramètres
          </Link>
        </nav>
        {isLoginPage ? (
          <Link to={routes.register} className={primaryButtonStyle}>
            Créer un compte
          </Link>
        ) : isRegisterPage ? (
          <Link to={routes.login} className={secondaryButtonStyle}>
            Se connecter
          </Link>
        ) : (
          <>
            <button className={primaryButtonStyle}>Upgrade</button>

            <div className={avatarStyle}>JD</div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;

/* ========================================= */
/* HEADER */
/* ========================================= */

const navbarStyle = style({
  position: "sticky",
  top: 0,
  zIndex: 100,

  height: "72px",

  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",

  padding: "0 40px",

  backgroundColor: colors.white,

  borderBottom: "1px solid #e5e7eb",

  boxSizing: "border-box",

  $nest: {
    "@media (max-width: 900px)": {
      padding: "0 20px",
    },
  },
});

/* ========================================= */
/* BRAND */
/* ========================================= */

const brandStyle = style({
  display: "flex",
  alignItems: "center",
  gap: "12px",

  textDecoration: "none",
});

const logoContainerStyle = style({
  width: "40px",
  height: "40px",



  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  overflow: "hidden",

});

const logoImageStyle = style({
  width: "40px",
  height: "40px",
  objectFit: "contain",
});


/* ========================================= */
/* NAVIGATION */
/* ========================================= */

const navStyle = style({
  display: "flex",
  alignItems: "center",
  gap: "32px",
  marginRight: "40px",

  $nest: {
    "@media (max-width: 900px)": {
      display: "none",
    },
  },
});

const navLinkStyle = style({
  textDecoration: "none",

  color: "#64748b",

  fontSize: "14px",
  fontWeight: 500,

  transition: "all .2s ease",

  $nest: {
    "&:hover": {
      color: colors.primary,
    },
  },
});

const navLinkActiveStyle = style({
  textDecoration: "none",

  color: colors.primary,

  fontSize: "14px",
  fontWeight: 700,
});

/* ========================================= */
/* ACTIONS */
/* ========================================= */

const actionsStyle = style({
  display: "flex",
  alignItems: "center",
  gap: "14px",
});

/* ========================================= */
/* BUTTONS */
/* ========================================= */

const primaryButtonStyle = style({
  height: "42px",

  padding: "0 18px",

  border: "none",
  borderRadius: "10px",

  backgroundColor: colors.primary,
  color: colors.white,

  textDecoration: "none",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  fontSize: "14px",
  fontWeight: 600,

  cursor: "pointer",

  transition: "all .2s ease",

  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",

  $nest: {
    "&:hover": {
      opacity: 0.9,
      transform: "translateY(-1px)",
    },
  },
});

const secondaryButtonStyle = style({
  height: "42px",

  padding: "0 18px",

  borderRadius: "10px",

  backgroundColor: "#f8fafc",

  border: "1px solid #e2e8f0",

  color: "#334155",

  textDecoration: "none",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  fontSize: "14px",
  fontWeight: 600,

  transition: "all .2s ease",

  $nest: {
    "&:hover": {
      backgroundColor: "#f1f5f9",
    },
  },
});

/* ========================================= */
/* AVATAR */
/* ========================================= */

const avatarStyle = style({
  width: "42px",
  height: "42px",

  borderRadius: "50%",

  backgroundColor: "#f1f5f9",

  border: "1px solid #e2e8f0",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  fontSize: "14px",
  fontWeight: 700,

  color: "#334155",

  cursor: "pointer",

  transition: "all .2s ease",

  $nest: {
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
});
