import React from "react";
import { style } from "typestyle";
import { colors } from "@/components/common/Colors";

interface CircularProgressProps {
  title?: string;
  score: number;
  maxScore?: number;
  displayMode?: "fraction" | "percentage" | "scoreOnly";
  displayRemark?: boolean;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  title,
  score,
  maxScore = 100,
  displayMode = "fraction",
  displayRemark = false,
}) => {
  const percentage = Math.min((score / maxScore) * 100, 100);

  const size = 130;
  const strokeWidth = 12;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const offset = circumference - (percentage / 100) * circumference;

  const getLabel = () => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Très bien";
    if (score >= 40) return "En progression";
    return "Débutant";
  };

  return (
    <div>
      <div className={circleWrapperStyle}>
        <svg width={size} height={size}>
          {/* Cercle de fond */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            style={{ stroke: colors.border }}
            strokeWidth={strokeWidth}
          />

          {/* Cercle de progression */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            style={{ stroke: colors.primary }}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>

        <div className={scoreStyle}>
          {displayMode === "percentage" && (
            <div className={scoreValueStyle}>{Math.round(percentage)}%</div>
          )}

          {displayMode === "scoreOnly" && (
            <div className={scoreValueStyle}>{score}</div>
          )}

          {displayMode === "fraction" && (
            <>
              <div className={scoreValueStyle}>{score}</div>
              <div className={scoreMaxStyle}>/{maxScore}</div>
            </>
          )}
          {title && (
            <div
              style={{
                fontSize: "14px",
                margin: "10px",
                fontWeight: 100,
                color: colors.mygray,
              }}
            >
              {title}
            </div>
          )}
        </div>
      </div>

      {displayRemark && <div className={labelStyle}>{getLabel()}</div>}
    </div>
  );
};

export default CircularProgress;

/* ===========================
   STYLES
=========================== */

const circleWrapperStyle = style({
  position: "relative",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const scoreStyle = style({
  position: "absolute",

  display: "flex",
  flexDirection: "column",

  alignItems: "center",
  justifyContent: "center",
});

const scoreValueStyle = style({
  fontSize: "30px",
  fontWeight: 700,
  color: colors.primary,
  lineHeight: 1,
});

const scoreMaxStyle = style({
  fontSize: "13px",
  color: colors.gray,
  marginTop: "2px",
});

const labelStyle = style({
  marginTop: "16px",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  fontSize: "12px",
  fontWeight: 600,

  color: colors.white,
  backgroundColor: colors.primary,
  padding: "20px",
  borderRadius: "10px",
  height: "40px",
});
