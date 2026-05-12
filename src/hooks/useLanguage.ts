import { useState } from 'react'
import { Lang } from '../types'

const LANG_LABELS: Record<Lang, string> = {
  zh: '中文',
  ja: '日本語',
  en: 'English',
}

export function useLanguage(defaultLang: Lang = 'zh') {
  const [lang, setLang] = useState<Lang>(defaultLang)
  return { lang, setLang, langLabels: LANG_LABELS }
}
