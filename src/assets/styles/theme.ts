import { Theme, createMuiTheme } from "@material-ui/core";
import { afesDark, afesLight } from "@/assets/styles/origPalette";
import { PaletteOptions } from "@material-ui/core/styles/createPalette";
import deepmerge from "deepmerge";
import { ComponentsProps } from "@material-ui/core/styles/props";

const lightPalette: PaletteOptions = {
  primary: afesDark,
  secondary: afesDark,
};

const darkPalette: PaletteOptions = {
  type: "dark",
  primary: afesDark,
  secondary: afesLight,
};

const props: ComponentsProps = {
  MuiCheckbox: {
    color: "secondary",
  },
  MuiList: {
    dense: true,
  },
  MuiRadio: {
    color: "secondary",
  },
  MuiSwitch: {
    color: "secondary",
  },
  MuiTable: {
    size: "small",
  },
  MuiTextField: {
    variant: "outlined",
  },
};

const typography = {
  fontFamily: ["Roboto", "'Noto Sans JP'", "sans-serif"].join(","),
  button: {
    textTransform: "none",
  },
};

export const themeLight: Theme = createMuiTheme(
  deepmerge.all([
    { palette: lightPalette },
    { props: props },
    { typography: typography },
  ])
);

export const themeDark: Theme = createMuiTheme(
  deepmerge.all([
    { palette: darkPalette },
    { props: props },
    { typography: typography },
  ])
);

export default { light: themeLight, dark: themeDark };