import React from 'react'
import { Sentence } from '@/types'
import SentenceItem from '../SentenceItem/SentenceItem'
import './SentenceList.css'

interface SentenceListProps {
  /** 句子列表数据 */
  sentences: Sentence[]
  /** 当前播放的句子ID */
  activeSentenceId: string | null
}

/**
 * 句子列表组件
 * 渲染所有句子，并高亮当前播放的句子
 */
const SentenceList: React.FC<SentenceListProps> = ({
  sentences,
  activeSentenceId,
}) => {
  return (
    <div className="sentence-list">
      {sentences.map((sentence) => (
        <SentenceItem
          key={sentence.id}
          rubyWords={sentence.rubyWords}
          translation={sentence.translation}
          isActive={sentence.id === activeSentenceId}
        />
      ))}
    </div>
  )
}

export default SentenceList
