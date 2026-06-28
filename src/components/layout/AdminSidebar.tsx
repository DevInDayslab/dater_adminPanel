import { NavLink, useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { DaterWordmark } from "@/components/layout/DaterWordmark"
import { primaryNavItems } from "@/components/layout/nav-items"
import { formatAdminRole, useAdminStore } from "@/stores/adminStore"
import { Button } from "@/components/ui/button"

type AdminSidebarProps = {
  onNavigate?: () => void
  className?: string
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export function AdminSidebar({
  onNavigate,
  className,
  collapsed = false,
  onToggleCollapse,
}: AdminSidebarProps) {
  const navigate = useNavigate()
  const admin = useAdminStore((s) => s.admin)
  const logout = useAdminStore((s) => s.logout)

  async function handleLogout() {
    await logout()
    navigate("/login", { replace: true })
  }

  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col border-r border-border-subtle bg-white transition-[width] duration-200",
        collapsed ? "w-[72px] p-2" : "w-60 p-4",
        className
      )}
    >
      <div className={cn("pb-4", collapsed ? "px-1 pt-2" : "pt-2")}>
        {!collapsed ? (
          <>
            <DaterWordmark />
            <p className="mt-2 text-[11px] font-medium tracking-[0.11px] text-text-muted uppercase">
              Admin Panel
            </p>
          </>
        ) : (
          <div className="flex justify-center">
            <span className="font-wordmark text-xl uppercase text-black">D</span>
          </div>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {primaryNavItems.map(({ label, href, icon: Icon }) => (
            <NavLink
              key={href}
              to={href}
              onClick={onNavigate}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                cn(
                  "relative flex items-center gap-2 rounded-md py-3 text-[15px] font-medium leading-5 transition-colors",
                  collapsed ? "justify-center px-2" : "px-3",
                  isActive
                    ? "bg-surface-input text-black before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-black"
                    : "text-text-secondary hover:bg-surface-input hover:text-black"
                )
              }
            >
              <Icon className="size-[18px] shrink-0" strokeWidth={1.75} />
              {!collapsed ? <span className="truncate">{label}</span> : null}
            </NavLink>
          ))}

      </nav>

      <div className={cn("mt-auto space-y-2 border-t border-border-subtle pt-4", collapsed && "px-1")}>
        {!collapsed && admin ? (
          <div className="px-1">
            <p className="truncate text-sm font-medium text-black">{admin.name}</p>
            <p className="truncate text-xs text-text-muted">{formatAdminRole(admin.role)}</p>
          </div>
        ) : null}
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          className={cn("w-full justify-start text-text-secondary", collapsed && "justify-center")}
          onClick={() => void handleLogout()}
        >
          <LogOut className="size-4" />
          {!collapsed ? "Logout" : null}
        </Button>
        {onToggleCollapse ? (
          <Button
            variant="ghost"
            size="icon"
            className="hidden w-full md:inline-flex"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </Button>
        ) : null}
      </div>
    </aside>
  )
}
