import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '@/services/api'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await adminLogin(username, password)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#1a1a2e',
    }}>
      <form onSubmit={handleSubmit} style={{
        background: '#fff', borderRadius: 12, padding: '36px 32px', width: 360,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a2e', margin: '0 0 6px', textAlign: 'center' }}>
          🛠 后台管理
        </h1>
        <p style={{ fontSize: 13, color: '#999', margin: '0 0 24px', textAlign: 'center' }}>请登录后继续操作</p>

        <label style={{ display: 'block', fontSize: 13, color: '#555', marginBottom: 14 }}>
          用户名
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoFocus
            autoComplete="username"
            style={{
              display: 'block', width: '100%', boxSizing: 'border-box', marginTop: 6,
              padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14,
            }}
          />
        </label>

        <label style={{ display: 'block', fontSize: 13, color: '#555', marginBottom: 20 }}>
          密码
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            style={{
              display: 'block', width: '100%', boxSizing: 'border-box', marginTop: 6,
              padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14,
            }}
          />
        </label>

        {error && (
          <p style={{ fontSize: 13, color: '#e53935', margin: '0 0 14px' }}>❌ {error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: '100%', padding: '11px 0', border: 'none', borderRadius: 8,
            background: '#1a1a2e', color: '#fff', fontSize: 15, fontWeight: 600,
            cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? '登录中...' : '登录'}
        </button>
      </form>
    </div>
  )
}
