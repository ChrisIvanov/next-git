import { supabase } from '@/lib/supabaseClient'

interface RepoPageProps {
  params: { id: string }
}

export default async function RepoPage({ params }: RepoPageProps) {
  const { data: repo, error } = await supabase
    .from('repositories')
    .select('id, name, description, created_at')
    .eq('id', params.id)
    .single()
  if (error) {
    return <div className="p-4 text-red-600">Error: {error.message}</div>
  }
  if (!repo) {
    return <div className="p-4">Repository not found</div>
  }
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{repo.name}</h1>
      <p className="mt-2 text-gray-600">{repo.description}</p>
      <p className="mt-2 text-sm text-gray-500">Created at: {new Date(repo.created_at).toLocaleString()}</p>
    </div>
  )
}