import { useMemo, useState, type ReactNode } from 'react'
import { ThemeContext } from '../config/ThemeContext'
import { THEME_KEY } from 'shared/lib/consts/themeConst';

export type ThemeTypes = 'light' | 'dark'


interface ThemeProviderProps {
   children: ReactNode;
}

document.body.className = localStorage.getItem(THEME_KEY) || 'light';

export const ThemeProvider = ({ children }: ThemeProviderProps) => {

   const [Theme, setTheme] = useState<ThemeTypes>(
      localStorage.getItem(THEME_KEY) as ThemeTypes || 'light'
   )


   const defaultProps = useMemo(() => ({
      theme: Theme,
      setTheme: setTheme,
   }), [Theme])

   return (
      <ThemeContext.Provider value={defaultProps}>
         {children}
      </ThemeContext.Provider>
   )
}
