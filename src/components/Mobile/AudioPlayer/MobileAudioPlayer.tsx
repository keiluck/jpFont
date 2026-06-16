import React, { useRef, useState, useEffect } from 'react'

export type TranslationMode = 'always' | 'click' | 'hidden'

interface MobileAudioPlayerProps {
  audioUrl: string
  onTimeUpdate: (currentTime: number) => void
  onPlayingChange?: (isPlaying: boolean) => void
  // 工具栏
  showRuby: boolean
  onToggleRuby: () => void
  speed: number
  onSpeedChange: (speed: number) => void
  onOpenListening: () => void
  translationMode: TranslationMode
  onTranslationModeChange: (mode: TranslationMode) => void
  // 集中听力模式
  isListeningMode?: boolean
  showText?: boolean
  onToggleText?: () => void
  onPrevSentence?: () => void
  onNextSentence?: () => void
}

const SPEED_OPTIONS = [
  { value: 0.6, label: 'ゆーっくり' },
  { value: 0.8, label: 'ゆっくり' },
  { value: 1.0, label: 'ふつう' },
  { value: 1.1, label: 'ちょっとはやい' },
  { value: 1.2, label: 'ややはやい' },
  { value: 1.5, label: 'はやい' },
  { value: 2.0, label: 'とてもはやい' },
]

const TRANSLATION_OPTIONS: { value: TranslationMode; label: string }[] = [
  { value: 'always', label: '翻訳を表示する' },
  { value: 'click', label: 'クリックして翻訳を表示する' },
  { value: 'hidden', label: '翻訳を非表示する' },
]

const MobileAudioPlayer: React.FC<MobileAudioPlayerProps> = ({
  audioUrl, onTimeUpdate, onPlayingChange,
  showRuby, onToggleRuby,
  speed, onSpeedChange,
  onOpenListening,
  translationMode, onTranslationModeChange,
  isListeningMode = false,
  showText = true,
  onToggleText,
  onPrevSentence,
  onNextSentence,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speedOpen, setSpeedOpen] = useState(false)
  const [translationOpen, setTranslationOpen] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => { setCurrentTime(audio.currentTime); onTimeUpdate(audio.currentTime) }
    const onLoaded = () => setDuration(audio.duration)
    const onPlay = () => { setIsPlaying(true); onPlayingChange?.(true) }
    const onPause = () => { setIsPlaying(false); onPlayingChange?.(false) }
    const onEnded = () => { setIsPlaying(false); onPlayingChange?.(false) }
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
    }
  }, [onTimeUpdate, onPlayingChange])

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed
  }, [speed])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) audioRef.current.pause()
    else audioRef.current.play().catch(console.error)
  }

  const seek = (delta: number) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + delta))
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = Number(e.target.value)
    if (audioRef.current) audioRef.current.currentTime = t
    setCurrentTime(t)
  }

  const fmt = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const overlayStyle: React.CSSProperties = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200,
    display: 'flex', alignItems: 'flex-end',
  }
  const sheetStyle: React.CSSProperties = {
    background: '#fff', width: '100%', borderRadius: '16px 16px 0 0',
    padding: '20px 24px 40px', maxHeight: '70vh', overflowY: 'auto',
  }

  const btnBase: React.CSSProperties = {
    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
  }

  return (
    <>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff',
        borderTop: '1px solid #eee', padding: '10px 16px 0', zIndex: 100,
        boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
      }}>

        {/* ===== 普通模式：进度条 ===== */}
        {!isListeningMode && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: '#888', whiteSpace: 'nowrap', cursor: 'pointer', userSelect: 'none' }} onClick={() => seek(-10)}>- 10s</span>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <input type="range" style={{ width: '100%', accentColor: '#1a1a2e', cursor: 'pointer' }}
                min={0} max={duration || 0} step={0.1} value={currentTime} onChange={handleSeek} />
              <div style={{ fontSize: 12, color: '#888', textAlign: 'center' }}>{fmt(currentTime)} / {fmt(duration)}</div>
            </div>
            <span style={{ fontSize: 12, color: '#888', whiteSpace: 'nowrap', cursor: 'pointer', userSelect: 'none' }} onClick={() => seek(10)}>+ 10s</span>
          </div>
        )}

        {/* ===== 播放控制区 ===== */}
        {isListeningMode ? (
          /* 集中听力模式底部控制栏 */
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '10px 0 env(safe-area-inset-bottom, 16px)' }}>

            {/* ⓶ 2秒回退 */}
            <button style={btnBase} onClick={() => seek(-2)}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                border: '2px solid #555', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: '#555',
              }}>2</div>
            </button>

            {/* ⏮ 上一句 */}
            <button style={btnBase} onClick={onPrevSentence}>
              <span style={{ fontSize: 28, color: '#222' }}>⏮</span>
            </button>

            {/* ▶/⏸ 播放暂停 */}
            <button style={btnBase} onClick={togglePlay}>
              <span style={{ fontSize: 32, color: '#222' }}>{isPlaying ? '⏸' : '▶'}</span>
            </button>

            {/* ⏭ 下一句 */}
            <button style={btnBase} onClick={onNextSentence}>
              <span style={{ fontSize: 28, color: '#222' }}>⏭</span>
            </button>

            {/* 👁 文本显示/隐藏 */}
            <button style={btnBase} onClick={onToggleText}>
              <span style={{ fontSize: 26, color: showText ? '#222' : '#bbb' }}>
                {showText ? '👁' : '🚫'}
              </span>
            </button>
          </div>
        ) : (
          /* 普通模式播放控制 + 工具栏 */
          <>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 32, padding: '4px 0 10px' }}>
              <button style={{ background: 'none', border: 'none', fontSize: 22, color: '#222', cursor: 'pointer', padding: 4 }} onClick={() => seek(-30)}>⏮</button>
              <button style={{ background: 'none', border: 'none', fontSize: 28, color: '#222', cursor: 'pointer', padding: 4 }} onClick={togglePlay}>{isPlaying ? '⏸' : '▶'}</button>
              <button style={{ background: 'none', border: 'none', fontSize: 22, color: '#222', cursor: 'pointer', padding: 4 }} onClick={() => seek(30)}>⏭</button>
            </div>

            {/* 底部工具栏 */}
            <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid #f0f0f0', padding: '10px 0 12px' }}>
              {/* スピード */}
              <button style={{ ...btnBase, padding: '0 4px' }} onClick={() => setSpeedOpen(true)}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#333', lineHeight: 1 }}>{speed}x</span>
                <span style={{ fontSize: 10, color: '#888', whiteSpace: 'nowrap' }}>スピード</span>
              </button>
              {/* カタカナ（振假名） */}
              <button style={{ ...btnBase, padding: '0 4px' }} onClick={onToggleRuby}>
                <span style={{ fontSize: 20, lineHeight: 1, color: showRuby ? '#333' : '#aaa', textDecoration: showRuby ? 'none' : 'line-through' }}>あ</span>
                <span style={{ fontSize: 10, color: '#888', whiteSpace: 'nowrap' }}>カタカナ</span>
              </button>
              {/* リスニング */}
              <button style={{ ...btnBase, padding: '0 4px' }} onClick={onOpenListening}>
                <span style={{ fontSize: 20, lineHeight: 1, color: '#333' }}>🎧</span>
                <span style={{ fontSize: 10, color: '#888', whiteSpace: 'nowrap' }}>リスニング</span>
              </button>
              {/* 通訳 */}
              <button style={{ ...btnBase, padding: '0 4px' }} onClick={() => setTranslationOpen(true)}>
                <span style={{ fontSize: 20, lineHeight: 1, color: '#333' }}>🅐</span>
                <span style={{ fontSize: 10, color: '#888', whiteSpace: 'nowrap' }}>通訳</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* ===== スピード 弹窗 ===== */}
      {speedOpen && (
        <div style={overlayStyle} onClick={() => setSpeedOpen(false)}>
          <div style={sheetStyle} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 22, fontWeight: 700, margin: '0 0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>スピード</span>
              <button style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }} onClick={() => setSpeedOpen(false)}>×</button>
            </div>
            {SPEED_OPTIONS.map(opt => (
              <div key={opt.value}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}
                onClick={() => { onSpeedChange(opt.value); setSpeedOpen(false) }}>
                <div>
                  <div style={{ fontSize: 18, color: '#222' }}>{opt.label}</div>
                  <div style={{ fontSize: 14, color: '#aaa', marginTop: 2 }}>{opt.value}x</div>
                </div>
                {speed === opt.value && <span style={{ fontSize: 18, color: '#333' }}>✓</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== 通訳 弹窗 ===== */}
      {translationOpen && (
        <div style={overlayStyle} onClick={() => setTranslationOpen(false)}>
          <div style={sheetStyle} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 22, fontWeight: 700, margin: '0 0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>通訳</span>
              <button style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }} onClick={() => setTranslationOpen(false)}>×</button>
            </div>
            {TRANSLATION_OPTIONS.map(opt => (
              <div key={opt.value}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}
                onClick={() => { onTranslationModeChange(opt.value); setTranslationOpen(false) }}>
                <div style={{ fontSize: 18, color: '#222' }}>{opt.label}</div>
                {translationMode === opt.value && <span style={{ fontSize: 18, color: '#333' }}>✓</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default MobileAudioPlayer
