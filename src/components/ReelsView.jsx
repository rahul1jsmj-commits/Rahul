import { useState } from 'react'

const ACCENT = '#d6469a'

export function ReelsView({ reels }) {
  const { transcripts, loading, submitting, error, addFromUrl, remove, fetchOne, exportUrl } = reels
  const [url, setUrl] = useState('')
  const [localError, setLocalError] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [detailCache, setDetailCache] = useState({})

  async function handleSubmit() {
    const trimmed = url.trim()
    if (!trimmed) return
    setLocalError(null)
    try {
      await addFromUrl(trimmed)
      setUrl('')
    } catch (err) {
      setLocalError(err.message)
    }
  }

  async function toggleExpand(id) {
    if (expandedId === id) {
      setExpandedId(null)
      return
    }
    setExpandedId(id)
    if (!detailCache[id]) {
      const full = await fetchOne(id)
      setDetailCache((prev) => ({ ...prev, [id]: full }))
    }
  }

  return (
    <div className="flex flex-col px-5 pt-12 pb-28">
      <p className="text-[13px] tracking-widest uppercase text-neutral-500 mb-1">Reels</p>
      <h1 className="text-[28px] font-semibold text-white leading-tight mb-8">Transcribe a reel</h1>

      <div
        className="flex items-center gap-2 px-4 py-3 rounded-2xl mb-2"
        style={{ background: '#111', border: '1.5px solid #1e1e1e' }}
      >
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Paste an instagram.com/reel/… link"
          className="flex-1 bg-transparent text-[15px] text-white outline-none placeholder-neutral-700"
        />
        <button
          onClick={handleSubmit}
          disabled={submitting || !url.trim()}
          className="flex-shrink-0 px-4 py-2 rounded-xl text-[13px] font-semibold"
          style={{
            background: submitting || !url.trim() ? '#1e1e1e' : ACCENT,
            color: submitting || !url.trim() ? '#666' : '#0a0a0a',
            border: 'none',
            cursor: submitting || !url.trim() ? 'default' : 'pointer',
          }}
        >
          {submitting ? 'Transcribing…' : 'Go'}
        </button>
      </div>

      {(localError || error) && (
        <p className="text-[12px] mb-4" style={{ color: '#e05555' }}>
          {localError || error}
        </p>
      )}

      <p className="text-[12px] text-neutral-700 mb-6">
        {submitting
          ? 'Downloading and transcribing — this can take up to a minute…'
          : 'Works with public Instagram Reels/posts that have audio.'}
      </p>

      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] tracking-widest uppercase" style={{ color: '#555' }}>
          Saved · {transcripts.length}
        </p>
        {transcripts.length > 0 && (
          <a href={exportUrl} className="text-[12px] font-medium" style={{ color: ACCENT }}>
            Export all ↓
          </a>
        )}
      </div>

      {loading && transcripts.length === 0 && (
        <p className="text-[13px] text-neutral-600">Loading…</p>
      )}

      {!loading && transcripts.length === 0 && (
        <p className="text-[13px] text-neutral-600">
          No transcripts yet — paste a link above to get started.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {transcripts.map((t) => {
          const isOpen = expandedId === t.id
          const full = detailCache[t.id]
          return (
            <div
              key={t.id}
              className="rounded-2xl overflow-hidden"
              style={{ background: '#111', border: '1.5px solid #1e1e1e' }}
            >
              <button
                onClick={() => toggleExpand(t.id)}
                className="w-full flex items-start justify-between gap-3 px-4 py-3 text-left"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] text-neutral-100 font-medium truncate">
                    {t.title || 'Untitled reel'}
                  </p>
                  <p className="text-[12px] text-neutral-600 mt-0.5 truncate">
                    {new Date(t.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    {' · '}
                    {t.preview}…
                  </p>
                </div>
                <span
                  style={{
                    color: '#444',
                    fontSize: 16,
                    transform: isOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s',
                    flexShrink: 0,
                  }}
                >
                  ›
                </span>
              </button>

              {isOpen && (
                <div className="px-4 pb-4">
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[12px] block mb-3"
                    style={{ color: ACCENT }}
                  >
                    View original on Instagram ↗
                  </a>
                  <p className="text-[14px] text-neutral-300 leading-relaxed whitespace-pre-wrap mb-3">
                    {full ? full.transcript : 'Loading transcript…'}
                  </p>
                  <button
                    onClick={() => remove(t.id)}
                    className="text-[12px]"
                    style={{ color: '#e05555', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
