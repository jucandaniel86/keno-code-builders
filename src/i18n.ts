import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import ro from './locales/ro.json'

export const i18n = createI18n({
  locale: import.meta.env.VITE_DEFAULT_LOCALE,
  fallbackLocale: import.meta.env.VITE_FALLBACK_LOCALE,
  legacy: false,
  globalInjection: true,
  warnHtmlMessage: false,
  availableLocales: ['en', 'ro'],
  messages: {
    en,
    ro,
  },
})
