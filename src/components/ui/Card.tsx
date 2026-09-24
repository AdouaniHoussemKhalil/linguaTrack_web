import { colors } from "@/components/common/Colors";
import React from "react";
import { style, classes } from "typestyle";

const cardStyle = style({
  backgroundColor: colors.white,
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  padding: "20px",
  display: "flex",
  flexDirection: "column",  

  transition: "all 0.25s ease",

  $nest: {
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    },
  },
});

const noHoverStyle = style({
  $nest: {
    "&:hover": {
      transform: "none",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
  },
});

const Card = ({
  header,
  children,
  width = "medium",
  hoverable = true,
  fullHeight = false,
}: {
  header?: React.ReactNode;
  children: React.ReactNode;
  width?: "small" | "medium" | "large";
  hoverable?: boolean;
  fullHeight?: boolean;
}) => {
  return (
    <div
      className={classes(cardStyle, !hoverable && noHoverStyle)}
      style={{
        height: fullHeight ? '100%' : '',
        minWidth:
          width === "medium" ? "280px" : width === "large" ? "400px" : "120px",

        flex:
          width === "medium"
            ? "3 1 300px"
            : width === "large"
              ? "7 1 600px"
              : "1 1 120px",
      }}
    >
      <div
        style={{
          marginBottom: "12px",
        }}
      >
        {header}
      </div>

      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
};

export default Card;
