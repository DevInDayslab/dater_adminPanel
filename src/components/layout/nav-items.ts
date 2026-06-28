import {
  Bell,
  DollarSign,
  LayoutDashboard,
  Flag,
  Package,
  Users,
} from "lucide-react"

export type NavItem = {
  label: string
  href: string
  icon: typeof LayoutDashboard
}

export const primaryNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/users", icon: Users },
  { label: "Reports", href: "/reports", icon: Flag },
  { label: "Revenue", href: "/revenue", icon: DollarSign },
  { label: "Broadcast", href: "/notifications", icon: Bell },
  { label: "Products", href: "/products", icon: Package },
]

export const userDetailTabs = [
  { label: "Profile", slug: "profile" },
  { label: "Photos & Verification", slug: "photos" },
  { label: "Discovery Filters", slug: "filters" },
  { label: "Trust & Safety", slug: "trust" },
  { label: "Content", slug: "content" },
  { label: "Chat Threads", slug: "chat" },
  { label: "Social Graph", slug: "social" },
  { label: "Revenue", slug: "revenue" },
] as const
