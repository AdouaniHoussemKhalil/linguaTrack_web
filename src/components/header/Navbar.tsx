import React from "react";
import { Link, useLocation } from "react-router";
import { style } from "typestyle";
import { colors } from "../common/Colors";
import { routes } from "@/app/routes/routes";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  const location = useLocation();

  const isLoginPage = location.pathname === routes.login;

  return (
    <header className={navbarStyle}>
      {/* Logo */}
      <Link to="/" className={logoStyle}>
        LinguaTrack
      </Link>

      {/* Right side */}
      <div className={rightSectionStyle}>
        {!isLoginPage ? (
          <div className={authTextStyle}>
            <span>Already have an account?</span>

            <Link to={routes.login} className={linkStyle}>
              Log in
            </Link>
          </div>
        ) : (
          <div className={authTextStyle}>
            <span>Don't have an account?</span>

            <Link to={routes.register} className={linkStyle}>
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

const navbarStyle = style({
  position: "sticky",
  top: 0,
  zIndex: 10,

  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  padding: "20px 20px",

  backgroundColor: colors.white,
  borderBottom: `1px solid ${colors.mywhite}`,
});

const logoStyle = style({
  fontSize: "18px",
  fontWeight: 700,
  color: colors.primary,
  textDecoration: "none",
  cursor: "pointer",

  $nest: {
    "&:hover": {
      opacity: 0.9,
    },
  },
});

const rightSectionStyle = style({
  display: "flex",
  alignItems: "center",
  marginRight: 50,
});

const authTextStyle = style({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontSize: "14px",
  color: colors.mygray,
});

const linkStyle = style({
  color: colors.primary,
  fontWeight: 500,
  textDecoration: "underline",
  cursor: "pointer",
  transition: "all 0.2s",

  $nest: {
    "&:hover": {
      opacity: 0.8,
    },
  },
});
