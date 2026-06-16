import React, { useState } from 'react'
import { RubyWord } from '@/types'
import { TranslationMode } from '@/components/Mobile/AudioPlayer/MobileAudioPlayer'

interface MobileSentenceItemProps {
  rubyWords: RubyWord[]
  translation: string
  isActive: boolean
  showRuby: boolean
  translationMode: TranslationMode
  onClick?: () => void
}

const typeColor: Record<string, string> = {
  han: '#ffb74d',
  katakana: '#4fc3f7',
  en: '#aed581',
  other: 'transparent',
}

const getWordType = (text: string) => {
  if (/\p{Script=Han}/u.test(text)) return 'han'
  if (/[\u30A0-\u30FF]/.test(text)) return 'katakana'
  if (/[A-Za-z0-9]/.test(text)) return 'en'
  return 'other'
}

const MobileSentenceItem: React.FC<MobileSentenceItemProps> = ({
  rubyWords, translation, isActive, showRuby, translationMode, onClick,
}) => {
  const [showTrans, setShowTrans] = useState(false)

  // 翻译是否可见
  const transVisible =
    translationMode === 'always' ||
    (translationMode === 'click' && showTrans)

  return (
    <div
      onClick={() => { onClick?.(); if (translationMode === 'click') setShowTrans(v => !v) }}
      style={{
        padding: '14px 16px',
        borderBottom: '1px solid #f5f5f5',
        cursor: 'pointer',
        background: isActive ? '#f0f7ff' : '#fff',
        transition: 'background 0.15s',
      }}
    >
      {/* 日语原文（带振假名 + 颜色高亮） */}
      <p style={{ fontSize: 18, lineHeight: 2.2, color: '#1a1a2e', margin: '0 0 6px', wordBreak: 'break-all' }}>
        {rubyWords.map((w, idx) => {
          const type = getWordType(w.text)
          const wordStyle: React.CSSProperties = {
            backgroundColor: isActive && type !== 'other' ? typeColor[type] : 'transparent',
            borderRadius: 4,
            padding: '1px 4px',
            display: 'inline-block',
          }
          return w.ruby && showRuby ? (
            <ruby key={idx} style={{ marginRight: 2 }}>
              <span style={wordStyle}>{w.text}</span>
              <rt style={{ fontSize: 10, color: '#888' }}>{w.ruby}</rt>
            </ruby>
          ) : (
            <span key={idx} style={wordStyle}>{w.text}</span>
          )
        })}
      </p>

      {/* 中文翻译 */}
      {translationMode !== 'hidden' && (
        <p style={{
          fontSize: 13, color: '#888', margin: 0, lineHeight: 1.5,
          opacity: transVisible ? 1 : 0,
          transition: 'opacity 0.2s',
        }}>
          {translation}
        </p>
      )}
    </div>
  )
}

export default MobileSentenceItem
