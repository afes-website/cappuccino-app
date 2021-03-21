import createCtx from "@/libs/createCtx";
import { Theme } from "@material-ui/core";

const storage_key_mode = "theme_mode";

export type ThemeType = "light" | "dark";

export const getThemeModeFromLocalStorage = (): ThemeType | undefined => {
  const _mode = localStorage.getItem(storage_key_mode);
  if (_mode === "light" || _mode === "dark") return _mode;
  return undefined;
};

export const setThemeModeToLocalStorage = (mode: ThemeType): void => {
  localStorage.setItem(storage_key_mode, mode);
};

export const useToggleTheme = (): ((mode: ThemeType) => void) => {
  const toggleThemeContext = useToggleThemeContext();

  return toggleThemeContext._setTheme;
};

export const [useToggleThemeContext, ToggleThemeContextProvider] = createCtx<{
  theme: Theme;
  _setTheme: (mode: ThemeType) => void;
}>();

export const ToggleThemeCtx = {
  useToggleThemeContext,
  ToggleThemeContextProvider,
};

export default { useToggleTheme, ToggleThemeCtx };
