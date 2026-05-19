import React from 'react'
import './SentenceItem.css'
import { RubyWord } from '@/types'

const typeColor: Record<string, string> = {
  han: '#ffb74d',      // 汉字：橙色
  katakana: '#4fc3f7', // 片假名：蓝色
  en: '#aed581',       // 英文/数字：绿色
  other: 'transparent' // 其他
}

interface SentenceItemProps {
  rubyWords: RubyWord[];
  translation: string;
  isActive: boolean;
}

const getWordType = (text: string) => {
  if (/\p{Script=Han}/u.test(text)) return 'han'
  if (/[\u30A0-\u30FF]/.test(text)) return 'katakana'
  if (/[A-Za-z0-9]/.test(text)) return 'en'
  return 'other'
}

/**
 * 句子项组件
 * 显示单个句子和其翻译，当前播放的句子高亮为蓝色
 */
const SentenceItem: React.FC<SentenceItemProps> = ({
  rubyWords,
  translation,
  isActive,
}) => {
  const renderWords = rubyWords.map((w, idx) => {
    const type = getWordType(w.text)
    const style = {
      backgroundColor: isActive && type !== 'other' ? typeColor[type] : 'transparent',
      color: '#222',
      borderRadius: 4,
      padding: '2px 6px',
      marginRight: 4,
      display: 'inline-block',
    }
    return w.ruby ? (
      <ruby key={idx} style={{ marginRight: 4 }}>
        <span style={style}>{w.text}</span>
        <rt>{w.ruby}</rt>
      </ruby>
    ) : (
      <span key={idx} style={style}>{w.text}</span>
    )
  })

  return (
    <div className={`sentence-item ${isActive ? 'active' : ''}`}>
      <p className="sentence-text">
        {renderWords}
      </p>
      <p className="sentence-translation">{translation}</p>
    </div>
  )
}

export default SentenceItem
