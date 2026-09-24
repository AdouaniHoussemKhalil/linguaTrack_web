import Card from "@/components/ui/Card";
import { style } from "typestyle";
import { colors } from "@/components/common/Colors";
import { StringHelper } from "@/utils/helper";

const totalTextsContainerStyle = style({
  display: "flex",
  alignItems: "flex-end",
  gap: "10px",
  paddingTop: "10px",
});

const valueStyle = style({
  fontSize: "48px",
  fontWeight: 700,
  lineHeight: 1,
  color: colors.primary,
});

const labelStyle = style({
  fontSize: "14px",
  fontWeight: 500,
  color: colors.gray,
  marginBottom: "6px",
});

// const infoStyle = (color?: string) =>
//   style({
//     display: "flex",
//     gap: "6px",
//     fontSize: "12px",
//     color: color || colors.gray,
//     marginTop: "8px",
//     fontWeight: 600,
//   });

interface TotalTextsComponentProps {
  totalTexts: number;
}

const TotalTextsComponent: React.FC<TotalTextsComponentProps> = ({
  totalTexts,
}) => {
  return (
    <Card width="small" header="Nombre de textes">
      <div className={totalTextsContainerStyle}>
        <span className={valueStyle}>{StringHelper.formatTwoDigits(totalTexts)}</span>
        <span className={labelStyle}>Analysés</span>
      </div>
      {/* <div className={infoStyle(colors.blue)}>
        <p>+12 cette semaine</p>
      </div> */}
    </Card>
  );
};

export default TotalTextsComponent;
