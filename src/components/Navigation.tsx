import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="bg-gray-200 p-2 flex gap-4">
      <Link href="/">Home</Link>
      <Link href="/repo/create">New Repo</Link>
      <Link href="/login">Login</Link>
    </nav>
  )
}