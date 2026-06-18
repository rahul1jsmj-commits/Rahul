import { useState, useCallback } from 'react'

const STORAGE_KEY = 'habit_tracker_v1'

const DEFAULT_STATE = {
  habits: [],
  completions: {},
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

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function useHabits() {
  const [state, setState] = useState(() => load())

  const update = useCallback((updater) => {
    setState((prev) => {
      const next = updater(prev)
      save(next)
      return next
    })
  }, [])

  const addHabit = useCallback((name) => {
    update((s) => ({
      ...s,
      habits: [
        ...s.habits,
        { id: crypto.randomUUID(), name: name.trim() },
      ],
    }))
  }, [update])

  const removeHabit = useCallback((id) => {
    update((s) => ({
      ...s,
      habits: s.habits.filter((h) => h.id !== id),
      completions: Object.fromEntries(
        Object.entries(s.completions).map(([date, day]) => {
          const { [id]: _, ...rest } = day
          return [date, rest]
        })
      ),
    }))
  }, [update])

  const renameHabit = useCallback((id, name) => {
    update((s) => ({
      ...s,
      habits: s.habits.map((h) => (h.id === id ? { ...h, name } : h)),
    }))
  }, [update])

  const toggleToday = useCallback((habitId) => {
    const key = todayKey()
    update((s) => {
      const day = s.completions[key] ?? {}
      return {
        ...s,
        completions: {
          ...s.completions,
          [key]: { ...day, [habitId]: !day[habitId] },
        },
      }
    })
  }, [update])

  const completionRatio = useCallback((dateKey, habitId) => {
    if (state.habits.length === 0) return 0
    const day = state.completions[dateKey] ?? {}
    if (habitId !== undefined) {
      return day[habitId] ? 1 : 0
    }
    const done = state.habits.filter((h) => day[h.id]).length
    return done / state.habits.length
  }, [state])

  const todayCompletions = useCallback(() => {
    return state.completions[todayKey()] ?? {}
  }, [state])

  return {
    habits: state.habits,
    addHabit,
    removeHabit,
    renameHabit,
    toggleToday,
    completionRatio,
    todayCompletions,
    todayKey,
  }
}
