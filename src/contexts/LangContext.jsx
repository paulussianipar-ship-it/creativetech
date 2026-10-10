import { createContext, useContext, useState, useEffect } from 'react'
import { en, id } from '../lib/i18n'

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'id')

  useEffect(() => {
    localStorage.setItem('lang', lang)
  }, [lang])

  const t = lang === 'en' ? en : id

  const toggle = () => setLang(l => l === 'en' ? 'id' : 'en')

  return (
    <LangContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside LangProvider')
  return ctx
}
