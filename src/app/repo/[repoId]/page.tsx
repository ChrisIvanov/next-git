import RepoClient from "@/components/RepoClient"
import type { Metadata } from "next"
import { supabase } from "@/lib/supabaseClient"

interface Props {
  params: { repoId: string }
}

// SEO metadata (работи само в Server Component)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: repo } = await supabase
    .from("repositories")
    .select("name, description")
    .eq("id", params.repoId)
    .single()

  return {
    title: repo ? `${repo.name} - NextGit` : "Repository - NextGit",
    description: repo?.description || "Repository details",
  }
}

export default function RepoPage({ params }: Props) {
  return <RepoClient repoId={params.repoId} />
}
