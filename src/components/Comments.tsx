"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

interface CommentsProps {
  repoId: string
  commitId?: string
}

export default function Comments({ repoId, commitId }: CommentsProps) {
  const router = useRouter()
  const [comments, setComments] = useState<any[]>([])
  const [content, setContent] = useState("")
  const [error, setError] = useState<string | null>(null)

  // зареждане на коментари
  useEffect(() => {
    async function loadComments() {
      let query = supabase
        .from("comments")
        .select("id, content, created_at, author_id")
        .eq("repo_id", repoId)
        .order("created_at", { ascending: false })

      if (commitId) query = query.eq("commit_id", commitId)

      const { data } = await query
      setComments(data || [])
    }

    loadComments()

    // realtime subscription
    const channel = supabase
      .channel("comments-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments" },
        (payload) => {
          setComments((prev) => [payload.new, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [repoId, commitId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!content.trim()) {
      setError("Comment cannot be empty")
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push("/login")
      return
    }

    const { error } = await supabase.from("comments").insert([
      {
        repo_id: repoId,
        commit_id: commitId || null,
        author_id: user.id,
        content,
      },
    ])

    if (error) {
      setError(error.message)
    } else {
      setContent("")
    }
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-2">Comments</h3>

      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <textarea
          className="w-full border p-2 rounded"
          rows={3}
          placeholder="Add a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Post Comment
        </button>
      </form>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <ul className="space-y-3">
        {comments.map((c) => (
          <li key={c.id} className="border p-2 rounded">
            <p>{c.content}</p>
            <p className="text-xs text-gray-500">
              {new Date(c.created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
