import { PaletteColor } from "@material-ui/core/styles/createPalette";

const white = "#ffffff";
const black = "#000000";

export const generateLightPaletteColor = (color: {
  300: string;
  500: string;
  700: string;
}): PaletteColor => ({
  light: color[300],
  main: color[500],
  dark: color[700],
  contrastText: white,
});

export const generateDarkPaletteColor = (color: {
  100: string;
  200: string;
  300: string;
}): PaletteColor => ({
  light: color[100],
  main: color[200],
  dark: color[300],
  contrastText: black,
});
