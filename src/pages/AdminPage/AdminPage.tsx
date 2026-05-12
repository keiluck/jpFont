import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminQuestionList from './AdminQuestionList'
import AdminQuestionForm from './AdminQuestionForm'
import AdminArticleList from './AdminArticleList'
import './AdminPage.css'

type AdminTab = 'questions' | 'question-form' | 'articles'

export default function AdminPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<AdminTab>('questions')
  const [editQuestionId, setEditQuestionId] = useState<number | null>(null)

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-logo">🛠 后台管理</div>
        <nav className="admin-nav">
          <button className={`admin-nav-item${tab === 'questions' ? ' active' : ''}`} onClick={() => setTab('questions')}>
            📝 题库管理
          </button>
          <button className={`admin-nav-item${tab === 'articles' ? ' active' : ''}`} onClick={() => setTab('articles')}>
            🎧 文章管理
          </button>
        </nav>
        <button className="admin-back-btn" onClick={() => navigate('/')}>← 返回网站</button>
      </aside>

      <main className="admin-main">
        {tab === 'questions' && (
          <AdminQuestionList
            onAdd={() => { setEditQuestionId(null); setTab('question-form') }}
            onEdit={(id) => { setEditQuestionId(id); setTab('question-form') }}
          />
        )}
        {tab === 'question-form' && (
          <AdminQuestionForm
            editId={editQuestionId}
            onBack={() => setTab('questions')}
          />
        )}
        {tab === 'articles' && (
          <AdminArticleList />
        )}
      </main>
    </div>
  )
}
