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
    const today = new Date().toISOString().slice(0, 10)
    update((s) => ({
      ...s,
      totalCount: s.totalCount + 1,
      history: [...(s.history ?? []), today],
    }))
  }, [update])

  const undoLast = useCallback(() => {
    update((s) => {
      if (s.totalCount <= 0) return s
      const history = (s.history ?? []).slice(0, -1)
      return { ...s, totalCount: s.totalCount - 1, history }
    })
  }, [update])

  const reset = useCallback(() => {
    save(DEFAULT_STATE)
    setState(DEFAULT_STATE)
  }, [])

  const today = new Date().toISOString().slice(0, 10)
  const daysElapsed = state.startDate ? Math.max(0, daysBetween(state.startDate, today)) : 0
  const daysRemaining = Math.max(0, TOTAL_DAYS - daysElapsed)
  const mantrasRemaining = Math.max(0, TOTAL_TARGET - state.totalCount)

  return {
    startDate: state.startDate,
    totalCount: state.totalCount,
    daysElapsed,
    daysRemaining,
    mantrasRemaining,
    TOTAL_DAYS,
    TOTAL_TARGET,
    setStartDate,
    countMantra,
    undoLast,
    reset,
  }
}
