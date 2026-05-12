import { Article } from '../types'

/**
 * 模拟数据 - 用于开发和测试
 */
export const mockArticle: Article = {
  id: '1',
  title: '自我介绍',
  content: 'はじめまして、ケイと申します。フロントエンドエンジニアとして働いています。現在はJavaとAWSも勉強しています。どうぞよろしくお願いいたします。',
  audioUrl: '/audio/001.mp3',
  sentences: [
    {
        id: '1-1',
        text: 'はじめまして、ケイと申します。',
        translation: '初次见面，我叫Kei。',
        startTime: 0,
        endTime: 3.5,
        rubyWords: [
          { text: 'はじめまして' },
          { text: '、' },
          { text: 'ケイ' },
          { text: 'と' },
          { text: '申', ruby: 'もう' },
          { text: 'します' },
          { text: '。' }
        ]
    },
    {
        id: '1-2',
        text: 'フロントエンドエンジニアとして働いています。',
        translation: '我是一名前端工程师。',
        startTime: 3.5,
        endTime: 6.8,
        rubyWords: [
          { text: 'フロントエンドエンジニア' },
          { text: 'として' },
          { text: '働', ruby: 'はたら' },
          { text: 'いて' },
          { text: 'います' },
          { text: '。' }
        ]
    },
    {
        id: '1-3',
        text: '現在はJavaとAWSも勉強しています。',
        translation: '我现在也在学习Java和AWS。',
        startTime: 6.8,
        endTime: 9.5,
        rubyWords: [
          { text: '現在', ruby: 'げんざい' },
          { text: 'は' },
          { text: 'Java' },
          { text: 'と' },
          { text: 'AWS' },
          { text: 'も' },
          { text: '勉強', ruby: 'べんきょう' },
          { text: 'しています' },
          { text: '。' }
        ]
    },
    {
        id: '1-4',
        text: 'どうぞよろしくお願いいたします。',
        translation: '请多多关照。',
        startTime: 9.5,
        endTime: 12.8,
        rubyWords: [
          { text: 'どうぞ' },
          { text: 'よろしく' },
          { text: 'お願', ruby: 'ねが' },
          { text: 'いいた' },
          { text: 'します' },
          { text: '。' }
        ]
    },

  ],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

/**
 * 获取模拟文章数据
 */
export const getMockArticle = (): Article => {
  return JSON.parse(JSON.stringify(mockArticle))
}
