import React, { useRef, useState, useEffect } from 'react'
import './AudioPlayer.css'

interface AudioPlayerProps {
  /** 音频URL */
  audioUrl: string
  /** 音频当前时间更新时的回调函数 */
  onTimeUpdate: (currentTime: number) => void
  /** 播放状态改变时的回调函数 */
  onPlayingChange?: (isPlaying: boolean) => void
}

/**
 * 音频播放器组件
 * 提供播放/暂停控制，并实时通知当前播放时间
 */
const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  onTimeUpdate,
  onPlayingChange,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // 监听音频时间更新事件
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      const time = audio.currentTime
      setCurrentTime(time)
      onTimeUpdate(time)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handlePlay = () => {
      setIsPlaying(true)
      onPlayingChange?.(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
      onPlayingChange?.(false)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      onPlayingChange?.(false)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [onTimeUpdate, onPlayingChange])

  // 切换播放状态
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch((error) => {
          console.error('Failed to play audio:', error)
        })
      }
    }
  }

  // 格式化时间显示
  const formatTime = (time: number): string => {
    if (!time || isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // 处理进度条点击
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const newTime = Math.max(0, Math.min(duration, percent * duration))
    audioRef.current.currentTime = newTime
  }

  const progressPercent = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={audioUrl} crossOrigin="anonymous" />

      <div className="player-controls">
        <button
          className={`play-button ${isPlaying ? 'playing' : ''}`}
          onClick={togglePlayPause}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <span className="icon">⏸</span>
          ) : (
            <span className="icon">▶</span>
          )}
        </button>

        <div className="player-info">
          <div className="time-display">
            <span className="current-time">{formatTime(currentTime)}</span>
            <span className="divider">/</span>
            <span className="duration">{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      <div
        className="progress-bar"
        onClick={handleProgressClick}
        title={`${((progressPercent / 100) * duration).toFixed(2)}s`}
      >
        <div className="progress-fill" style={{ width: `${progressPercent}%` }}>
          <div className="progress-thumb" />
        </div>
      </div>
    </div>
  )
}

export default AudioPlayer
