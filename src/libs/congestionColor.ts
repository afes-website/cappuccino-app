import { PaletteType } from "@material-ui/core";
import {
  red,
  yellow,
  purple,
  orange,
  grey,
  lightGreen,
  lightBlue,
} from "@material-ui/core/colors";
import { PaletteColor } from "@material-ui/core/styles/createPalette";
import {
  generateDarkPaletteColor,
  generateLightPaletteColor,
} from "libs/paletteColor";

const congestionColor = (
  congestion: number,
  type: PaletteType
): PaletteColor => {
  const generatePaletteColor =
    type === "light" ? generateLightPaletteColor : generateDarkPaletteColor;

  if (congestion > 1.0) return generatePaletteColor(purple);
  if (congestion > 0.8) return generatePaletteColor(red);
  if (congestion > 0.6) return generatePaletteColor(orange);
  if (congestion > 0.4) return generatePaletteColor(yellow);
  if (congestion > 0.2) return generatePaletteColor(lightGreen);
  if (congestion > 0.0) return generatePaletteColor(lightBlue);
  return generatePaletteColor(grey);
};

export default congestionColor;
