import { GuestType } from "@afes-website/docs";
import { Theme, useTheme, PaletteType } from "@material-ui/core";
import { PaletteColor } from "@material-ui/core/styles/createPalette";
import {
  blue,
  red,
  yellow,
  green,
  purple,
  orange,
  grey,
} from "@material-ui/core/colors";

const white = "#ffffff";
const black = "#000000";

const generateLightPaletteColor = (color: {
  300: string;
  500: string;
  700: string;
}): PaletteColor => ({
  light: color[300],
  main: color[500],
  dark: color[700],
  contrastText: white,
});

const generateDarkPaletteColor = (color: {
  100: string;
  200: string;
  300: string;
}): PaletteColor => ({
  light: color[100],
  main: color[200],
  dark: color[300],
  contrastText: black,
});

export const wristBandPaletteColor = (
  prefix: GuestType,
  type: PaletteType
): PaletteColor => {
  const generatePaletteColor =
    type === "light" ? generateLightPaletteColor : generateDarkPaletteColor;
  switch (prefix) {
    case "GuestBlue":
    case "TestBlue":
      return generatePaletteColor(blue);
    case "GuestRed":
    case "TestRed":
      return generatePaletteColor(red);
    case "GuestYellow":
    case "TestYellow":
      return generatePaletteColor(yellow);
    case "GuestGreen":
      return generatePaletteColor(green);
    case "GuestPurple":
      return generatePaletteColor(purple);
    case "GuestOrange":
      return generatePaletteColor(orange);
    case "GuestWhite":
      return {
        light: grey[50],
        main: grey[100],
        dark: grey[200],
        contrastText: black,
      };
    case "StudentGray":
      return generatePaletteColor(grey);
  }
};

export const useWristBandPaletteColor = (): ((
  guestType: GuestType
) => PaletteColor) => {
  const theme = useTheme<Theme>();
  return (guestType) => wristBandPaletteColor(guestType, theme.palette.type);
};
