import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'
import CategoryPage from './pages/CategoryPage/CategoryPage'
import ReaderPage from './pages/ReaderPage/ReaderPage'
import QuizPage from './pages/QuizPage/QuizPage'
import QuizCategoryPage from './pages/QuizCategoryPage/QuizCategoryPage'
import QuizDetailPage from './pages/QuizDetailPage/QuizDetailPage'
import AdminPage from './pages/AdminPage/AdminPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 语音跟读 */}
        <Route path="/" element={<HomePage />} />
        <Route path="/:lang/:category" element={<CategoryPage />} />
        <Route path="/:lang/:category/article/:id" element={<ReaderPage />} />
        {/* 刷题 */}
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/quiz/:category" element={<QuizCategoryPage />} />
        <Route path="/quiz/:category/:id" element={<QuizDetailPage />} />
        {/* 后台管理 */}
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
