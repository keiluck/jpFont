/**
 * RubyWord 数据类型
 */
export interface RubyWord {
  text: string
  ruby?: string
}

/**
 * 句子数据类型
 */
export interface Sentence {
  rubyWords: RubyWord[]
  id: string
  text: string
  translation: string
  startTime: number
  endTime: number
}

/**
 * 文章数据类型
 */
export interface Article {
  id: string
  title: string
  content: string
  translation?: string
  audioUrl: string
  sentences: Sentence[]
  createdAt: string
  updatedAt: string
}

/**
 * API响应类型
 */
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

/**
 * 语言类型
 */
export type Lang = 'zh' | 'ja' | 'en'

/**
 * 题目选项
 */
export interface QuestionOption {
  id: number
  optionKey: string   // A / B / C / D
  contentZh: string
  contentJa: string
  contentEn: string
  isCorrect?: boolean
}

/**
 * 题目
 */
export interface Question {
  id: number
  category: string        // AWS / IT / JAPANESE
  difficulty: string      // EASY / MEDIUM / HARD
  type: string            // SINGLE / MULTIPLE / TRUE_FALSE
  titleZh: string
  titleJa: string
  titleEn: string
  options: QuestionOption[]
  explanationZh?: string
  explanationJa?: string
  explanationEn?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * 答题结果
 */
export interface AnswerResult {
  correct: boolean
  correctAnswer: string
  explanation: string
}
