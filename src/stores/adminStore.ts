import { create } from "zustand"
import { clearStoredSession, readStoredSession, type StoredAdminSession } from "@/lib/authStorage"
import { adminApi, persistLoginSession, type AdminLoginResponse } from "@/lib/api"
import type { AdminRole } from "@/types/enums"

type AdminIdentity = {
  id: string
  name: string
  email: string
  role: AdminRole
}

type ToastItem = {
  id: string
  message: string
  variant?: "default" | "error"
}

type AdminStore = {
  accessToken: string | null
  expiresAt: string | null
  admin: AdminIdentity | null
  isAuthenticated: boolean
  sidebarCollapsed: boolean
  toasts: ToastItem[]
  hydrateAuth: () => void
  setSession: (session: AdminLoginResponse) => void
  logout: () => Promise<void>
  setSidebarCollapsed: (collapsed: boolean) => void
  pushToast: (message: string, variant?: "default" | "error") => void
  dismissToast: (id: string) => void
}

function toAdminIdentity(admin: StoredAdminSession["admin"]): AdminIdentity {
  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: "ADMIN",
  }
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  accessToken: null,
  expiresAt: null,
  admin: null,
  isAuthenticated: false,
  sidebarCollapsed: false,
  toasts: [],

  hydrateAuth: () => {
    const stored = readStoredSession()
    if (!stored) return
    set({
      accessToken: stored.accessToken,
      expiresAt: stored.expiresAt,
      admin: toAdminIdentity(stored.admin),
      isAuthenticated: true,
    })
  },

  setSession: (session) => {
    persistLoginSession(session)
    set({
      accessToken: session.accessToken,
      expiresAt: session.expiresAt,
      admin: toAdminIdentity(session.admin),
      isAuthenticated: true,
    })
  },

  logout: async () => {
    const token = get().accessToken
    try {
      if (token) {
        await adminApi.logout()
      }
    } catch {
      /* clear local session even if network logout fails */
    } finally {
      clearStoredSession()
      set({
        accessToken: null,
        expiresAt: null,
        admin: null,
        isAuthenticated: false,
      })
    }
  },

  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  pushToast: (message, variant = "default") =>
    set((state) => ({
      toasts: [...state.toasts, { id: crypto.randomUUID(), message, variant }].slice(-4),
    })),
  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}))

export function formatAdminRole(role: AdminRole): string {
  if (role === "ADMIN") return "Admin"
  return role.charAt(0) + role.slice(1).toLowerCase()
}

export function canAccessChat(_role: AdminRole): boolean {
  return true
}

export function canAccessRevenue(_role: AdminRole): boolean {
  return true
}

export function canAccessBroadcast(_role: AdminRole): boolean {
  return true
}
