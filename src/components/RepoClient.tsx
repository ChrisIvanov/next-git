"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Repo, Commit } from "@/types/supabase"

export default function RepoClient({ repoId }: { repoId: string }) {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [repo, setRepo] = useState<Repo | null>(null)
    const [commits, setCommits] = useState<Commit[]>([])

  // зареждане на репо + комити
  useEffect(() => {
    async function loadData() {
      const { data: repoData } = await supabase
        .from("repositories")
        .select("*")
        .eq("id", repoId)
        .single()

      setRepo(repoData)

      const { data: commitData } = await supabase
        .from("commits")
        .select("id, repo_id, author_id, message, created_at")
        .eq("repo_id", repoId)
        .order("created_at", { ascending: false })

      setCommits(commitData || [])
    }
    if (repoId) loadData()
  }, [repoId])

  // създаване на нов commit
  async function handleCommit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!message.trim()) {
      setError("Commit message is required")
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push("/login")
      return
    }

    const { error } = await supabase.from("commits").insert([
      { repo_id: repoId, author_id: user.id, message }
    ])

    if (error) {
      setError(error.message)
    } else {
      setMessage("")
      const { data: commitData } = await supabase
        .from("commits")
        .select("id, repo_id, author_id, message, created_at")
        .eq("repo_id", repoId)
        .order("created_at", { ascending: false })
      setCommits(commitData || [])
    }
  }

  if (!repo) return <p className="p-4">Loading repository...</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{repo.name}</h1>
      <p className="text-gray-600 mb-6">{repo.description}</p>

      <form onSubmit={handleCommit} className="mb-6 space-y-4">
        <div>
          <label className="block font-medium">Commit message</label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="e.g. Initial commit"
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Commit
        </button>
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <h2 className="text-xl font-bold mb-2">Commit history</h2>
      <ul className="space-y-2">
        {commits.map((c) => (
          <li key={c.id} className="border p-3 rounded">
            <p className="font-medium">{c.message}</p>
            <p className="text-sm text-gray-500">
              {new Date(c.created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
