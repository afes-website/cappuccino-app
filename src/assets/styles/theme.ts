import { Theme, createMuiTheme } from "@material-ui/core";
import { afesBlue, afesDark, afesLight } from "@/assets/styles/origPalette";
import { PaletteOptions } from "@material-ui/core/styles/createPalette";
import deepmerge from "deepmerge";
import { ComponentsProps } from "@material-ui/core/styles/props";
import { Overrides } from "@material-ui/core/styles/overrides";

const lightPalette: PaletteOptions = {
  primary: afesDark,
  secondary: afesDark,
  afesBlue,
  afesDark,
  afesLight,
};

const darkPalette: PaletteOptions = {
  type: "dark",
  primary: afesDark,
  secondary: afesLight,
  afesBlue,
  afesDark,
  afesLight,
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
    variant: "standard",
  },
  MuiCard: {
    variant: "outlined",
  },
};

const overrides: Overrides = {};

const typography = {
  fontFamily: ["Roboto", "'Noto Sans JP'", "sans-serif"].join(","),
  button: {
    textTransform: "none",
  },
};

export const themeLight: Theme = createMuiTheme(
  deepmerge.all([
    { palette: lightPalette },
    { props },
    { overrides },
    { typography },
  ])
);

export const themeDark: Theme = createMuiTheme(
  deepmerge.all([
    { palette: darkPalette },
    { props },
    { overrides },
    { typography },
  ])
);

export default { light: themeLight, dark: themeDark };
