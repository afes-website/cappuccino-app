import { useMemo, useState } from "react";
import createCtx from "@/libs/createCtx";
import { themeOptions } from "@/assets/styles/theme";
import { createMuiTheme, Theme } from "@material-ui/core";

const storage_key_mode = "theme_mode";

export type ThemeMode = "light" | "dark";

const getThemeModeFromLocalStorage = (): ThemeMode | undefined => {
  const _mode = localStorage.getItem(storage_key_mode);
  if (_mode === "light" || _mode === "dark") return _mode;
  return undefined;
};

const setThemeModeToLocalStorage = (mode: ThemeMode): void => {
  localStorage.setItem(storage_key_mode, mode);
};

export const [useThemeContext, ThemeContextProvider] = createCtx<{
  setThemeMode: (mode: ThemeMode) => void;
}>();

export const ThemeCtx = {
  useThemeContext,
  ThemeContextProvider,
};

export const useTheme = (): [Theme, (mode: ThemeMode) => void] => {
  const [mode, setMode] = useState<ThemeMode>(
    getThemeModeFromLocalStorage() || "light"
  );

  const setThemeMode = (mode: ThemeMode) => {
    setMode(mode);
    setThemeModeToLocalStorage(mode);
  };

  const theme: Theme = useMemo(() => createMuiTheme(themeOptions[mode]), [
    mode,
  ]);

  return [theme, setThemeMode];
};

export const useSetThemeMode = (): ((mode: ThemeMode) => void) => {
  const Theme = useThemeContext();
  return Theme.setThemeMode;
};

export default { useSetThemeMode, ThemeCtx };
