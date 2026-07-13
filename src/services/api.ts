import axios from 'axios'
import { Article, ApiResponse, Question, AnswerResult } from '../types'

const API_BASE_URL = '/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// 后端异常时 HTTP 状态仍为 200，错误信息包在 body 里（code !== 200，data 为 null），
// 这里统一转成异常，避免调用方拿到 null 数据
apiClient.interceptors.response.use(res => {
  const body = res.data as ApiResponse<unknown> | undefined
  if (body && typeof body.code === 'number' && body.code !== 200) {
    return Promise.reject(new Error(body.message || '请求失败'))
  }
  return res
})

/**
 * 获取文章列表
 */
export const getArticles = async (): Promise<Article[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Article[]>>('/articles')
    return response.data.data
  } catch (error) {
    console.error('Failed to fetch articles:', error)
    throw error
  }
}

/**
 * 根据ID获取文章详情
 */
export const getArticleById = async (id: string): Promise<Article> => {
  try {
    const response = await apiClient.get<ApiResponse<Article>>(`/articles/${id}`)
    return response.data.data
  } catch (error) {
    console.error(`Failed to fetch article ${id}:`, error)
    throw error
  }
}

/**
 * 获取 mock 文章（带 rubyWords）
 */
export const getMockArticle = async (): Promise<Article> => {
  try {
    const response = await apiClient.get<Article>('/mock/article')
    return response.data
  } catch (error) {
    console.error('Failed to fetch mock article:', error)
    throw error
  }
}

// ==================== Quiz ====================

export const getQuizCategories = async (): Promise<string[]> => {
  const res = await apiClient.get<ApiResponse<string[]>>('/quiz/categories')
  return res.data.data
}

export const getQuizByCategory = async (category: string, lang = 'zh'): Promise<Question[]> => {
  const res = await apiClient.get<ApiResponse<Question[]>>(`/quiz/${category}`, { params: { lang } })
  return res.data.data
}

export const getQuizQuestion = async (id: number): Promise<Question> => {
  const res = await apiClient.get<ApiResponse<Question>>(`/quiz/question/${id}`)
  return res.data.data
}

export const submitAnswer = async (id: number, answer: string): Promise<AnswerResult> => {
  const res = await apiClient.post<ApiResponse<AnswerResult>>(`/quiz/question/${id}/answer`, null, { params: { answer } })
  return res.data.data
}

// ==================== Admin - 题库 ====================

export const adminGetQuestions = async (): Promise<Question[]> => {
  const res = await apiClient.get<ApiResponse<Question[]>>('/admin/questions')
  return res.data.data
}

export const adminCreateQuestion = async (q: Partial<Question>): Promise<Question> => {
  const res = await apiClient.post<ApiResponse<Question>>('/admin/questions', q)
  return res.data.data
}

export const adminUpdateQuestion = async (id: number, q: Partial<Question>): Promise<Question> => {
  const res = await apiClient.put<ApiResponse<Question>>(`/admin/questions/${id}`, q)
  return res.data.data
}

export const adminDeleteQuestion = async (id: number): Promise<void> => {
  await apiClient.delete(`/admin/questions/${id}`)
}

export const adminImportQuestions = async (questions: Partial<Question>[]): Promise<number> => {
  const res = await apiClient.post<ApiResponse<number>>('/admin/questions/import', questions)
  return res.data.data
}

// ==================== Admin - 文章 ====================

export const adminGetArticles = async (): Promise<Article[]> => {
  const res = await apiClient.get<ApiResponse<Article[]>>('/admin/articles')
  return res.data.data
}

export const adminCreateArticle = async (article: Partial<Article>): Promise<Article> => {
  const res = await apiClient.post<ApiResponse<Article>>('/admin/articles', article)
  return res.data.data
}

export const adminUpdateArticle = async (id: string, article: Partial<Article>): Promise<Article> => {
  const res = await apiClient.put<ApiResponse<Article>>(`/admin/articles/${id}`, article)
  return res.data.data
}

export const adminDeleteArticle = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/articles/${id}`)
}

// ==================== Upload ====================

export const uploadAudio = async (file: File): Promise<string> => {
  const form = new FormData()
  form.append('file', file)
  const res = await apiClient.post<ApiResponse<string>>('/upload/audio', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data.data
}

export const uploadQuestionFile = async (file: File): Promise<number> => {
  const form = new FormData()
  form.append('file', file)
  const res = await apiClient.post<ApiResponse<number>>('/upload/questions', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data.data
}

export default apiClient
