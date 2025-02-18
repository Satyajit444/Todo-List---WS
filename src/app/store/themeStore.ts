import { create } from "zustand";
import { getStoredTheme, setStoredTheme } from "../../utils/themeStorage";

interface ThemeState {
  darkMode: boolean;
  toggleTheme: () => void;
}

const useThemeStore = create<ThemeState>((set) => ({
  darkMode: getStoredTheme(),
  toggleTheme: () => {
    set((state) => {
      const newTheme = !state.darkMode;
      setStoredTheme(newTheme);
      return { darkMode: newTheme };
    });
  },
}));

export default useThemeStore;
