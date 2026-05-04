import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '../../store/themeStore'

export function ThemeToggle() {
  const { t } = useTranslation()
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-lg border border-slate-200/80 bg-white/50 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition hover:bg-white/80 dark:border-slate-700/80 dark:bg-slate-900/50 dark:text-slate-200 dark:hover:bg-slate-900/80"
      aria-label={theme === 'dark' ? t('theme.switchToLight') : t('theme.switchToDark')}
    >
      {theme === 'dark' ? t('theme.light') : t('theme.dark')}
    </button>
  )
}
