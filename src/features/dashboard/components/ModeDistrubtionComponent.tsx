import Card from "@/components/ui/Card";
import CircularProgress from "@/components/ui/CircularProgress";
import ProgressBar from "@/components/ui/ProgressBar";
import { style } from "typestyle";

const modeDistributionContainerStyle = style({
  display: "block",
  gap: "5px",
});

interface ModeDistributionProps {
  modes?: Record<string, number>;
  modePercentages?: Record<string, number>;
}

const ModeDistributionComponent: React.FC<ModeDistributionProps> = ({
  modes,
  modePercentages,
}) => {
  if (!modes || !modePercentages) {
    return <div></div>;
  }
  const modesCount = Object.keys(modePercentages).length;

  return (
    <Card
      width="small"
      fullHeight
      header=<div style={{ fontWeight: "bold", fontSize: "20px" }}>
        {" "}
        Mode de distribution
      </div>
    >
      <div className={modeDistributionContainerStyle}>
        {modesCount === 1 ? (
          <div style={{ marginTop: 70 }}>
            <CircularProgress
              title={`${Object.keys(modes)[0]} (${modes[Object.keys(modes)[0]]})`}
              score={100}
              displayMode="percentage"
            />
          </div>
        ) : (
          Object.entries(modePercentages).map(([title, value], index) => (
            <ProgressBar
              key={index}
              title={`${title} (${modes[title]})`}
              value={value}
              style={{ marginTop: "20px" }}
              showPercentage={false}
            />
          ))
        )}
      </div>
    </Card>
  );
};

export default ModeDistributionComponent;
