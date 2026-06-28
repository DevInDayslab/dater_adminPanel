/** Fixed demo UUIDs for stable routing in mock UI */
export const USER_IDS = {
  priya: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  arjun: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  nina: "c3d4e5f6-a7b8-9012-cdef-123456789012",
  rahul: "d4e5f6a7-b8c9-0123-def0-234567890123",
  aisha: "e5f6a7b8-c9d0-1234-ef01-345678901234",
  dev: "f6a7b8c9-d0e1-2345-f012-456789012345",
  maya: "a7b8c9d0-e1f2-3456-0123-567890123456",
  karan: "b8c9d0e1-f2a3-4567-1234-678901234567",
} as const

export const PHOTO_URLS = {
  priya1: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop",
  priya2: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop",
  arjun1: "https://images.unsplash.com/photo-1507003211169?w=400&h=500&fit=crop",
  nina1: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop",
  rahul1: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop",
  aisha1: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=500&fit=crop",
  selfie: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop",
  story: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop",
} as const

export function daysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

export function hoursAgo(hours: number): string {
  const d = new Date()
  d.setHours(d.getHours() - hours)
  return d.toISOString()
}

export function daysFromNow(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}
