import { useState } from 'react'

export function SettingsView({ habits, addHabit, removeHabit, renameHabit }) {
  const [input, setInput] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')

  const handleAdd = () => {
    const trimmed = input.trim()
    if (!trimmed || habits.length >= 5) return
    addHabit(trimmed)
    setInput('')
  }

  const startEdit = (habit) => {
    setEditingId(habit.id)
    setEditValue(habit.name)
  }

  const commitEdit = () => {
    if (editValue.trim()) renameHabit(editingId, editValue.trim())
    setEditingId(null)
  }

  return (
    <div className="flex flex-col px-5 pt-12 pb-28">
      <p className="text-[13px] tracking-widest uppercase text-neutral-500 mb-1">
        Settings
      </p>
      <h1 className="text-[28px] font-semibold text-white leading-tight mb-8">
        Your habits
      </h1>

      <div className="flex flex-col gap-3 mb-8">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{ background: '#111', border: '1.5px solid #1e1e1e' }}
          >
            {editingId === habit.id ? (
              <input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={(e) => e.key === 'Enter' && commitEdit()}
                className="flex-1 bg-transparent text-[16px] text-white outline-none"
              />
            ) : (
              <span
                className="flex-1 text-[16px] text-neutral-200"
                onClick={() => startEdit(habit)}
              >
                {habit.name}
              </span>
            )}
            <button
              onClick={() => removeHabit(habit.id)}
              className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: '#1e1e1e' }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 2L10 10M10 2L2 10" stroke="#666" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {habits.length < 5 && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-2"
          style={{ background: '#111', border: '1.5px solid #1e1e1e' }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Add a habit…"
            className="flex-1 bg-transparent text-[16px] text-white outline-none placeholder-neutral-700"
          />
          {input.trim() && (
            <button
              onClick={handleAdd}
              className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: '#f5f5f5' }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 2V10M2 6H10" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      )}

      <p className="text-[12px] text-neutral-700 mt-2">
        {habits.length}/5 habits · tap a name to rename
      </p>

      <div className="mt-12 pt-6 border-t border-neutral-900">
        <p className="text-[12px] text-neutral-700 leading-relaxed">
          Add this page to your iPhone home screen via Safari → Share → Add to Home Screen
        </p>
      </div>
    </div>
  )
}
