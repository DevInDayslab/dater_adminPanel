import { useCallback, useMemo } from "react"
import { useSearchParams } from "react-router-dom"

export type UsersListFilters = {
  search: string
  state: string
  premium: string
  verified: string
  gender: string
  page: number
  userId: string | null
}

export function useUsersListParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo<UsersListFilters>(
    () => ({
      search: searchParams.get("search") ?? "",
      state: searchParams.get("state") ?? "ALL",
      premium: searchParams.get("premium") ?? "ALL",
      verified: searchParams.get("verified") ?? "ALL",
      gender: searchParams.get("gender") ?? "ALL",
      page: Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1),
      userId: searchParams.get("userId"),
    }),
    [searchParams]
  )

  const patchParams = useCallback(
    (patch: Partial<UsersListFilters>, options?: { resetPage?: boolean }) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current)

          const apply = (key: keyof UsersListFilters, value: string | number | null | undefined) => {
            if (value == null || value === "" || value === "ALL") {
              next.delete(key)
              return
            }
            next.set(key, String(value))
          }

          if (patch.search !== undefined) apply("search", patch.search)
          if (patch.state !== undefined) apply("state", patch.state)
          if (patch.premium !== undefined) apply("premium", patch.premium)
          if (patch.verified !== undefined) apply("verified", patch.verified)
          if (patch.gender !== undefined) apply("gender", patch.gender)

          if (options?.resetPage) {
            next.delete("page")
          } else if (patch.page !== undefined) {
            if (patch.page <= 1) next.delete("page")
            else next.set("page", String(patch.page))
          }

          if (patch.userId !== undefined) {
            if (!patch.userId) next.delete("userId")
            else next.set("userId", patch.userId)
          }

          return next
        },
        { replace: true }
      )
    },
    [setSearchParams]
  )

  const setFilter = useCallback(
    (key: Exclude<keyof UsersListFilters, "page" | "userId">, value: string) => {
      patchParams({ [key]: value }, { resetPage: true })
    },
    [patchParams]
  )

  const setPage = useCallback(
    (page: number) => {
      patchParams({ page })
    },
    [patchParams]
  )

  const openUser = useCallback(
    (userId: string) => {
      patchParams({ userId })
    },
    [patchParams]
  )

  const closeUser = useCallback(() => {
    patchParams({ userId: null })
  }, [patchParams])

  return {
    filters,
    setFilter,
    setPage,
    openUser,
    closeUser,
    patchParams,
  }
}
