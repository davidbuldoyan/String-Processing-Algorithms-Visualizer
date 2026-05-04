import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const languages = [
  { code: 'en', flag: '/us.png', native: 'English' },
  { code: 'hy', flag: '/am.png', native: 'Հայերեն' },
] as const

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const current = languages.find((l) => l.code === i18n.language) ?? languages[0]

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          'flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-sm font-medium shadow-sm backdrop-blur transition-all',
          open
            ? 'border-algo-window/50 bg-algo-window/10 text-algo-window ring-2 ring-algo-window/20 dark:border-blue-400/50 dark:bg-blue-500/15 dark:text-blue-300'
            : 'border-slate-200/80 bg-white/60 text-slate-700 hover:border-slate-300 hover:bg-white/80 dark:border-slate-700/80 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800/80',
        ].join(' ')}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <img src={current.flag} alt="" className="h-4 w-6 rounded-sm object-cover shadow-sm" />
        <span className="hidden sm:inline">{current.native}</span>
        <svg
          className={['h-3.5 w-3.5 transition-transform duration-200', open ? 'rotate-180' : ''].join(' ')}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 z-50 mt-2 w-44 origin-top-right animate-[dropdown-in_150ms_ease-out] rounded-xl border border-white/50 bg-white/80 p-1 shadow-xl shadow-slate-900/10 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/90 dark:shadow-black/30"
          role="listbox"
          aria-activedescendant={current.code}
        >
          {languages.map((lang) => {
            const active = lang.code === i18n.language
            return (
              <button
                key={lang.code}
                type="button"
                role="option"
                id={lang.code}
                aria-selected={active}
                onClick={() => {
                  void i18n.changeLanguage(lang.code)
                  setOpen(false)
                }}
                className={[
                  'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-algo-window/12 text-algo-window dark:bg-blue-500/20 dark:text-blue-300'
                    : 'text-slate-700 hover:bg-slate-100/80 dark:text-slate-200 dark:hover:bg-slate-800/60',
                ].join(' ')}
              >
                <img src={lang.flag} alt="" className="h-4 w-6 rounded-sm object-cover shadow-sm" />
                <span className="flex-1 text-left">{lang.native}</span>
                {active && (
                  <svg className="h-4 w-4 text-algo-window dark:text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
