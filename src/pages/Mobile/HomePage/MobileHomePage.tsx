import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Article } from '@/types'
import { getArticles } from '@/services/api'

const MobileHomePage: React.FC = () => {
  const navigate = useNavigate()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getArticles()
        setArticles(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载失败')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 16, color: '#888' }}>
        <div style={{ width: 36, height: 36, border: '3px solid #eee', borderTopColor: '#333', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p>加载中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 16 }}>
        <p>❌ {error}</p>
        <button onClick={() => window.location.reload()}
          style={{ padding: '8px 20px', border: '1px solid #ddd', borderRadius: 8, background: '#fff', cursor: 'pointer' }}>
          重新加载
        </button>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <header style={{
        padding: '20px 16px 16px', position: 'sticky', top: 0, background: '#fff',
        zIndex: 10, borderBottom: '1px solid #f0f0f0',
      }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>日语跟读学习</h1>
        <p style={{ fontSize: 13, color: '#aaa', margin: '4px 0 0' }}>{articles.length} 篇文章</p>
      </header>

      {articles.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#aaa' }}>暂无文章</div>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {articles.map(a => (
            <li
              key={a.id}
              onClick={() => navigate(`/m/japanese/all/article/${a.id}`)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '16px', borderBottom: '1px solid #f5f5f5', cursor: 'pointer',
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: '#f0f0f0',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0,
              }}>
                🎧
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {a.title}
                </h3>
                <p style={{ fontSize: 13, color: '#999', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {a.content}
                </p>
              </div>
              <span style={{ fontSize: 18, color: '#ccc' }}>›</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MobileHomePage
