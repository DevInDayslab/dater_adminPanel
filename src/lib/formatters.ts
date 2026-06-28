import { formatDistanceToNow, format, parseISO } from "date-fns"

function parseApiDate(value: string | null | undefined): Date | null {
  if (!value) return null
  const trimmed = value.trim()
  if (!trimmed) return null

  const isoParsed = parseISO(trimmed)
  if (!Number.isNaN(isoParsed.getTime())) return isoParsed

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [year, month, day] = trimmed.split("-").map(Number)
    const dateOnly = new Date(year, month - 1, day)
    if (!Number.isNaN(dateOnly.getTime())) return dateOnly
  }

  return null
}

export function formatRelativeTime(iso: string | null | undefined): string {
  const parsed = parseApiDate(iso)
  if (!parsed) return "—"
  return formatDistanceToNow(parsed, { addSuffix: true })
}

export function formatDateTime(iso: string | null | undefined): string {
  const parsed = parseApiDate(iso)
  if (!parsed) return "—"
  return format(parsed, "MMM d, yyyy · h:mm a")
}

export function formatDate(iso: string | null | undefined): string {
  const parsed = parseApiDate(iso)
  if (!parsed) return "—"
  return format(parsed, "MMM d, yyyy")
}

export function formatCurrencyInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPercent(value: number, digits = 1): string {
  const sign = value > 0 ? "+" : ""
  return `${sign}${value.toFixed(digits)}%`
}

export function maskPhone(phone: string | null | undefined): string {
  if (!phone) return "—"
  if (phone.length < 6) return phone
  return `${phone.slice(0, 3)} •••• ••${phone.slice(-2)}`
}

export function formatHeightInches(inches: number | null | undefined): string {
  if (!inches) return "—"
  const feet = Math.floor(inches / 12)
  const rem = inches % 12
  return `${feet}'${rem}"`
}

export function formatAccountStateLabel(state: string): string {
  return state
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function formatDeltaLabel(delta: number, windowLabel: string): string {
  return `${formatPercent(delta)} vs ${windowLabel}`
}

export function truncateUuid(id: string): string {
  return `${id.slice(0, 8)}…`
}

export function formatIpAddress(ip: string | null | undefined): string {
  if (!ip) return "—"
  let trimmed = ip.trim()
  if (trimmed.startsWith("::ffff:")) {
    trimmed = trimmed.slice("::ffff:".length)
  }
  return trimmed.split("/")[0]
}

type ReportLike = {
  reporterId: string | null
  reporterName: string
  reason: string
  filedByAdmin?: boolean
}

export function normalizeAdminFiledReport<T extends ReportLike>(report: T): T {
  if (report.filedByAdmin) return report
  const match = report.reason.match(/^\[Admin(?:: ([^\]]+))?\]\s*(.*)$/)
  if (!match) return report
  const adminName = (match[1] || "Admin").trim() || "Admin"
  const userReason = (match[2] || "").trim()
  return {
    ...report,
    reporterId: null,
    reporterName: adminName === "Admin" ? "Admin" : `Admin · ${adminName}`,
    reason: userReason || report.reason,
    filedByAdmin: true,
  }
}
