import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const LangContext = createContext()

export function LangProvider({ children }) {
  const lang = 'en'
  const [t, setT] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTranslations()
  }, [])

  async function loadTranslations() {
    try {
      setLoading(true)
      const { data } = await axios.get(`/api/translations`)
      setT(data.data)
    } catch (e) {
      console.error('Translation load failed:', e)
    } finally {
      setLoading(false)
    }
  }

  // Deep-access helper: t('hero.heading1')
  function tr(path, fallback = '') {
    const keys = path.split('.')
    let val = t
    for (const k of keys) {
      if (val == null) return fallback
      val = val[k]
    }
    return val ?? fallback
  }

  return (
    <LangContext.Provider value={{ lang, t, tr, loading }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
