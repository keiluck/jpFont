import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Question, Lang } from '../../types'
import { useLanguage } from '../../hooks/useLanguage'
import './QuizCategoryPage.css'

const DIFF_LABEL: Record<string, string> = { EASY: '简单', MEDIUM: '中等', HARD: '困难' }
const DIFF_COLOR: Record<string, string> = { EASY: '#2d9e5f', MEDIUM: '#e07b00', HARD: '#e63946' }

// mock 数据（后端联调后替换为 getQuizByCategory）
const MOCK_QUESTIONS: Question[] = [
  {
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
  },
  {
    id: 2, category: 'AWS', difficulty: 'MEDIUM', type: 'SINGLE',
    titleZh: 'EC2 实例的计费方式是？', titleJa: 'EC2インスタンスの課金方式は？', titleEn: 'How is EC2 billed?',
    options: [
      { id: 5, optionKey: 'A', contentZh: '按年计费', contentJa: '年額課金', contentEn: 'Annual billing' },
      { id: 6, optionKey: 'B', contentZh: '按月计费', contentJa: '月額課金', contentEn: 'Monthly billing' },
      { id: 7, optionKey: 'C', contentZh: '按秒/小时计费', contentJa: '秒/時間課金', contentEn: 'Per second/hour', isCorrect: true },
      { id: 8, optionKey: 'D', contentZh: '免费', contentJa: '無料', contentEn: 'Free' },
    ],
    explanationZh: 'EC2 默认按秒（最低1分钟）计费，Linux 实例按秒计费。',
    explanationJa: 'EC2はデフォルトで秒単位（最低1分）で課金されます。',
    explanationEn: 'EC2 is billed per second (minimum 1 minute) for Linux instances.',
  },
]

const TITLE_KEY: Record<Lang, 'titleZh' | 'titleJa' | 'titleEn'> = {
  zh: 'titleZh', ja: 'titleJa', en: 'titleEn',
}

export default function QuizCategoryPage() {
  const { category = 'AWS' } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { lang, setLang, langLabels } = useLanguage((searchParams.get('lang') as Lang) || 'zh')
  const [questions] = useState<Question[]>(MOCK_QUESTIONS)

  return (
    <div className="qcat-page">
      <header className="qcat-header">
        <button className="back-btn" onClick={() => navigate('/quiz')}>← 返回</button>
        <h2 className="qcat-title">{category} 题库</h2>
        <div className="lang-switcher">
          {(['zh', 'ja', 'en'] as Lang[]).map((l) => (
            <button key={l} className={`lang-btn${lang === l ? ' active' : ''}`} onClick={() => setLang(l)}>
              {langLabels[l]}
            </button>
          ))}
        </div>
      </header>

      <main className="qcat-main">
        <p className="qcat-count">共 {questions.length} 题</p>
        <ul className="question-list">
          {questions.map((q, idx) => (
            <li
              key={q.id}
              className="question-item"
              onClick={() => navigate(`/quiz/${category}/${q.id}?lang=${lang}`)}
            >
              <span className="q-index">Q{idx + 1}</span>
              <span className="q-title">{q[TITLE_KEY[lang]]}</span>
              <span className="q-diff" style={{ color: DIFF_COLOR[q.difficulty] }}>
                {DIFF_LABEL[q.difficulty]}
              </span>
              <span className="q-arrow">›</span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
