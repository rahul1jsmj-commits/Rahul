import { useState, useEffect, useCallback } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787'

export function useTranscripts() {
  const [transcripts, setTranscripts] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/transcripts`)
      if (!res.ok) throw new Error('Failed to load transcripts.')
      setTranscripts(await res.json())
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount
    refresh()
  }, [refresh])

  const addFromUrl = useCallback(async (url) => {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/transcripts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Transcription failed.')
      setTranscripts((prev) => [data, ...prev])
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSubmitting(false)
    }
  }, [])

  const remove = useCallback(async (id) => {
    setTranscripts((prev) => prev.filter((t) => t.id !== id))
    await fetch(`${API_BASE}/api/transcripts/${id}`, { method: 'DELETE' })
  }, [])

  const fetchOne = useCallback(async (id) => {
    const res = await fetch(`${API_BASE}/api/transcripts/${id}`)
    if (!res.ok) throw new Error('Not found')
    return res.json()
  }, [])

  return {
    transcripts,
    loading,
    submitting,
    error,
    addFromUrl,
    remove,
    fetchOne,
    exportUrl: `${API_BASE}/api/export`,
  }
}
