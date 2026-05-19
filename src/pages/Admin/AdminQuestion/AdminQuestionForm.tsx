import { useState } from 'react'
import '@/pages/Admin/AdminHome/AdminPage.css'

interface Props {
  editId: number | null
  onBack: () => void
}

export default function AdminQuestionForm({ editId, onBack }: Props) {
  const isEdit = editId !== null
  const [form, setForm] = useState({
    category: 'AWS',
    difficulty: 'EASY',
    type: 'SINGLE',
    titleZh: '',
    titleJa: '',
    titleEn: '',
    explanationZh: '',
    explanationJa: '',
    explanationEn: '',
    options: [
      { optionKey: 'A', contentZh: '', contentJa: '', contentEn: '', isCorrect: false },
      { optionKey: 'B', contentZh: '', contentJa: '', contentEn: '', isCorrect: false },
      { optionKey: 'C', contentZh: '', contentJa: '', contentEn: '', isCorrect: false },
      { optionKey: 'D', contentZh: '', contentJa: '', contentEn: '', isCorrect: false },
    ],
  })

  const handleOptionChange = (idx: number, field: string, value: string | boolean) => {
    const opts = [...form.options]
    opts[idx] = { ...opts[idx], [field]: value }
    setForm({ ...form, options: opts })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(isEdit ? '题目已更新（mock）' : '题目已创建（mock）')
    onBack()
  }

  return (
    <div className="admin-content">
      <div className="admin-content-header">
        <h2>{isEdit ? '编辑题目' : '新建题目'}</h2>
        <button className="back-link" onClick={onBack}>← 返回列表</button>
      </div>

      <form className="question-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>分类
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              <option value="AWS">AWS</option>
              <option value="IT">IT</option>
              <option value="JAPANESE">日語</option>
            </select>
          </label>
          <label>难度
            <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
              <option value="EASY">简单</option>
              <option value="MEDIUM">中等</option>
              <option value="HARD">困难</option>
            </select>
          </label>
          <label>题型
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="SINGLE">单选</option>
              <option value="MULTIPLE">多选</option>
            </select>
          </label>
        </div>

        <div className="form-section">题目内容</div>
        <label>中文题目 <input value={form.titleZh} onChange={e => setForm({ ...form, titleZh: e.target.value })} required /></label>
        <label>日語題目 <input value={form.titleJa} onChange={e => setForm({ ...form, titleJa: e.target.value })} /></label>
        <label>English Title <input value={form.titleEn} onChange={e => setForm({ ...form, titleEn: e.target.value })} /></label>

        <div className="form-section">选项</div>
        {form.options.map((opt, idx) => (
          <div key={opt.optionKey} className="option-row">
            <span className="opt-key-label">{opt.optionKey}</span>
            <input placeholder="中文" value={opt.contentZh} onChange={e => handleOptionChange(idx, 'contentZh', e.target.value)} />
            <input placeholder="日語" value={opt.contentJa} onChange={e => handleOptionChange(idx, 'contentJa', e.target.value)} />
            <input placeholder="English" value={opt.contentEn} onChange={e => handleOptionChange(idx, 'contentEn', e.target.value)} />
            <label className="correct-check">
              <input type="checkbox" checked={opt.isCorrect} onChange={e => handleOptionChange(idx, 'isCorrect', e.target.checked)} />
              正解
            </label>
          </div>
        ))}

        <div className="form-section">解析</div>
        <label>中文解析 <textarea value={form.explanationZh} onChange={e => setForm({ ...form, explanationZh: e.target.value })} /></label>
        <label>日語解析 <textarea value={form.explanationJa} onChange={e => setForm({ ...form, explanationJa: e.target.value })} /></label>
        <label>English Explanation <textarea value={form.explanationEn} onChange={e => setForm({ ...form, explanationEn: e.target.value })} /></label>

        <div className="form-footer">
          <button type="button" className="cancel-btn" onClick={onBack}>取消</button>
          <button type="submit" className="save-btn">保存</button>
        </div>
      </form>
    </div>
  )
}
