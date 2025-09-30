"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navigation() {
  const pathname = usePathname()

  const linkClass = (path: string) =>
    `px-3 py-2 rounded hover:bg-blue-600 hover:text-white ${
      pathname === path ? "bg-blue-700 text-white" : "text-gray-800"
    }`

  return (
    <nav className="bg-gray-100 px-4 py-2 flex gap-4">
      <Link href="/" className={linkClass("/")}>
        Home
      </Link>
      <Link href="/repo/create" className={linkClass("/repo/create")}>
        New Repo
      </Link>
      <Link href="/login" className={linkClass("/login")}>
        Login
      </Link>
    </nav>
  )
}
