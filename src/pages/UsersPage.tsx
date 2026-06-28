import { useEffect, useMemo, useState, type ReactNode } from "react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"
import { PageHeader } from "@/components/layout/PageHeader"
import { AccountStateBadge } from "@/components/shared/AccountStateBadge"
import { PremiumBadge } from "@/components/shared/PremiumBadge"
import { VerifiedIcon } from "@/components/shared/VerifiedIcon"
import { UserAvatar } from "@/components/users/UserAvatar"
import { UserDetailView } from "@/components/users/UserDetailView"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDebouncedValue } from "@/hooks/useDebouncedValue"
import { useUsersList } from "@/hooks/useUsers"
import { useUsersListParams } from "@/hooks/useUsersListParams"
import { ACCOUNT_STATE_OPTIONS, GENDER_OPTIONS } from "@/lib/constants"
import { formatRelativeTime } from "@/lib/formatters"
import type { UserListItem } from "@/types"
import type { AccountState } from "@/types/enums"

const SKELETON_ROWS = 8

const STATE_FILTER_LABELS: Record<string, string> = {
  ALL: "All states",
}

const PREMIUM_FILTER_LABELS: Record<string, string> = {
  ALL: "All users",
  PREMIUM: "Premium only",
  FREE: "Free only",
}

const VERIFIED_FILTER_LABELS: Record<string, string> = {
  ALL: "All verification",
  VERIFIED: "Verified",
  UNVERIFIED: "Unverified",
}

const GENDER_FILTER_LABELS: Record<string, string> = {
  ALL: "All genders",
}

function FilterField({
  label,
  value,
  displayValue,
  onValueChange,
  children,
}: {
  label: string
  value: string
  displayValue: string
  onValueChange: (value: string) => void
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium tracking-[0.12px] text-text-muted uppercase">
        {label}
      </Label>
      <Select value={value} onValueChange={(next) => next && onValueChange(next)}>
        <SelectTrigger className="h-10 w-full rounded-[14px]">
          <SelectValue>{displayValue}</SelectValue>
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </div>
  )
}

function UsersTableSkeleton({ columns }: { columns: number }) {
  return (
    <>
      {Array.from({ length: SKELETON_ROWS }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columns }).map((__, cellIndex) => (
            <TableCell key={cellIndex}>
              {cellIndex === 0 ? (
                <Skeleton className="size-10 rounded-md" />
              ) : (
                <Skeleton className="h-4 w-full max-w-28" />
              )}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

export function UsersPage() {
  const { filters, setFilter, setPage, openUser, closeUser, patchParams } = useUsersListParams()
  const [searchInput, setSearchInput] = useState(filters.search)
  const debouncedSearch = useDebouncedValue(searchInput, 300)

  useEffect(() => {
    setSearchInput(filters.search)
  }, [filters.search])

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      patchParams({ search: debouncedSearch }, { resetPage: true })
    }
  }, [debouncedSearch, filters.search, patchParams])

  const usersQuery = useUsersList(filters)
  const users = usersQuery.data?.users ?? []
  const pagination = usersQuery.data?.pagination

  const columns = useMemo<ColumnDef<UserListItem>[]>(
    () => [
      {
        id: "avatar",
        header: "",
        cell: ({ row }) => (
          <UserAvatar
            src={row.original.primaryPhotoUrl}
            name={row.original.name}
            className="size-10"
          />
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => row.original.name ?? "—",
      },
      {
        accessorKey: "phoneE164",
        header: "Phone",
        cell: ({ row }) => row.original.phoneE164 ?? "—",
      },
      {
        accessorKey: "ageYears",
        header: "Age",
        cell: ({ row }) => row.original.ageYears ?? "—",
      },
      {
        accessorKey: "genderMain",
        header: "Gender",
        cell: ({ row }) => row.original.genderMain ?? "—",
      },
      {
        accessorKey: "accountState",
        header: "Account State",
        cell: ({ row }) => (
          <AccountStateBadge state={row.original.accountState as AccountState} />
        ),
      },
      {
        accessorKey: "premiumStatus",
        header: "Premium",
        cell: ({ row }) => <PremiumBadge status={row.original.premiumStatus} />,
      },
      {
        accessorKey: "isVerified",
        header: "Verified",
        cell: ({ row }) => <VerifiedIcon verified={row.original.isVerified} />,
      },
      {
        accessorKey: "createdAt",
        header: "Joined",
        cell: ({ row }) => formatRelativeTime(row.original.createdAt),
      },
      {
        accessorKey: "lastActiveAt",
        header: "Last Active",
        cell: ({ row }) => formatRelativeTime(row.original.lastActiveAt),
      },
      {
        accessorKey: "reportsAgainstCount",
        header: "Reports",
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            onClick={(event) => {
              event.stopPropagation()
              openUser(row.original.id)
            }}
          >
            View
          </Button>
        ),
      },
    ],
    [openUser]
  )

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: pagination?.totalPages ?? 1,
  })

  const isInitialLoading = usersQuery.isLoading && !usersQuery.data
  const isEmpty = !isInitialLoading && users.length === 0

  if (filters.userId) {
    return <UserDetailView userId={filters.userId} onBack={closeUser} />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Search and filter the live user directory. Click a row to open user details."
      />

      <div className="admin-card p-4 md:p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="space-y-2 md:col-span-2 xl:col-span-3">
            <Label
              htmlFor="users-search"
              className="text-xs font-medium tracking-[0.12px] text-text-muted uppercase"
            >
              Search
            </Label>
            <Input
              id="users-search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Name, phone, or UUID"
              className="h-10 rounded-[14px] border-[0.8px] border-border-input"
            />
          </div>

          <FilterField
            label="Account state"
            value={filters.state}
            displayValue={
              filters.state === "ALL"
                ? STATE_FILTER_LABELS.ALL
                : filters.state.replace(/_/g, " ")
            }
            onValueChange={(value) => setFilter("state", value)}
          >
            <SelectItem value="ALL">All states</SelectItem>
            {ACCOUNT_STATE_OPTIONS.map((state) => (
              <SelectItem key={state} value={state}>
                {state.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </FilterField>

          <FilterField
            label="Premium"
            value={filters.premium}
            displayValue={PREMIUM_FILTER_LABELS[filters.premium] ?? "All users"}
            onValueChange={(value) => setFilter("premium", value)}
          >
            <SelectItem value="ALL">All users</SelectItem>
            <SelectItem value="PREMIUM">Premium only</SelectItem>
            <SelectItem value="FREE">Free only</SelectItem>
          </FilterField>

          <FilterField
            label="Verified"
            value={filters.verified}
            displayValue={VERIFIED_FILTER_LABELS[filters.verified] ?? "All verification"}
            onValueChange={(value) => setFilter("verified", value)}
          >
            <SelectItem value="ALL">All verification</SelectItem>
            <SelectItem value="VERIFIED">Verified</SelectItem>
            <SelectItem value="UNVERIFIED">Unverified</SelectItem>
          </FilterField>

          <FilterField
            label="Gender"
            value={filters.gender}
            displayValue={
              filters.gender === "ALL" ? GENDER_FILTER_LABELS.ALL : filters.gender
            }
            onValueChange={(value) => setFilter("gender", value)}
          >
            <SelectItem value="ALL">All genders</SelectItem>
            {GENDER_OPTIONS.map((gender) => (
              <SelectItem key={gender} value={gender}>
                {gender}
              </SelectItem>
            ))}
          </FilterField>
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        {usersQuery.isError ? (
          <div className="p-8 text-center text-sm text-[#FD1C1C]">
            Unable to load users from the admin API.
          </div>
        ) : (
          <div className="admin-table-scroll">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-surface-input hover:bg-surface-input">
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="text-xs font-medium tracking-[0.12px] text-text-muted"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isInitialLoading ? (
                  <UsersTableSkeleton columns={columns.length} />
                ) : isEmpty ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="py-10 text-center text-text-secondary"
                    >
                      No users match the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="cursor-pointer hover:bg-surface-hover"
                      onClick={() => openUser(row.original.id)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="text-sm">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-border-subtle px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-text-secondary">
            {pagination
              ? `Page ${pagination.page} of ${pagination.totalPages} · ${pagination.total.toLocaleString()} users`
              : `Page ${filters.page}`}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(filters.page - 1)}
              disabled={filters.page <= 1 || usersQuery.isFetching}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(filters.page + 1)}
              disabled={
                !pagination || filters.page >= pagination.totalPages || usersQuery.isFetching
              }
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
