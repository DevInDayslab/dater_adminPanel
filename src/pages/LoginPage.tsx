import { useState } from "react"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { DaterWordmark } from "@/components/layout/DaterWordmark"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ApiError, adminApi } from "@/lib/api"
import { useAdminStore } from "@/stores/adminStore"

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useAdminStore((s) => s.isAuthenticated)
  const setSession = useAdminStore((s) => s.setSession)
  const pushToast = useAdminStore((s) => s.pushToast)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const redirectTo =
    (location.state as { from?: string } | null)?.from?.startsWith("/") &&
    (location.state as { from?: string }).from !== "/login"
      ? (location.state as { from: string }).from
      : "/dashboard"

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const session = await adminApi.login(email.trim(), password)
      setSession(session)
      pushToast("Signed in successfully")
      navigate(redirectTo, { replace: true })
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Login failed"
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-surface-shell px-4 py-10">
      <div className="w-full max-w-[420px] shrink-0">
        <div className="admin-card p-8 shadow-sm">
          <div className="mb-8">
            <DaterWordmark />
            <p className="mt-3 text-sm text-text-secondary">
              Sign in to the Dater admin panel.
            </p>
          </div>

          <form className="w-full space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dater.app"
                className="h-10"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10"
                required
              />
            </div>

            {error ? <p className="text-sm text-[#FD1C1C]">{error}</p> : null}

            <Button type="submit" size="lg" className="h-10 w-full" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
