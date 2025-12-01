import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app/styles/index.scss'
import App from 'app/App'
import { ThemeProvider } from 'app/providers/themeProvider/ui/ThemeProvider'

createRoot(document.getElementById('root')!).render(
   <StrictMode>
      <ThemeProvider>
         <App />
      </ThemeProvider>
   </StrictMode>,
)
