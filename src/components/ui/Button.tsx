import React from "react";
import { style, classes, keyframes } from "typestyle";
import { colors } from "../common/Colors";

interface ButtonProps {
  text: string;
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  marginTop?: string;
}

export const Button: React.FC<ButtonProps> = ({
  text,
  variant = "primary",
  size = "medium",
  onClick,
  disabled = false,
  isLoading = false,
  marginTop,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={classes(baseButton, variants[variant], sizes[size], marginTop ? style({ marginTop }) : null)}
    >
      {
        isLoading ? (
          <div className={loadingContainer}>
            <div className={spinner} />
          </div>
        ) : (
          text.toUpperCase()
        )
      }
    </button>
  );
};

const baseButton = style({
  marginTop: 5,
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: 500,
  transition: "all 0.2s ease",
  $nest: {
    "&:hover": {
      opacity: 0.9,
    },
    "&:disabled": {
      opacity: 0.6,
      cursor: "not-allowed",
    },
  },
});

const variants = {
  primary: style({
    backgroundColor: colors.primary,
    color: colors.white,
  }),

  secondary: style({
    backgroundColor: colors.mywhite,
    color: colors.secondary,
  }),
};

const sizes = {
  small: style({
    padding: "6px 12px",
    fontSize: "12px",
  }),

  medium: style({
    padding: "10px 20px",
    fontSize: "14px",
  }),

  large: style({
    padding: "14px 26px",
    fontSize: "16px",
  }),
};

const loadingContainer = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
});

const spin = keyframes({
  from: {
    transform: "rotate(0deg)",
  },
  to: {
    transform: "rotate(360deg)",
  },
});

const spinner = style({
  width: "16px",
  height: "16px",
  border: "2px solid rgba(255,255,255,0.4)",
  borderTop: "2px solid white",
  borderRadius: "50%",
  animationName: spin,
  animationDuration: "0.8s",
  animationIterationCount: "infinite",
  animationTimingFunction: "linear",
});