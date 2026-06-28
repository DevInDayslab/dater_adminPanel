import { Navigate, Route, Routes, useParams } from "react-router-dom"
import { RequireAuth } from "@/components/auth/RequireAuth"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { DashboardPage } from "@/pages/DashboardPage"
import { LoginPage } from "@/pages/LoginPage"
import { UsersPage } from "@/pages/UsersPage"
import { ReportsPage } from "@/pages/ReportsPage"
import { RevenuePage } from "@/pages/RevenuePage"
import { NotificationsPage } from "@/pages/NotificationsPage"
import { ProductsPage } from "@/pages/ProductsPage"

function LegacyUserDetailRedirect() {
  const { userId } = useParams()
  if (!userId) return <Navigate to="/users" replace />
  return <Navigate to={`/users?userId=${userId}`} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/:userId/*" element={<LegacyUserDetailRedirect />} />
          <Route path="moderation" element={<Navigate to="/reports" replace />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="revenue" element={<RevenuePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  )
}
