import Card from "@/components/ui/Card";
import { style } from "typestyle";
import { colors } from "@/components/common/Colors";
import { StringHelper } from "@/utils/helper";

const totalErrorsContainerStyle = style({
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
  $nest: {
    "@media (max-width: 600px)": {
      fontSize: "32px",
    },
  },
});

const labelStyle = style({
  fontSize: "14px",
  fontWeight: 500,
  color: colors.gray,
  marginBottom: "6px",
  $nest: {
    "@media (max-width: 600px)": {
      fontSize: "12px",
    },
  },
});

const infoStyle = (color?: string) =>
  style({
    display: "flex",
    gap: "6px",
    fontSize: "12px",
    color: color || colors.gray,
    marginTop: "8px",
    fontWeight: 600,
  });

interface TotalErrorsComponentProps {
  number: number;
  average: number;
}

const TotalErrorsComponent: React.FC<TotalErrorsComponentProps> = ({
  number,
  average = 0
}) => {
  return (
    <Card width="small" header="Nombre d'erreurs">
      <div className={totalErrorsContainerStyle}>
        <span className={valueStyle}>{StringHelper.formatTwoDigits(number)}</span>
        <span className={labelStyle}>Total</span>
      </div>
      <div className={infoStyle(colors.error)}>
        <p>{`${average} ERREURS PAR TEXT `}</p>
      </div>
    </Card>
  );
};

export default TotalErrorsComponent;
