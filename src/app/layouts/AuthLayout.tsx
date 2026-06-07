import { style } from "typestyle";
import { colors } from "@/components/common/Colors";

const signInImg = "/signin.png";


interface Props {
  children: React.ReactNode;
}

const AuthLayout: React.FC<Props> = ({ children }) => {


  return (
    <div className={layoutStyle}>

      <div className={wrapperStyle}>
        <div className={formCardStyle}>
          <div className={loginPageContainerStyle}>
          {children}
          </div>
        </div>

        <div className={imageCardStyle}>
          <img
            src={signInImg}
            alt="Auth Visual"
            className={imageStyle}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

/* ===================== LAYOUT ===================== */

const layoutStyle = style({
  fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
  backgroundColor: colors.mywhite,

  minHeight: "100vh",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  padding: "10px",
  boxSizing: "border-box",

  position: "relative",
});

/* ===================== WRAPPER ===================== */

const wrapperStyle = style({
  width: "100%",
  maxWidth: "1400px",

  height: "90vh",

  display: "flex",
  gap: "20px",

  $nest: {
    "@media (max-width: 900px)": {
      flexDirection: "column",
      height: "auto",
    },
  },
});

/* ===================== FORM CARD ===================== */

const formCardStyle = style({
  flex: 3,
  height: "100%",

  backgroundColor: colors.white,

  borderRadius: "10px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",

  padding: "40px",
  boxSizing: "border-box",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  $nest: {
    "@media (max-width: 900px)": {
      width: "100%",
      minHeight: "500px",
      padding: "24px",
    },
  },
});


const loginPageContainerStyle = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: colors.white,
  padding: "10px 20px",
});

/* ===================== IMAGE CARD ===================== */

const imageCardStyle = style({
  flex: 7,
  height: "100%",

  backgroundColor: colors.primary,

  borderRadius: "10px",

  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",

  overflow: "hidden",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  $nest: {
    "@media (max-width: 900px)": {
      width: "100%",
      minHeight: "350px",
    },
  },
});

/* ===================== IMAGE ===================== */

const imageStyle = style({
  width: "95%",
  height: "95%",
  objectFit: "cover",
  borderTopLeftRadius: "100px",
  borderBottomRightRadius: "100px",
  borderTopRightRadius: "10px",
  borderBottomLeftRadius: "10px",
});