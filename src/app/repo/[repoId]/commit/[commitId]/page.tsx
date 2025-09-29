"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import Comments from "@/components/Comments"

export default function CommitDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const repoId = params?.repoId as string
  const commitId = params?.commitId as string

  const [commit, setCommit] = useState<any>(null)
  const [files, setFiles] = useState<any[]>([])
  const [filename, setFilename] = useState("")
  const [content, setContent] = useState("")
  const [error, setError] = useState<string | null>(null)

  // зареждане на commit + files
  useEffect(() => {
    async function loadData() {
      const { data: commitData } = await supabase
        .from("commits")
        .select("id, message, created_at, author_id")
        .eq("id", commitId)
        .single()

      setCommit(commitData)

      const { data: filesData } = await supabase
        .from("files")
        .select("id, filename, content, created_at")
        .eq("commit_id", commitId)
        .order("created_at", { ascending: true })

      setFiles(filesData || [])
    }
    if (commitId) loadData()
  }, [commitId])

  // добавяне на файл
  async function handleAddFile(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!filename.trim() || !content.trim()) {
      setError("Filename and content are required")
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push("/login")
      return
    }

    const { error } = await supabase.from("files").insert([
      {
        commit_id: commitId,
        filename,
        content,
      },
    ])

    if (error) {
      setError(error.message)
    } else {
      setFilename("")
      setContent("")

      // презареждане на файловете
      const { data: filesData } = await supabase
        .from("files")
        .select("id, filename, content, created_at")
        .eq("commit_id", commitId)
        .order("created_at", { ascending: true })

      setFiles(filesData || [])
    }
  }

  if (!commit) return <p className="p-4">Loading commit...</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Commit Details</h1>
      <p className="text-gray-700">{commit.message}</p>
      <p className="text-sm text-gray-500">
        {new Date(commit.created_at).toLocaleString()}
      </p>

      {/* форма за добавяне на файл */}
      <div className="mt-6 mb-6">
        <h2 className="text-xl font-bold mb-2">Add File</h2>
        <form onSubmit={handleAddFile} className="space-y-4">
          <div>
            <label className="block font-medium">Filename</label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="example.txt"
            />
          </div>
          <div>
            <label className="block font-medium">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border p-2 rounded font-mono"
              rows={6}
              placeholder="File content here..."
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add File
          </button>
        </form>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>

      {/* списък с файлове */}
      <h2 className="text-xl font-bold mb-2">Files in this commit</h2>
      <ul className="space-y-3">
        {files.map((f) => (
          <li key={f.id} className="border p-3 rounded">
            <p className="font-medium">{f.filename}</p>
            <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-sm">
              {f.content}
            </pre>
            <p className="text-xs text-gray-500">
              Added: {new Date(f.created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
      {/* секция за коментари */}
      <Comments repoId={repoId} commitId={commitId} />
    </div>
  )
}
