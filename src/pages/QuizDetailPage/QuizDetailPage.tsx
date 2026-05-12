import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Question, Lang, QuestionOption } from '../../types'
import { useLanguage } from '../../hooks/useLanguage'
import './QuizDetailPage.css'

// mock 数据（后端联调后替换）
const MOCK_QUESTION: Question = {
  id: 1, category: 'AWS', difficulty: 'EASY', type: 'SINGLE',
  titleZh: 'AWS S3 是什么服务？', titleJa: 'AWS S3とは何のサービスですか？', titleEn: 'What is AWS S3?',
  options: [
    { id: 1, optionKey: 'A', contentZh: '对象存储服务', contentJa: 'オブジェクトストレージ', contentEn: 'Object storage service', isCorrect: true },
    { id: 2, optionKey: 'B', contentZh: '计算服务', contentJa: 'コンピューティングサービス', contentEn: 'Compute service' },
    { id: 3, optionKey: 'C', contentZh: '数据库服务', contentJa: 'データベースサービス', contentEn: 'Database service' },
    { id: 4, optionKey: 'D', contentZh: '网络服务', contentJa: 'ネットワークサービス', contentEn: 'Network service' },
  ],
  explanationZh: 'S3 是 Amazon 提供的对象存储服务，用于存储任意格式的文件。',
  explanationJa: 'S3はAmazonが提供するオブジェクトストレージサービスです。',
  explanationEn: 'S3 is Amazon\'s object storage service for storing files of any format.',
}

const TITLE_KEY: Record<Lang, 'titleZh' | 'titleJa' | 'titleEn'> = { zh: 'titleZh', ja: 'titleJa', en: 'titleEn' }
const CONTENT_KEY: Record<Lang, 'contentZh' | 'contentJa' | 'contentEn'> = { zh: 'contentZh', ja: 'contentJa', en: 'contentEn' }
const EXPLANATION_KEY: Record<Lang, 'explanationZh' | 'explanationJa' | 'explanationEn'> = { zh: 'explanationZh', ja: 'explanationJa', en: 'explanationEn' }

export default function QuizDetailPage() {
  const { category = 'AWS' } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { lang, setLang, langLabels } = useLanguage((searchParams.get('lang') as Lang) || 'zh')

  const question = MOCK_QUESTION
  const [selected, setSelected] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!selected) return
    setSubmitted(true)
  }

  const handleNext = () => {
    setSelected(null)
    setSubmitted(false)
    navigate(-1)
  }

  const isCorrect = (opt: QuestionOption) => opt.isCorrect === true
  const getOptionClass = (opt: QuestionOption) => {
    if (!submitted) return selected === opt.optionKey ? 'option selected' : 'option'
    if (isCorrect(opt)) return 'option correct'
    if (selected === opt.optionKey && !isCorrect(opt)) return 'option wrong'
    return 'option'
  }

  return (
    <div className="qdetail-page">
      <header className="qdetail-header">
        <button className="back-btn" onClick={() => navigate(`/quiz/${category}?lang=${lang}`)}>← 返回题列</button>
        <div className="lang-switcher">
          {(['zh', 'ja', 'en'] as Lang[]).map((l) => (
            <button key={l} className={`lang-btn${lang === l ? ' active' : ''}`} onClick={() => setLang(l)}>
              {langLabels[l]}
            </button>
          ))}
        </div>
      </header>

      <main className="qdetail-main">
        <div className="question-card">
          <div className="q-meta">
            <span className="q-category">{question.category}</span>
            <span className={`q-difficulty diff-${question.difficulty.toLowerCase()}`}>{question.difficulty}</span>
          </div>
          <h2 className="q-title-text">{question[TITLE_KEY[lang]]}</h2>

          <ul className="options-list">
            {question.options.map((opt) => (
              <li
                key={opt.id}
                className={getOptionClass(opt)}
                onClick={() => !submitted && setSelected(opt.optionKey)}
              >
                <span className="opt-key">{opt.optionKey}</span>
                <span className="opt-content">{opt[CONTENT_KEY[lang]]}</span>
                {submitted && isCorrect(opt) && <span className="opt-tag correct-tag">✓ 正解</span>}
                {submitted && selected === opt.optionKey && !isCorrect(opt) && <span className="opt-tag wrong-tag">✗ 错误</span>}
              </li>
            ))}
          </ul>

          {!submitted ? (
            <button className="submit-btn" disabled={!selected} onClick={handleSubmit}>
              提交答案
            </button>
          ) : (
            <div className="result-block">
              <div className={`result-banner ${selected && question.options.find(o => o.optionKey === selected)?.isCorrect ? 'correct' : 'wrong'}`}>
                {question.options.find(o => o.optionKey === selected)?.isCorrect ? '🎉 回答正确！' : '😅 回答错误'}
              </div>
              <div className="explanation">
                <strong>解析：</strong>{question[EXPLANATION_KEY[lang]]}
              </div>
              <button className="next-btn" onClick={handleNext}>← 返回题列</button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
