import { GuestType } from "@afes-website/docs";
import { Theme, useTheme, PaletteType } from "@material-ui/core";
import { PaletteColor } from "@material-ui/core/styles/createPalette";
import {
  blue,
  yellow,
  purple,
  grey,
  green,
  pink,
} from "@material-ui/core/colors";
import {
  generateLightPaletteColor,
  generateDarkPaletteColor,
} from "libs/paletteColor";

const wristBandPaletteColor = (
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
      return generatePaletteColor(pink);
    case "GuestYellow":
    case "TestYellow":
      return generatePaletteColor(yellow);
    case "GuestGreen":
      return generatePaletteColor(green);
    case "ParentPurple":
      return generatePaletteColor(purple);
    case "GuestWhite":
      return {
        light: grey[50],
        main: grey[100],
        dark: grey[200],
        contrastText: "#000000",
      };
    case "StudentGray":
      return generatePaletteColor(grey);
  }
};

const useWristBandPaletteColor = (): ((
  guestType: GuestType
) => PaletteColor) => {
  const theme = useTheme<Theme>();
  return (guestType) => wristBandPaletteColor(guestType, theme.palette.type);
};

export default useWristBandPaletteColor;
