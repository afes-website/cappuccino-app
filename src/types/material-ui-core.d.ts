import {
  Palette,
  PaletteOptions,
} from "@material-ui/core/styles/createPalette";

declare module "@material-ui/core/styles/createPalette" {
  interface Palette {
    afesDark: Palette["primary"];
    afesBlue: Palette["primary"];
    afesLight: Palette["primary"];
  }
  interface PaletteOptions {
    afesDark: PaletteOptions["primary"];
    afesBlue: PaletteOptions["primary"];
    afesLight: PaletteOptions["primary"];
  }
}
