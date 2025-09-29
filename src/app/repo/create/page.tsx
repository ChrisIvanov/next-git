"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function CreateRepoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  // form state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // check auth
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login") // redirect ако не е логнат
      } else {
        setLoading(false)
      }
    }
    checkAuth()
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!name.trim()) {
      setError("Repository name is required")
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError("You must be logged in")
      return
    }

    const { error } = await supabase.from("repositories").insert([
      {
        name,
        description,
        owner_id: user.id,
      },
    ])

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setName("")
      setDescription("")
    }
  }

  if (loading) return <p className="p-4">Checking authentication...</p>

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Repository</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="MyRepo"
          />
        </div>
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Short description"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create
        </button>
      </form>

      {error && <p className="mt-4 text-red-600">Error: {error}</p>}
      {success && <p className="mt-4 text-green-600">Repository created successfully!</p>}
    </div>
  )
}
