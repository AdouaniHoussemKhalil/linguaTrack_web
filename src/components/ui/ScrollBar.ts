import { style } from "typestyle";
import { colors } from "../common/Colors";

export const CustomScrollBar = (color?: string, bgColor?: string) => {
  const scrollColor = color || colors.primary;
  const hoverColor = color || colors.blue;
  const scrollBgColor = bgColor || colors.error;

  return style({
    overflow: "auto",
    $nest: {
      "&": {
        ['scrollbar-color' as never]: `${scrollColor} ${scrollBgColor}`,
        ['scrollbar-width' as never]: 'thin',
      },
      '&::-webkit-scrollbar': {
        width: 6,
        height: 6
      },
      '&::-webkit-scrollbar-track': {
        borderRadius: '20px',
        background: scrollBgColor,
        width: 4
      },
      '&::-webkit-scrollbar-thumb': {
        background: scrollColor,
        borderRadius: '12px'
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: hoverColor
      }
    },
  });
};

export const ScrollBar = CustomScrollBar();
