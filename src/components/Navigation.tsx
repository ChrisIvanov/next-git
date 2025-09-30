"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import type { User } from "@supabase/supabase-js"

export default function Navigation() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    loadUser()

    // слушане за промени в сесията (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
    router.push("/")
  }

  return (
    <nav className="flex items-center justify-between bg-gray-100 px-6 py-3 shadow">
      {/* Лява част - линкове */}
      <div className="flex space-x-4">
        <Link href="/" className="text-blue-600 font-medium hover:underline">
          Home
        </Link>

        {user && (
          <Link href="/repo/create" className="text-blue-600 font-medium hover:underline">
            New Repo
          </Link>
        )}
      </div>

      {/* Дясна част - login/logout */}
      <div>
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        ) : (
          <Link
            href="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}
