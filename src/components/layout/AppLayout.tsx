import { useTranslation } from 'react-i18next'
import { NavLink, Outlet } from 'react-router-dom'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeToggle } from './ThemeToggle'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-slate-900/90 text-white shadow-sm dark:bg-white/90 dark:text-slate-900'
      : 'text-slate-600 hover:bg-white/60 dark:text-slate-300 dark:hover:bg-slate-800/80',
  ].join(' ')

export function AppLayout() {
  const { t } = useTranslation()
  useKeyboardShortcuts()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 font-sans text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100">
      <header className="glass-header sticky top-0 z-20">
        <div className="mx-auto flex flex-wrap items-center justify-between gap-3 py-4 max-w-6xl 2xl:max-w-7xl px-4 sm:px-6 sm:gap-4">
          <NavLink
            to="/"
            className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 transition hover:opacity-80 dark:text-white"
          >
            {t('app.title')}
          </NavLink>

          <div className="flex flex-wrap items-center gap-2">
            <nav className="flex max-w-[min(100vw-8rem,42rem)] flex-wrap gap-1 overflow-x-auto rounded-xl border border-white/40 bg-white/30 p-1 backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-900/40 sm:max-w-none">
              <NavLink to="/" end className={linkClass}>
                {t('nav.home')}
              </NavLink>
              <NavLink to="/kmp" className={linkClass}>
                KMP
              </NavLink>
              <NavLink to="/rabin-karp" className={linkClass}>
                Rabin–Karp
              </NavLink>
              <NavLink to="/z-function" className={linkClass}>
                Z-function
              </NavLink>
            </nav>
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="mx-auto py-8 sm:py-10 max-w-6xl 2xl:max-w-7xl px-4 sm:px-6">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200/40 bg-white/30 backdrop-blur-sm dark:border-slate-800/40 dark:bg-slate-950/30">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-6 text-xs text-slate-500 dark:text-slate-400 sm:flex-row sm:justify-between sm:px-6 2xl:max-w-7xl">
          <p>{t('app.footerTitle', { year: new Date().getFullYear() })}</p>
          <p className="flex flex-wrap items-center gap-3">
            <span>{t('app.techStack')}</span>
            <span className="hidden sm:inline" aria-hidden>·</span>
            <span>
              <kbd className="rounded bg-slate-200/80 px-1.5 py-0.5 font-mono text-[10px] dark:bg-slate-800">Space</kbd> {t('app.shortcuts.space')}
              <span className="mx-1.5" aria-hidden>·</span>
              <kbd className="rounded bg-slate-200/80 px-1.5 py-0.5 font-mono text-[10px] dark:bg-slate-800">←→</kbd> {t('app.shortcuts.arrows')}
            </span>
          </p>
        </div>
      </footer>
    </div>
  )
}
