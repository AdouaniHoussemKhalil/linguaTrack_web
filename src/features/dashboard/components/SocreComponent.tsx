import Card from "@/components/ui/Card";
import { style } from "typestyle";
import { colors } from "@/components/common/Colors";

const scoreContainerStyle = style({
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



// const infoStyle = (color?: string) =>
//   style({
//     display: "flex",
//     gap: "6px",
//     fontSize: "12px",
//     color: color || colors.gray,
//     marginTop: "8px",
//     fontWeight: 600,
//   });

interface ScoreComponentProps {
  score: number;
}

const ScoreComponent: React.FC<ScoreComponentProps> = ({ score }) => {
  return (
    <Card width="small" header="Score moyen">
      <div className={scoreContainerStyle}>
        <span className={valueStyle}>{score.toFixed(2)} % </span>
      </div>
      {/* <div className={infoStyle(colors.blue)}>
        <p>+2.4 % par rapport à la semaine dernière</p>
      </div> */}
    </Card>
  );
};

export default ScoreComponent;
