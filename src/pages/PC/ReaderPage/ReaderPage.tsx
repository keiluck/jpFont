import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Article, Sentence } from '@/types'
import AudioPlayer from '@/components/PC/AudioPlayer/AudioPlayer'
import SentenceList from '@/components/PC/SentenceList/SentenceList'
import { getMockArticle } from '@/services/mockData'
import './ReaderPage.css'

/**
 * 日语跟读页面
 * 主要功能：
 * - 加载和显示文章
 * - 播放音频
 * - 根据音频时间高亮当前句子
 */
const ReaderPage: React.FC = () => {
  const navigate = useNavigate()
  const [article, setArticle] = useState<Article | null>(null)
  const [activeSentenceId, setActiveSentenceId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 组件挂载时加载文章数据
  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true)
        // TODO: 替换为实际的API调用
        // const data = await getArticleById('1')
        // 现在使用模拟数据
        const data = getMockArticle()
        setArticle(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载文章失败')
        console.error('Error loading article:', err)
      } finally {
        setLoading(false)
      }
    }

    loadArticle()
  }, [])

  /**
   * 根据当前播放时间查找激活的句子
   */
  const findActiveSentence = (currentTime: number): Sentence | undefined => {
    if (!article) return undefined

    return article.sentences.find(
      (sentence) =>
        currentTime >= sentence.startTime && currentTime < sentence.endTime
    )
  }

  /**
   * 处理音频时间更新事件1
   */
  const handleTimeUpdate = (currentTime: number) => {
    const activeSentence = findActiveSentence(currentTime)
    setActiveSentenceId(activeSentence?.id || null)
  }

  // 错误状态1
  if (error) {
    return (
      <div className="reader-page">
        <div className="error-message">
          <p>❌ {error}</p>
          <button onClick={() => window.location.reload()}>重新加载</button>
        </div>
      </div>
    )
  }

  // 加载状态
  if (loading || !article) {
    return (
      <div className="reader-page">
        <div className="loading">
          <div className="spinner" />
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  // 正常渲染
  return (
    <div className="reader-page">
      <div className="article-header">
        <button className="reader-back-btn" onClick={() => navigate(-1)}>← 返回</button>
        <h1 className="article-title">{article.title}</h1>
        <p className="article-meta">
          {article.sentences.length} 句 • 更新于{' '}
          {new Date(article.updatedAt).toLocaleDateString('zh-CN')}
        </p>
      </div>

      <AudioPlayer
        audioUrl={article.audioUrl}
        onTimeUpdate={handleTimeUpdate}
      />

      <div className="content-section">
        <h2 className="section-title">课文</h2>
        <SentenceList
          sentences={article.sentences}
          activeSentenceId={activeSentenceId}
        />
      </div>
    </div>
  )
}

export default ReaderPage
