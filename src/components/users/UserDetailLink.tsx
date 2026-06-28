import { Link, useSearchParams } from "react-router-dom"
import type { MouseEvent, ReactNode } from "react"

type UserDetailLinkProps = {
  userId: string
  children: ReactNode
  className?: string
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
}

export function UserDetailLink({ userId, children, className, onClick }: UserDetailLinkProps) {
  const [searchParams] = useSearchParams()
  const next = new URLSearchParams(searchParams)
  next.set("userId", userId)

  return (
    <Link to={`/users?${next.toString()}`} className={className} onClick={onClick}>
      {children}
    </Link>
  )
}
