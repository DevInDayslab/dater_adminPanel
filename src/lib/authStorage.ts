export type StoredAdminSession = {
  accessToken: string
  expiresAt: string
  admin: {
    id: string
    name: string
    email: string
  }
}

const STORAGE_KEY = "dater_admin_session"

export function readStoredSession(): StoredAdminSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredAdminSession
    if (!parsed?.accessToken || !parsed?.admin?.id) return null
    if (parsed.expiresAt && new Date(parsed.expiresAt).getTime() <= Date.now()) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return parsed
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function writeStoredSession(session: StoredAdminSession) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function clearStoredSession() {
  localStorage.removeItem(STORAGE_KEY)
}
