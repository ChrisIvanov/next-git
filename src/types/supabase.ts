export interface Repo {
  id: string
  name: string
  description?: string | null
  owner_id?: string
  is_public: boolean
  created_at: string
}

export interface Commit {
  id: string
  repo_id: string
  author_id?: string | null
  message: string
  created_at: string
}

export interface File {
  id: string
  commit_id: string
  filename: string
  content?: string | null
  created_at: string
}

export interface Comment {
  id: string
  repo_id: string
  commit_id?: string | null
  author_id?: string | null
  content: string
  created_at: string
}

export interface RepoPreview {
  id: string
  name: string
  description?: string | null
}

