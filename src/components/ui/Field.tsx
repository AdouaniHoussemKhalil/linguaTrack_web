import { style } from "typestyle";
import { colors } from "../common/Colors";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={fieldStyle}>
      <label className={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

const fieldStyle = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  flex: 1,
});

const labelStyle = style({
  fontSize: "13px",
  fontWeight: 500,
});

export const inputStyle = style({
  padding: "10px 12px",
  borderRadius: "8px",
  backgroundColor: colors.mywhite,
  border: "1px solid transparent",
  fontSize: "14px",
  transition: "all .2s",

  $nest: {
    "&:focus": {
      outline: "none",
      border: `1px solid${colors.primary}`,
      backgroundColor: colors.white,
    },
  },
});