import { useState, useEffect } from "react"

export interface Release {
  id: number
  tag_name: string
  name: string | null
  body: string | null
  published_at: string | null
  html_url: string
}

export function useChangelog() {
  const [releases, setReleases] = useState<Release[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)

    fetch("https://api.github.com/repos/robinebers/openusage/releases")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch releases")
        return res.json()
      })
      .then((data) => {
        if (mounted) {
          setReleases(data)
          setError(null)
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message)
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [])

  return { releases, loading, error }
}
