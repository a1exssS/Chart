import { createContext } from "react";

type Theme = 'dark' | 'light'

export interface ThemeContextProps {
   theme?: Theme;
   setTheme?: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({})

export const LOCAL_STORAGE_THEME_KEY = 'theme'