import { useNavigate, useParams } from 'react-router-dom'
import './CategoryPage.css'

// 模拟各分类的文章列表
const categoryArticles: Record<string, Record<string, { id: string; title: string; description: string; audioUrl: string }[]>> = {
  japanese: {
    news: [
      { id: '1', title: '自我介绍', description: '日语自我介绍基础表达', audioUrl: '/audio/001.mp3' },
      { id: '2', title: '天気ニュース', description: '天气相关新闻用语', audioUrl: '/audio/002.mp3' },
    ],
    exam: [
      { id: '3', title: 'JLPT N3 必考句型', description: 'N3 常见考试句型练习', audioUrl: '/audio/003.mp3' },
    ],
    business: [
      { id: '4', title: '敬語の基本', description: '职场敬语基础表达', audioUrl: '/audio/004.mp3' },
    ],
  },
  english: {
    news: [
      { id: '5', title: 'Daily News', description: '英语新闻听力练习', audioUrl: '/audio/005.mp3' },
    ],
    exam: [
      { id: '6', title: 'IELTS Speaking', description: 'IELTS 口语常用句型', audioUrl: '/audio/006.mp3' },
    ],
    business: [
      { id: '7', title: 'Business Meeting', description: '商务会议英语用语', audioUrl: '/audio/007.mp3' },
    ],
  },
}

const categoryLabels: Record<string, Record<string, string>> = {
  japanese: { news: 'ニュース（新闻）', exam: '試験（考试）', business: 'ビジネス（职业用语）' },
  english: { news: 'News（新闻）', exam: 'Exam（考试）', business: 'Business（职业用语）' },
}

const langLabels: Record<string, string> = { japanese: '日本語', english: 'English' }

export default function CategoryPage() {
  const { lang = 'japanese', category = 'news' } = useParams()
  const navigate = useNavigate()
  const articles = categoryArticles[lang]?.[category] ?? []
  const catLabel = categoryLabels[lang]?.[category] ?? category
  const langLabel = langLabels[lang] ?? lang

  return (
    <div className="category-page">
      <header className="cat-header">
        <button className="back-btn" onClick={() => navigate('/')}>← 返回首页</button>
        <div className="cat-header-info">
          <h2 className="cat-header-title">{langLabel} · {catLabel}</h2>
          <span className="cat-header-sub">{articles.length} 篇文章</span>
        </div>
      </header>

      <main className="cat-main">
        {articles.length === 0 ? (
          <div className="cat-empty">暂无内容，敬请期待</div>
        ) : (
          <ul className="article-list">
            {articles.map((article) => (
              <li key={article.id} className="article-card" onClick={() => navigate(`/${lang}/${category}/article/${article.id}`)}>
                <div className="article-card-icon">🎧</div>
                <div className="article-card-info">
                  <h3 className="article-card-title">{article.title}</h3>
                  <p className="article-card-desc">{article.description}</p>
                </div>
                <span className="article-card-arrow">›</span>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
