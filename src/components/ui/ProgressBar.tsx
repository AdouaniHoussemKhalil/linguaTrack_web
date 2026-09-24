import React from "react";
import { style } from "typestyle";
import { colors } from "@/components/common/Colors";

interface ProgressBarProps {
  title?: string;
  value: number;
  maxValue?: number;
  showPercentage?: boolean;
  height?: number;
  style?: React.CSSProperties;
  color?: string;
  displayMode?: "percentage" | "scoreOnly";
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  title,
  value,
  maxValue = 100,
  showPercentage = true,
  height = 12,
  style,
  color = colors.primary,
  displayMode = "scoreOnly",
}) => {
  const percentage = Math.min(Math.max((value / maxValue) * 100, 0), 100);

  return (
    <div style={{ ...style }} className={containerStyle}>
      {(title || showPercentage) && (
        <div className={headerStyle}>
          {title && <span className={titleStyle}>{title}</span>}

          {displayMode === "percentage" && (
            <span className={percentageStyle}>{Math.round(percentage)}{showPercentage && "%"}</span>
          )}

          {displayMode === "scoreOnly" && (
            <span className={percentageStyle}>{value}</span>
          )}
        </div>
      )}

      <div className={trackStyle} style={{ height }}>
        <div
          className={fillStyle}
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

/* ===========================
   STYLES
=========================== */

const containerStyle = style({
  width: "100%",
});

const headerStyle = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  marginBottom: "8px",
});

const titleStyle = style({
  fontSize: "14px",
  fontWeight: 500,
  color: colors.gray,
});

const percentageStyle = style({
  fontSize: "13px",
  fontWeight: 700,
  color: colors.primary,
});

const trackStyle = style({
  width: "100%",

  backgroundColor: "#e5e7eb",

  borderRadius: "999px",

  overflow: "hidden",
});

const fillStyle = style({
  height: "100%",

  borderRadius: "999px",

  transition: "width 0.4s ease",
});
