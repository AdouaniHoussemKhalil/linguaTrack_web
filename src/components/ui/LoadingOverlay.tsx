import React from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { style, keyframes } from "typestyle";
import { colors } from "../common/Colors";

const LoadingOverlay: React.FC = () => {
  const fetching = useIsFetching();
  const mutating = useIsMutating();

  const loading = fetching > 0 || mutating > 0;

  if (!loading) return null;

  return (
    <div className={overlayStyle}>
      <div className={spinner} />
    </div>
  );
};

export default LoadingOverlay;

const overlayStyle = style({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.25)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
});

const spin = keyframes({
  from: { transform: "rotate(0deg)" },
  to: { transform: "rotate(360deg)" },
});

const spinner = style({
  width: "64px",
  height: "64px",
  border: `6px solid rgba(255,255,255,0.4)`,
  borderTop: `6px solid ${colors.primary}`,
  borderRadius: "50%",
  animationName: spin,
  animationDuration: "1s",
  animationIterationCount: "infinite",
  animationTimingFunction: "linear",
});
