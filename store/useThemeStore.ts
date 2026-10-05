import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'auto';

type ThemeState = {
  theme: Theme;
  setTheme: (t: Theme) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist((set) => ({ theme: 'auto', setTheme: (theme) => set({ theme }) }), { name: 'pw_theme' }),
);
