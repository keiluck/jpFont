import { useState } from 'react'
import { Question } from '../../types'
import './AdminPage.css'

const MOCK_QUESTIONS: Question[] = [
  {
    id: 1, category: 'AWS', difficulty: 'EASY', type: 'SINGLE',
    titleZh: 'AWS S3 是什么服务？', titleJa: 'AWS S3とは何のサービスですか？', titleEn: 'What is AWS S3?',
    options: [],
  },
  {
    id: 2, category: 'IT', difficulty: 'MEDIUM', type: 'SINGLE',
    titleZh: 'HTTP 状态码 404 代表什么？', titleJa: 'HTTPステータスコード404は何を意味しますか？', titleEn: 'What does HTTP 404 mean?',
    options: [],
  },
]

interface Props {
  onAdd: () => void
  onEdit: (id: number) => void
}

export default function AdminQuestionList({ onAdd, onEdit }: Props) {
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS)
  const [uploading, setUploading] = useState(false)

  const handleDelete = (id: number) => {
    if (window.confirm('确认删除这道题？')) {
      setQuestions(questions.filter(q => q.id !== id))
    }
  }

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const text = await file.text()
      const data: Question[] = JSON.parse(text)
      setQuestions(prev => [...prev, ...data])
      alert(`成功导入 ${data.length} 道题目`)
    } catch {
      alert('文件格式错误，请上传 JSON 格式题库')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="admin-content">
      <div className="admin-content-header">
        <h2>题库管理</h2>
        <div className="admin-actions">
          <label className="import-btn">
            {uploading ? '导入中...' : '📂 导入 JSON'}
            <input type="file" accept=".json" hidden onChange={handleFileImport} />
          </label>
          <button className="add-btn" onClick={onAdd}>+ 新建题目</button>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>分类</th>
            <th>难度</th>
            <th>题目（中文）</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {questions.map(q => (
            <tr key={q.id}>
              <td>{q.id}</td>
              <td><span className="tag">{q.category}</span></td>
              <td>{q.difficulty}</td>
              <td className="td-title">{q.titleZh}</td>
              <td>
                <button className="edit-btn" onClick={() => onEdit(q.id)}>编辑</button>
                <button className="del-btn" onClick={() => handleDelete(q.id)}>删除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
