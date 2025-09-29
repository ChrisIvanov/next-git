import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"

export default async function Home() {
  const [repos, setRepos] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRepos() {
      const { data, error } = await supabase
        .from("repositories")
        .select("id, name, description")
        .eq("is_public", true)
        .order("created_at", { ascending: false })

      if (!error && data) {
        setRepos(data)
      }
      setLoading(false)
    }
    loadRepos()

     // subscribe за промени в таблицата repositories
    const channel = supabase
      .channel("realtime:repositories")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "repositories" },
        (payload) => {
          console.log("Realtime event:", payload)

          if (payload.eventType === "INSERT") {
            setRepos((prev) => [payload.new, ...prev])
          }

          if (payload.eventType === "UPDATE") {
            setRepos((prev) =>
              prev.map((r) => (r.id === payload.new.id ? payload.new : r))
            )
          }

          if (payload.eventType === "DELETE") {
            setRepos((prev) => prev.filter((r) => r.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

    // филтриране по име
  const filtered = repos.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  )


 return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Public Repositories</h1>

      {/* search bar */}
      <input
        type="text"
        placeholder="Search repositories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border p-2 rounded mb-6"
      />

      {loading && <p>Loading...</p>}

      <ul className="space-y-3">
        {filtered.map((r) => (
          <li key={r.id} className="p-4 border rounded hover:bg-gray-50">
            <Link
              href={`/repo/${r.id}`}
              className="text-blue-600 font-medium hover:underline"
            >
              {r.name}
            </Link>
            <p className="text-sm text-gray-500">{r.description}</p>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && !loading && (
        <p className="text-gray-500 mt-4">No repositories found.</p>
      )}
    </main>
  )
}
