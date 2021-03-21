import createCtx from "@/libs/createCtx";

const storage_key_mode = "theme_mode";

export type ThemeMode = "light" | "dark";

export const getThemeModeFromLocalStorage = (): ThemeMode | undefined => {
  const _mode = localStorage.getItem(storage_key_mode);
  if (_mode === "light" || _mode === "dark") return _mode;
  return undefined;
};

export const setThemeModeToLocalStorage = (mode: ThemeMode): void => {
  localStorage.setItem(storage_key_mode, mode);
};

export const useSwitchTheme = (): ((mode: ThemeMode) => void) => {
  const switchThemeContext = useSwitchThemeContext();
  return switchThemeContext._setTheme;
};

export const [useSwitchThemeContext, SwitchThemeContextProvider] = createCtx<{
  _setTheme: (mode: ThemeMode) => void;
}>();

export const SwitchThemeCtx = {
  useSwitchThemeContext,
  SwitchThemeContextProvider,
};

export default { useSwitchTheme, SwitchThemeCtx };
