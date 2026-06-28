import { Menu } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatAdminRole, useAdminStore } from "@/stores/adminStore"

type AdminTopBarProps = {
  title?: string
  onMenuClick?: () => void
  showMobileMenu?: boolean
}

export function AdminTopBar({
  title,
  onMenuClick,
  showMobileMenu = false,
}: AdminTopBarProps) {
  const admin = useAdminStore((s) => s.admin)

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border-subtle bg-white px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        {showMobileMenu ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Open navigation menu"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="size-5" />
          </Button>
        ) : null}
        {title ? <h6 className="truncate lg:hidden">{title}</h6> : null}
      </div>

      <div className="hidden items-center gap-3 md:flex">
        {admin ? (
          <>
            <div className="text-right">
              <p className="text-sm font-medium text-black">{admin.name}</p>
              <p className="text-xs text-text-muted">{admin.email}</p>
            </div>
            <Badge variant="outline" className="rounded-full border-black text-xs font-medium text-black">
              {formatAdminRole(admin.role)}
            </Badge>
          </>
        ) : null}
      </div>
    </header>
  )
}
