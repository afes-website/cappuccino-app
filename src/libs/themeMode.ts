import { useMemo, useState } from "react";
import { Theme, createMuiTheme } from "@material-ui/core";
import createCtx from "libs/createCtx";
import { themeOptions } from "assets/styles/theme";

export type UseSetThemeMode = "light" | "dark";

/* ======== Local Storage ======== */

const storage_key_mode = "theme_mode";

const getThemeModeFromLocalStorage = (): UseSetThemeMode | undefined => {
  const _mode = localStorage.getItem(storage_key_mode);
  if (_mode === "light" || _mode === "dark") return _mode;
  return undefined;
};

const setThemeModeToLocalStorage = (mode: UseSetThemeMode): void => {
  localStorage.setItem(storage_key_mode, mode);
};

/* ======== Context ======== */

export const [useThemeContext, ThemeContextProvider] = createCtx<{
  toggleThemeMode: () => void;
}>();

/* ======== Hooks ======== */

export const useThemeMode = (): [Theme, () => void] => {
  const [mode, setMode] = useState<UseSetThemeMode>(
    getThemeModeFromLocalStorage() ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
  );

  const theme: Theme = useMemo(
    () => createMuiTheme(themeOptions[mode]),
    [mode]
  );

  const toggleThemeMode = () => {
    const _mode = mode === "light" ? "dark" : "light";
    setMode(_mode);
    setThemeModeToLocalStorage(_mode);
  };

  return [theme, toggleThemeMode];
};

export const useSetThemeMode = (): (() => void) => {
  const Theme = useThemeContext();
  return Theme.toggleThemeMode;
};
