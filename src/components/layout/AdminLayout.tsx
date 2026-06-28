import { useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { AdminSidebar } from "@/components/layout/AdminSidebar"
import { AdminTopBar } from "@/components/layout/AdminTopBar"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useAdminStore } from "@/stores/adminStore"
import { cn } from "@/lib/utils"

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/users": "Users",
  "/reports": "Reports",
  "/revenue": "Revenue",
  "/notifications": "Broadcast",
  "/products": "Products",
}

export function AdminLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const sidebarCollapsed = useAdminStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useAdminStore((s) => s.setSidebarCollapsed)
  const { pathname } = useLocation()

  const basePath = pathname.startsWith("/users/")
    ? "/users"
    : pathname.split("/").slice(0, 2).join("/") || "/dashboard"
  const pageTitle = pageTitles[basePath] ?? "Admin"

  return (
    <TooltipProvider>
      <div className="min-h-svh bg-surface-shell lg:bg-white">
        <div className="flex min-h-svh">
          <div
            className={cn(
              "hidden shrink-0 lg:sticky lg:top-0 lg:block lg:h-svh",
              sidebarCollapsed ? "lg:w-[72px]" : "lg:w-60"
            )}
          >
            <AdminSidebar
              collapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
          </div>

          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetContent side="left" className="w-[85%] max-w-xs border-r border-border-subtle p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>Admin panel sections</SheetDescription>
              </SheetHeader>
              <AdminSidebar onNavigate={() => setMobileNavOpen(false)} className="border-r-0" />
            </SheetContent>
          </Sheet>

          <div className="flex min-h-svh min-w-0 flex-1 flex-col">
            <AdminTopBar
              title={pageTitle}
              onMenuClick={() => setMobileNavOpen(true)}
              showMobileMenu
            />

            <main className="flex-1 px-4 py-6 md:px-6 md:py-8 lg:px-8">
              <div className="mx-auto w-full max-w-[1200px]">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
