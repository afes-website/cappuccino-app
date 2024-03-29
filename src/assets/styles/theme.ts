import { Theme, createMuiTheme } from "@material-ui/core";
import { PaletteOptions } from "@material-ui/core/styles/createPalette";
import { TypographyOptions } from "@material-ui/core/styles/createTypography";
import { Overrides } from "@material-ui/core/styles/overrides";
import { ComponentsProps } from "@material-ui/core/styles/props";
import { afesBlue, afesDark, afesLight } from "assets/styles/origPalette";

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
  background: {
    default: "#000000",
    paper: "#1c1c1d",
  },
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
    variant: "elevation",
  },
};

const overrides: Overrides = {};

const typography: TypographyOptions = {
  fontFamily: ["Roboto", "'Noto Sans JP'", "sans-serif"].join(","),
  button: {
    textTransform: "none",
  },
};

export const themeLightOptions = {
  palette: lightPalette,
  props,
  overrides,
  typography,
};

export const themeDarkOptions = {
  palette: darkPalette,
  props,
  overrides,
  typography,
};

export const themeOptions = {
  light: themeLightOptions,
  dark: themeDarkOptions,
};

export const themeLight: Theme = createMuiTheme(themeLightOptions);

export const themeDark: Theme = createMuiTheme(themeDarkOptions);

export default { light: themeLight, dark: themeDark };
