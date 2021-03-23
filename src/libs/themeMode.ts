import { useMemo, useState } from "react";
import createCtx from "@/libs/createCtx";
import { themeOptions } from "@/assets/styles/theme";
import { createMuiTheme, Theme } from "@material-ui/core";

export type ThemeMode = "light" | "dark";

/* ======== Local Storage ======== */

const storage_key_mode = "theme_mode";

const getThemeModeFromLocalStorage = (): ThemeMode | undefined => {
  const _mode = localStorage.getItem(storage_key_mode);
  if (_mode === "light" || _mode === "dark") return _mode;
  return undefined;
};

const setThemeModeToLocalStorage = (mode: ThemeMode): void => {
  localStorage.setItem(storage_key_mode, mode);
};

/* ======== Context ======== */

export const [useThemeContext, ThemeContextProvider] = createCtx<{
  toggleThemeMode: () => void;
}>();

export const ThemeCtx = {
  useThemeContext,
  ThemeContextProvider,
};

/* ======== Hooks ======== */

export const useTheme = (): [Theme, () => void] => {
  const [mode, setMode] = useState<ThemeMode>(
    getThemeModeFromLocalStorage() || "light"
  );

  const theme: Theme = useMemo(() => createMuiTheme(themeOptions[mode]), [
    mode,
  ]);

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

export default { useSetThemeMode, ThemeCtx };
