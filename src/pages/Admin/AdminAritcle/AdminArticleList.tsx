import { useEffect, useState } from 'react'
import { Article } from '@/types'
import { adminGetArticles, adminCreateArticle, adminUpdateArticle, adminDeleteArticle, uploadAudio } from '@/services/api'
import '@/pages/Admin/AdminHome/AdminPage.css'

export default function AdminArticleList() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [translation, setTranslation] = useState('')
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [existingAudioUrl, setExistingAudioUrl] = useState('')

  const loadArticles = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await adminGetArticles()
      setArticles(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadArticles()
  }, [])

  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setTitle('')
    setContent('')
    setTranslation('')
    setAudioFile(null)
    setExistingAudioUrl('')
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('确认删除？')) return
    try {
      await adminDeleteArticle(id)
      setArticles(prev => prev.filter(a => a.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : '删除失败')
    }
  }

  const handleEdit = (article: Article) => {
    setEditingId(article.id)
    setTitle(article.title)
    // content 里可能只存了首句，日语全文在 sentences[].text 中，每句一行便于与译文对照
    const hasSentences = article.sentences && article.sentences.length > 0
    setContent(hasSentences ? article.sentences.map(s => s.text).join('\n') : article.content)
    setTranslation(article.translation ?? (hasSentences ? article.sentences.map(s => s.translation).join('\n') : ''))
    setExistingAudioUrl(article.audioUrl)
    setAudioFile(null)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const audioUrl = audioFile ? await uploadAudio(audioFile) : existingAudioUrl

      if (editingId) {
        const updated = await adminUpdateArticle(editingId, { title, content, translation, audioUrl })
        setArticles(prev => prev.map(a => (a.id === editingId ? updated : a)))
      } else {
        const created = await adminCreateArticle({ title, content, translation, audioUrl, sentences: [] })
        setArticles(prev => [...prev, created])
      }
      resetForm()
    } catch (err) {
      alert(err instanceof Error ? err.message : '保存失败')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-content">
      <div className="admin-content-header">
        <h2>文章管理</h2>
        <button className="add-btn" onClick={() => (showForm ? resetForm() : setShowForm(true))}>
          {showForm ? '取消' : '+ 新建文章'}
        </button>
      </div>

      {showForm && (
        <form className="question-form" onSubmit={handleSubmit}>
          <label>标题 <input value={title} onChange={e => setTitle(e.target.value)} required /></label>
          <div className="form-row">
            <label>内容（日语全文，每句一行）
              <textarea value={content} onChange={e => setContent(e.target.value)} rows={16} />
            </label>
            <label>中文翻译（与日文逐行对照）
              <textarea value={translation} onChange={e => setTranslation(e.target.value)} rows={16} />
            </label>
          </div>
          <label>上传音频（mp3 / m4a / wav 等）
            <input type="file" accept=".mp3,.m4a,.wav,.aac,.ogg,audio/*" onChange={e => setAudioFile(e.target.files?.[0] || null)} />
            {audioFile ? <span className="file-name">📁 {audioFile.name}</span> : existingAudioUrl && <span className="file-name">📁 {existingAudioUrl}</span>}
          </label>
          <div className="form-footer">
            <button type="button" className="cancel-btn" onClick={resetForm}>取消</button>
            <button type="submit" className="save-btn" disabled={submitting}>{submitting ? '保存中...' : '保存'}</button>
          </div>
        </form>
      )}

      {loading ? (
        <p>加载中...</p>
      ) : error ? (
        <p>❌ {error} <button onClick={loadArticles}>重试</button></p>
      ) : (
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
                  <button className="edit-btn" onClick={() => handleEdit(a)}>编辑</button>
                  <button className="del-btn" onClick={() => handleDelete(a.id)}>删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
