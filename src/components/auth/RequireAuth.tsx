import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAdminStore } from "@/stores/adminStore"

export function RequireAuth() {
  const isAuthenticated = useAdminStore((s) => s.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
