import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './i18n'
import { getInitialTheme } from './store/themeStore'
import { useVisualizerStore } from './store/visualizerStore'

document.documentElement.classList.toggle('dark', getInitialTheme() === 'dark')

if (import.meta.env.DEV) {
  void useVisualizerStore.getState()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
