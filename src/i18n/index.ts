import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { en } from './en'
import { hy } from './hy'

export const resources = {
  en: { translation: en },
  hy: { translation: hy },
} as const

const storedLanguage = localStorage.getItem('language')
const browserLanguage = navigator.language.toLowerCase().startsWith('hy') ? 'hy' : 'en'

void i18n.use(initReactI18next).init({
  resources,
  lng: storedLanguage === 'hy' || storedLanguage === 'en' ? storedLanguage : browserLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

i18n.on('languageChanged', (language) => {
  localStorage.setItem('language', language)
  document.documentElement.lang = language
})

document.documentElement.lang = i18n.language

export default i18n
