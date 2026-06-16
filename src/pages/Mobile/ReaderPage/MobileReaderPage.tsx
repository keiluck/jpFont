import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Article, Sentence } from '@/types'
import { getMockArticle } from '@/services/mockData'
import MobileAudioPlayer, { TranslationMode } from '@/components/Mobile/AudioPlayer/MobileAudioPlayer'
import MobileSentenceItem from '@/components/Mobile/SentenceItem/MobileSentenceItem'

const MobileReaderPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [article, setArticle] = useState<Article | null>(null)
  const [activeSentenceId, setActiveSentenceId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 工具栏状态
  const [showRuby, setShowRuby] = useState(true)
  const [speed, setSpeed] = useState(1.0)
  const [listeningMode, setListeningMode] = useState(false)
  const [translationMode, setTranslationMode] = useState<TranslationMode>('always')

  // 集中听力模式专用状态
  const [listeningIndex, setListeningIndex] = useState(0)  // 当前句子索引
  const [showText, setShowText] = useState(true)            // 文本是否显示

  // 普通模式：高亮句子自动滚动
  const activeSentenceRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!listeningMode && activeSentenceRef.current) {
      activeSentenceRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [activeSentenceId, listeningMode])

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = getMockArticle()
        setArticle(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载失败')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  // 普通模式：根据音频时间高亮句子
  const handleTimeUpdate = (currentTime: number) => {
    if (!article) return
    const active = article.sentences.find(
      (s: Sentence) => currentTime >= s.startTime && currentTime < s.endTime
    )
    if (active) {
      setActiveSentenceId(active.id)
      // 集中听力模式下同步 listeningIndex
      if (listeningMode) {
        const idx = article.sentences.indexOf(active)
        if (idx !== -1) setListeningIndex(idx)
      }
    }
  }

  // 集中听力：跳转到指定句子
  const jumpToSentence = (idx: number, art: Article) => {
    if (idx < 0 || idx >= art.sentences.length) return
    setListeningIndex(idx)
    setActiveSentenceId(art.sentences[idx].id)
    // 通过 DOM 直接操作 audio（通过 MobileAudioPlayer 的 audioRef）
    const audio = document.querySelector('audio') as HTMLAudioElement | null
    if (audio) {
      audio.currentTime = art.sentences[idx].startTime
      audio.play().catch(console.error)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 16, color: '#888' }}>
        <div style={{ width: 36, height: 36, border: '3px solid #eee', borderTopColor: '#333', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p>加载中...</p>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 16 }}>
        <p>❌ {error || '加载失败'}</p>
        <button onClick={() => window.location.reload()}
          style={{ padding: '8px 20px', border: '1px solid #ddd', borderRadius: 8, background: '#fff', cursor: 'pointer' }}>
          重新加载
        </button>
      </div>
    )
  }

  const totalSentences = article.sentences.length
  const currentSentence = article.sentences[listeningIndex]

  return (
    <div style={{ minHeight: '100vh', background: '#fff', paddingBottom: listeningMode ? 0 : 200, overflow: listeningMode ? 'hidden' : undefined }}>

      {/* ===== 集中听力模式 ===== */}
      {listeningMode ? (
        <div style={{ height: '100vh', background: '#f5f5f5', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* 顶部 */}
          <header style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
            <button onClick={() => setListeningMode(false)}
              style={{ background: 'none', border: 'none', fontSize: 17, color: '#333', cursor: 'pointer', padding: 0 }}>
              ‹ 戻る
            </button>
          </header>

          {/* 句子卡片 */}
          <div style={{ flex: 1, padding: '20px 16px', paddingBottom: 100, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: '20px 20px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              {/* 进度 + 速度信息 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <span style={{
                  fontSize: 15, color: '#555', fontWeight: 600,
                  background: '#f0f0f0', borderRadius: 20, padding: '4px 12px'
                }}>
                  {listeningIndex + 1} / {totalSentences}
                </span>
                <span style={{
                  fontSize: 13, color: '#888',
                  background: '#f0f0f0', borderRadius: 20, padding: '4px 12px'
                }}>
                  {speed}x | 無限 | 5秒
                </span>
              </div>

              {/* 句子文本（可隐藏） */}
              {showText ? (
                <p style={{ fontSize: 20, lineHeight: 2.4, color: '#1a1a2e', margin: 0, wordBreak: 'break-all' }}>
                  {currentSentence?.rubyWords.map((w, idx) => (
                    w.ruby && showRuby ? (
                      <ruby key={idx} style={{ marginRight: 2 }}>
                        <span>{w.text}</span>
                        <rt style={{ fontSize: 11, color: '#888' }}>{w.ruby}</rt>
                      </ruby>
                    ) : (
                      <span key={idx}>{w.text}</span>
                    )
                  ))}
                </p>
              ) : (
                /* 文本隐藏时显示占位 */
                <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 36, color: '#ddd' }}>・・・</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ===== 普通阅读模式 ===== */
        <>
          <header style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 16px', position: 'sticky', top: 0, background: '#fff',
            zIndex: 10, borderBottom: '1px solid #f0f0f0'
          }}>
            <button onClick={() => navigate(-1)}
              style={{ background: 'none', border: 'none', fontSize: 17, color: '#333', cursor: 'pointer', padding: 0 }}>
              ‹ ホーム
            </button>
            <div style={{ display: 'flex', gap: 12 }}>
              {['♡', '⬜', '⋯'].map((icon, i) => (
                <button key={i} style={{ background: 'none', border: 'none', fontSize: 20, color: '#555', cursor: 'pointer', padding: 0 }}>{icon}</button>
              ))}
            </div>
          </header>

          <div style={{ width: '100%', height: 200, overflow: 'hidden', background: '#eee' }}>
            <img src="/cover/default.jpg" alt={article.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
          </div>

          <div style={{ padding: '14px 16px 8px', borderBottom: '1px solid #f0f0f0' }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a2e', margin: '0 0 4px', lineHeight: 1.4 }}>{article.title}</h1>
            <p style={{ fontSize: 12, color: '#aaa', margin: 0 }}>
              {new Date(article.updatedAt).toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit', weekday: 'short', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div>
            {article.sentences.map((s: Sentence) => (
              <div
                key={s.id}
                ref={activeSentenceId === s.id ? activeSentenceRef : null}
              >
                <MobileSentenceItem
                  rubyWords={s.rubyWords}
                  translation={s.translation}
                  isActive={activeSentenceId === s.id}
                  showRuby={showRuby}
                  translationMode={translationMode}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* ===== 底部播放器（两种模式共用）===== */}
      <MobileAudioPlayer
        audioUrl={article.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        showRuby={showRuby}
        onToggleRuby={() => setShowRuby(v => !v)}
        speed={speed}
        onSpeedChange={setSpeed}
        onOpenListening={() => {
          setListeningMode(v => !v)
          // 进入集中听力时，定位到当前激活句子
          if (!listeningMode && activeSentenceId) {
            const idx = article.sentences.findIndex(s => s.id === activeSentenceId)
            if (idx !== -1) setListeningIndex(idx)
          }
        }}
        translationMode={translationMode}
        onTranslationModeChange={setTranslationMode}
        // 集中听力专用 props
        isListeningMode={listeningMode}
        showText={showText}
        onToggleText={() => setShowText(v => !v)}
        onPrevSentence={() => jumpToSentence(listeningIndex - 1, article)}
        onNextSentence={() => jumpToSentence(listeningIndex + 1, article)}
      />
    </div>
  )
}

export default MobileReaderPage
