import Card from "@/components/ui/Card";
import { style } from "typestyle";
import { colors } from "@/components/common/Colors";

const processingTimeContainerStyle = style({
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

interface ProcessingTimeComponentProps {
  time: number;
}

const ProcessingTimeComponent: React.FC<ProcessingTimeComponentProps> = ({
  time,
}) => {
  return (
    <Card width="small" header="Temp d'éxecution">
      <div className={processingTimeContainerStyle}>
        <span className={valueStyle}>{time.toFixed(2)}</span>
        <span className={labelStyle}>Secondes</span>
      </div>
      {/* <div className={infoStyle(colors.blue)}>
        <p>Rapide</p>
      </div> */}
    </Card>
  );
};

export default ProcessingTimeComponent;
