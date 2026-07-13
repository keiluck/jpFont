import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from '@/pages/PC/HomePage/HomePage'
import CategoryPage from '@/pages/PC/CategoryPage/CategoryPage'
import ReaderPage from '@/pages/PC/ReaderPage/ReaderPage'
import QuizPage from '@/pages/PC/QuizPage/QuizPage'
import QuizCategoryPage from '@/pages/PC/QuizCategoryPage/QuizCategoryPage'
import QuizDetailPage from '@/pages/PC/QuizDetailPage/QuizDetailPage'
import AdminPage from '@/pages/Admin/AdminHome/AdminPage'
import MobileHomePage from '@/pages/Mobile/HomePage/MobileHomePage'
import MobileReaderPage from '@/pages/Mobile/ReaderPage/MobileReaderPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 语音跟读 PC */}
        <Route path="/" element={<HomePage />} />
        <Route path="/:lang/:category" element={<CategoryPage />} />
        <Route path="/:lang/:category/article/:id" element={<ReaderPage />} />
        {/* 刷题 */}
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/quiz/:category" element={<QuizCategoryPage />} />
        <Route path="/quiz/:category/:id" element={<QuizDetailPage />} />
        {/* 后台管理 */}
        <Route path="/admin" element={<AdminPage />} />
        {/* 手机端跟读 */}
        <Route path="/m" element={<MobileHomePage />} />
        <Route path="/m/:lang/:category/article/:id" element={<MobileReaderPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
