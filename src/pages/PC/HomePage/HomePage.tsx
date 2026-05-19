import { useNavigate } from 'react-router-dom'
import './HomePage.css'

const languages = [
  {
    id: 'japanese',
    label: '日本語',
    sublabel: '日语学习',
    icon: '🇯🇵',
    color: '#e63946',
    categories: [
      { id: 'news', label: 'ニュース', sublabel: '新闻', icon: '📰' },
      { id: 'exam', label: '試験', sublabel: '考试', icon: '📝' },
      { id: 'business', label: 'ビジネス', sublabel: '职业用语', icon: '💼' },
    ],
  },
  {
    id: 'english',
    label: 'English',
    sublabel: '英语学习',
    icon: '🇺🇸',
    color: '#457b9d',
    categories: [
      { id: 'news', label: 'News', sublabel: '新闻', icon: '📰' },
      { id: 'exam', label: 'Exam', sublabel: '考试', icon: '📝' },
      { id: 'business', label: 'Business', sublabel: '职业用语', icon: '💼' },
    ],
  },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="home-page">
      <header className="home-header">
        <h1 className="home-title">语言跟读学习</h1>
        <p className="home-subtitle">选择语言，开始学习</p>
      </header>

      <main className="home-main">
        {/* 快捷入口 */}
        <div className="home-quick-row">
          <button className="quick-card quiz" onClick={() => navigate('/quiz')}>
            <span>📝</span>
            <span>分类刷题</span>
            <span className="quick-sub">AWS / IT / 日語</span>
          </button>
          <button className="quick-card admin" onClick={() => navigate('/admin')}>
            <span>🛠</span>
            <span>后台管理</span>
            <span className="quick-sub">题库 / 文章上传</span>
          </button>
        </div>

        {languages.map((lang) => (
          <section key={lang.id} className="lang-section">
            <div className="lang-title-row">
              <span className="lang-icon">{lang.icon}</span>
              <div>
                <h2 className="lang-name" style={{ color: lang.color }}>{lang.label}</h2>
                <span className="lang-sublabel">{lang.sublabel}</span>
              </div>
            </div>
            <div className="category-grid">
              {lang.categories.map((cat) => (
                <button
                  key={cat.id}
                  className="category-card"
                  style={{ borderColor: lang.color }}
                  onClick={() => navigate(`/${lang.id}/${cat.id}`)}
                >
                  <span className="cat-icon">{cat.icon}</span>
                  <span className="cat-label">{cat.label}</span>
                  <span className="cat-sublabel">{cat.sublabel}</span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}
