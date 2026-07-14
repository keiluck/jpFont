import { Navigate } from 'react-router-dom'
import { isAdminLoggedIn } from '@/services/api'

/** 路由守卫：未登录访问 /admin/* 时重定向到登录页 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace />
  }
  return <>{children}</>
}
