import { ThemeContext } from 'app/providers/themeProvider/config/ThemeContext'
import { useContext } from 'react'
import { classNames } from 'shared/lib/classNames/classNames';
import { THEME_KEY } from 'shared/lib/consts/themeConst'
import styles from './ThemeSwitcher.module.scss'
import LightIcon from 'shared/assets/icons/lighttheme.svg'
import DarkIcon from 'shared/assets/icons/darktheme.svg'

interface ThemeSwitcherProps {
   className?: string;
}

export const ThemeSwitcher = ({ className }: ThemeSwitcherProps) => {
   const { setTheme, theme } = useContext(ThemeContext)

   if (!setTheme || !theme) return null;

   const themeSwithcer = () => {
      const newTheme = theme === 'dark' ? 'light' : 'dark'
      setTheme(newTheme)
      document.body.className = newTheme
      localStorage.setItem(THEME_KEY, newTheme)
   }

   return (
      <button onClick={themeSwithcer} className={classNames(styles.Button, {}, [className])}>
         {theme === 'dark' ? <LightIcon /> : <DarkIcon />}
      </button>
   )
}
