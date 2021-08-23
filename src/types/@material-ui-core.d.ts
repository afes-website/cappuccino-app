import "@material-ui/core/styles/createPalette";

declare module "@material-ui/core/styles/createPalette" {
  export interface Palette {
    afesDark: Palette["primary"];
    afesBlue: Palette["primary"];
    afesLight: Palette["primary"];
  }
  export interface PaletteOptions {
    afesDark?: PaletteOptions["primary"];
    afesBlue?: PaletteOptions["primary"];
    afesLight?: PaletteOptions["primary"];
  }
}
