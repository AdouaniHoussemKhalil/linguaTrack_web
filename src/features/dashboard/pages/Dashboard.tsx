import { style } from "typestyle";
import { colors } from "@/components/common/Colors";

export default function Dashboard() {
  return (
    <div className={containerStyle}>
      <h1 className={titleStyle}>Dashboard</h1>
      <p className={textStyle}>Bienvenue sur votre tableau de bord</p>
    </div>
  );
}

const containerStyle = style({
  padding: "20px",
});

const titleStyle = style({
  fontSize: "32px",
  fontWeight: "600",
  color: colors.mywhite,
  marginBottom: "10px",
});

const textStyle = style({
  fontSize: "16px",
  color: colors.mywhite,
});
