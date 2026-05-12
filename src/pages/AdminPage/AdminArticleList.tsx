import { useState } from 'react'
import { Article } from '../../types'
import './AdminPage.css'

const MOCK_ARTICLES: Article[] = [
  { id: '1', title: '自我介绍', content: 'はじめまして...', audioUrl: '/audio/001.mp3', sentences: [], createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
]

export default function AdminArticleList() {
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [audioFile, setAudioFile] = useState<File | null>(null)

  const handleDelete = (id: string) => {
    if (window.confirm('确认删除？')) setArticles(articles.filter(a => a.id !== id))
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    const newArticle: Article = {
      id: Date.now().toString(),
      title,
      content,
      audioUrl: audioFile ? `/audio/${audioFile.name}` : '',
      sentences: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setArticles([...articles, newArticle])
    setShowForm(false)
    setTitle('')
    setContent('')
    setAudioFile(null)
    alert('文章已创建（mock），后端联调后实际保存')
  }

  return (
    <div className="admin-content">
      <div className="admin-content-header">
        <h2>文章管理</h2>
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? '取消' : '+ 新建文章'}
        </button>
      </div>

      {showForm && (
        <form className="question-form" onSubmit={handleCreate}>
          <label>标题 <input value={title} onChange={e => setTitle(e.target.value)} required /></label>
          <label>内容（日语全文）
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={4} />
          </label>
          <label>上传音频（mp3）
            <input type="file" accept=".mp3,audio/*" onChange={e => setAudioFile(e.target.files?.[0] || null)} />
            {audioFile && <span className="file-name">📁 {audioFile.name}</span>}
          </label>
          <div className="form-footer">
            <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>取消</button>
            <button type="submit" className="save-btn">保存</button>
          </div>
        </form>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>标题</th>
            <th>音频</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {articles.map(a => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.title}</td>
              <td className="td-audio">{a.audioUrl || '—'}</td>
              <td>{new Date(a.createdAt).toLocaleDateString('zh-CN')}</td>
              <td>
                <button className="edit-btn">编辑</button>
                <button className="del-btn" onClick={() => handleDelete(a.id)}>删除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
