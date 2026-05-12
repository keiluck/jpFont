import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { Lang } from '../../types'
import './QuizPage.css'

const CATEGORIES = [
  { id: 'AWS', label: 'AWS', icon: '☁️', desc: 'AWS 云计算认证题库' },
  { id: 'IT', label: 'IT', icon: '💻', desc: 'IT 技术基础题库' },
  { id: 'JAPANESE', label: '日語', icon: '🇯🇵', desc: '日语能力考试题库' },
]

const LANG_LABELS: Record<Lang, string> = { zh: '中文', ja: '日本語', en: 'English' }

export default function QuizPage() {
  const navigate = useNavigate()
  const { lang, setLang } = useLanguage('zh')

  return (
    <div className="quiz-page">
      <header className="quiz-header">
        <button className="back-btn" onClick={() => navigate('/')}>← 返回首页</button>
        <h1 className="quiz-title">分类刷题</h1>
        <div className="lang-switcher">
          {(['zh', 'ja', 'en'] as Lang[]).map((l) => (
            <button
              key={l}
              className={`lang-btn${lang === l ? ' active' : ''}`}
              onClick={() => setLang(l)}
            >
              {LANG_LABELS[l]}
            </button>
          ))}
        </div>
      </header>

      <main className="quiz-main">
        <p className="quiz-subtitle">当前语言：{LANG_LABELS[lang]}　选择分类开始答题</p>
        <div className="quiz-category-grid">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className="quiz-category-card"
              onClick={() => navigate(`/quiz/${cat.id}?lang=${lang}`)}
            >
              <span className="qcat-icon">{cat.icon}</span>
              <span className="qcat-label">{cat.label}</span>
              <span className="qcat-desc">{cat.desc}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
