import { useState, useCallback } from 'react'

const STORAGE_KEY = 'mantra_japa_v1'
export const TOTAL_DAYS = 40
export const TOTAL_TARGET = 100

const DEFAULT_STATE = {
  startDate: null,
  totalCount: 0,
  history: [],
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : DEFAULT_STATE
  } catch {
    return DEFAULT_STATE
  }
}

function save(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function daysBetween(a, b) {
  const da = new Date(a)
  const db = new Date(b)
  da.setHours(0, 0, 0, 0)
  db.setHours(0, 0, 0, 0)
  return Math.floor((db - da) / 86400000)
}

export function useMantra() {
  const [state, setState] = useState(() => load())

  const update = useCallback((updater) => {
    setState((prev) => {
      const next = updater(prev)
      save(next)
      return next
    })
  }, [])

  const setStartDate = useCallback((dateStr) => {
    update(() => ({ ...DEFAULT_STATE, startDate: dateStr }))
  }, [update])

  const countMantra = useCallback(() => {
    update((s) => ({
      ...s,
      totalCount: s.totalCount + 1,
      // store full ISO timestamp so we can show time-of-tap in the log
      history: [...(s.history ?? []), new Date().toISOString()],
    }))
  }, [update])

  const undoLast = useCallback(() => {
    update((s) => {
      if (s.totalCount <= 0) return s
      const history = (s.history ?? []).slice(0, -1)
      return { ...s, totalCount: s.totalCount - 1, history }
    })
  }, [update])

  const correctCount = useCallback((count) => {
    update((s) => ({ ...s, totalCount: Math.max(0, Math.floor(count)) }))
  }, [update])

  const exportData = useCallback(() => {
    const raw = localStorage.getItem(STORAGE_KEY) ?? '{}'
    const blob = new Blob([raw], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mantra-japa-backup.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  const importData = useCallback((jsonStr) => {
    try {
      const parsed = JSON.parse(jsonStr)
      if (typeof parsed.totalCount !== 'number') throw new Error('invalid')
      save(parsed)
      setState(parsed)
      return true
    } catch {
      return false
    }
  }, [])

  const reset = useCallback(() => {
    save(DEFAULT_STATE)
    setState(DEFAULT_STATE)
  }, [])

  const today = new Date().toISOString().slice(0, 10)
  const daysElapsed = state.startDate ? Math.max(0, daysBetween(state.startDate, today)) : 0
  const daysRemaining = Math.max(0, TOTAL_DAYS - daysElapsed)
  const mantrasRemaining = Math.max(0, TOTAL_TARGET - state.totalCount)

  // Group history by calendar date, newest first.
  // Entries may be 'YYYY-MM-DD' (old) or full ISO timestamp (new) — both work.
  const groupedHistory = (() => {
    const map = {}
    for (const entry of (state.history ?? [])) {
      const date = entry.slice(0, 10)
      const isTimestamp = entry.length > 10
      const time = isTimestamp
        ? new Date(entry).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        : null
      if (!map[date]) map[date] = []
      map[date].push(time)
    }
    return Object.entries(map)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, times]) => ({ date, count: times.length, times }))
  })()

  return {
    startDate: state.startDate,
    totalCount: state.totalCount,
    daysElapsed,
    daysRemaining,
    mantrasRemaining,
    groupedHistory,
    TOTAL_DAYS,
    TOTAL_TARGET,
    setStartDate,
    countMantra,
    undoLast,
    correctCount,
    exportData,
    importData,
    reset,
  }
}
