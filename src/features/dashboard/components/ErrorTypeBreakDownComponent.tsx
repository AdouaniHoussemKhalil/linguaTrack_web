import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import { style } from "typestyle";

interface ErrorTypeBreakDownProps {
  errorTypeNumbers?: Record<string, number>;
  errorTypePercentages?: Record<string, number>;
}

const ErrorTypeBreakDownComponent: React.FC<ErrorTypeBreakDownProps> = ({
  errorTypeNumbers ,
  errorTypePercentages
}) => {

  if(!errorTypeNumbers || !errorTypePercentages){
    return(     
      <div></div>
    )
  }

  return (
    <Card
      width="medium"
      header={
        <div style={{ fontWeight: "bold", fontSize: "20px" }}>
          Types d'erreurs
        </div>
      }
    >
      <div className={errorTypeBreakDownContainerStyle}>
        {Object.entries(errorTypePercentages).map(([title, value], index) => (
          <div key={index} className={progressItemStyle}>
            <ProgressBar displayMode="percentage" title={`${title} (${errorTypeNumbers[title]})`} value={value} />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ErrorTypeBreakDownComponent;

/* ===================== STYLES ===================== */

const errorTypeBreakDownContainerStyle = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "16px",
  marginTop: "15px",
});

const progressItemStyle = style({
  width: "calc(50% - 8px)",

  $nest: {
    "@media (max-width: 768px)": {
      width: "100%",
    },
  },
});
