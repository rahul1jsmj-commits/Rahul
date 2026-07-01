import { useState, useRef } from 'react'

const GOLD = '#c9a227'
const GOLD_DIM = '#2a2208'
const GOLD_TRACK = '#1a1505'

export function MantraView({ mantra }) {
  const { startDate, setStartDate } = mantra
  if (!startDate) return <SetupScreen onStart={setStartDate} mantra={mantra} />
  return <CounterScreen mantra={mantra} />
}

function SetupScreen({ onStart, mantra }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const fileRef = useRef(null)

  function handleImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const ok = mantra.importData(ev.target.result)
      if (!ok) alert('Invalid backup file.')
    }
    reader.readAsText(file)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-6 pb-24">
      <div
        style={{
          width: 80, height: 80, borderRadius: '50%',
          background: GOLD_DIM, border: `2px solid ${GOLD}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24, fontSize: 36, color: GOLD, fontWeight: 700,
        }}
      >
        ॐ
      </div>

      <h1 className="text-[26px] font-semibold text-white text-center mb-2">
        Mantra Japa Counter
      </h1>
      <p className="text-neutral-500 text-[14px] text-center mb-10">
        40 days &middot; 100 mantras &middot; One tap at a time
      </p>

      <div className="w-full mb-4">
        <label className="block text-[11px] tracking-widest uppercase mb-2" style={{ color: '#666' }}>
          Start Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            width: '100%', background: '#111', border: '1.5px solid #222',
            borderRadius: 16, padding: '14px 16px', color: '#f5f5f5',
            fontSize: 16, colorScheme: 'dark', outline: 'none',
          }}
        />
      </div>

      <button
        onClick={() => onStart(date)}
        style={{
          width: '100%', padding: '16px', borderRadius: 16,
          background: GOLD, color: '#0a0a0a', fontSize: 16,
          fontWeight: 700, border: 'none', cursor: 'pointer', letterSpacing: '0.03em',
        }}
      >
        Begin Japa
      </button>

      <div className="mt-8 w-full">
        <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: 20 }}>
          <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#444', marginBottom: 12, textAlign: 'center' }}>
            Restore from backup
          </p>
          <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
          <button
            onClick={() => fileRef.current?.click()}
            style={{
              width: '100%', padding: '13px', borderRadius: 14,
              background: '#111', border: '1px solid #222', color: '#888',
              fontSize: 14, cursor: 'pointer',
            }}
          >
            Import backup file
          </button>
        </div>
      </div>
    </div>
  )
}

function CounterScreen({ mantra }) {
  const {
    totalCount,
    daysElapsed,
    daysRemaining,
    mantrasRemaining,
    groupedHistory,
    TOTAL_DAYS,
    TOTAL_TARGET,
    countMantra,
    undoLast,
    correctCount,
    exportData,
    importData,
    reset,
  } = mantra

  const [pressed, setPressed] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [showCorrect, setShowCorrect] = useState(false)
  const [correctInput, setCorrectInput] = useState('')
  const fileRef = useRef(null)

  function handleTap() {
    if (pressed) return
    countMantra()
    setPressed(true)
    setTimeout(() => setPressed(false), 220)
  }

  function handleCorrect() {
    const n = parseInt(correctInput, 10)
    if (!isNaN(n) && n >= 0) {
      correctCount(n)
      setShowCorrect(false)
      setCorrectInput('')
    }
  }

  function handleImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const ok = importData(ev.target.result)
      if (!ok) alert('Invalid backup file.')
    }
    reader.readAsText(file)
  }

  const day = Math.min(daysElapsed + 1, TOTAL_DAYS)
  const SIZE = 272
  const RADIUS = 116
  const circumference = 2 * Math.PI * RADIUS
  const progress = Math.min(totalCount / TOTAL_TARGET, 1)
  const dashOffset = circumference * (1 - progress)
  const done = totalCount >= TOTAL_TARGET

  return (
    <div className="flex flex-col px-5 pt-10 pb-28">
      <p className="text-[11px] tracking-widest uppercase mb-1" style={{ color: '#555' }}>
        Mantra Japa
      </p>
      <h1 className="text-[26px] font-semibold text-white leading-tight mb-1">
        Day {day} of {TOTAL_DAYS}
      </h1>
      <p className="text-[13px] mb-8" style={{ color: '#555' }}>
        {daysRemaining > 0
          ? `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`
          : 'Journey complete'}
      </p>

      {/* "Correct count" banner — shown prominently when count is 0 but days have passed */}
      {totalCount === 0 && daysElapsed > 0 && !showCorrect && (
        <button
          onClick={() => { setShowCorrect(true); setCorrectInput('') }}
          style={{
            width: '100%', marginBottom: 16, padding: '13px 16px',
            borderRadius: 14, background: GOLD_DIM,
            border: `1px solid ${GOLD}50`, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 13, color: GOLD }}>
            Have previous mantras to add?
          </span>
          <span style={{ fontSize: 13, color: GOLD, fontWeight: 700 }}>Correct count →</span>
        </button>
      )}

      {/* Correct count form */}
      {showCorrect && (
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: '#aaa', marginBottom: 12 }}>
            Enter your actual total mantra count so far:
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              type="number"
              min="0"
              max="999"
              value={correctInput}
              onChange={(e) => setCorrectInput(e.target.value)}
              placeholder="e.g. 12"
              autoFocus
              style={{
                flex: 1, padding: '12px 14px', borderRadius: 12,
                background: '#1a1a1a', border: '1px solid #2a2a2a',
                color: '#f5f5f5', fontSize: 18, outline: 'none',
                colorScheme: 'dark',
              }}
            />
            <button
              onClick={handleCorrect}
              style={{
                padding: '12px 18px', borderRadius: 12,
                background: GOLD, color: '#0a0a0a',
                fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer',
              }}
            >
              Set
            </button>
            <button
              onClick={() => setShowCorrect(false)}
              style={{
                padding: '12px 14px', borderRadius: 12,
                background: '#1a1a1a', color: '#666',
                fontSize: 14, border: 'none', cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Progress ring + tap button */}
      <div className="flex justify-center mb-8">
        <div style={{ position: 'relative', width: SIZE, height: SIZE }}>
          <svg width={SIZE} height={SIZE} style={{ position: 'absolute', top: 0, left: 0 }}>
            <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} stroke="#1a1a1a" strokeWidth="7" fill="none" />
            <circle
              cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
              stroke={done ? '#4caf79' : GOLD}
              strokeWidth="7" fill="none" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{
                transform: `rotate(-90deg)`,
                transformOrigin: `${SIZE / 2}px ${SIZE / 2}px`,
                transition: 'stroke-dashoffset 0.5s cubic-bezier(0.4,0,0.2,1)',
              }}
            />
          </svg>

          <button
            onClick={handleTap}
            style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 200, height: 200, borderRadius: '50%',
              background: pressed ? '#1c1507' : GOLD_TRACK,
              border: `2px solid ${pressed ? GOLD + '60' : '#1f1a08'}`,
              transform: `translate(-50%, -50%) scale(${pressed ? 0.94 : 1})`,
              transition: 'transform 0.12s cubic-bezier(0.4,0,0.2,1), background 0.12s, border-color 0.12s',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', userSelect: 'none', WebkitUserSelect: 'none',
            }}
          >
            <span style={{ fontSize: 58, fontWeight: 700, color: done ? '#4caf79' : GOLD, lineHeight: 1 }}>
              {totalCount}
            </span>
            <span style={{ fontSize: 11, color: '#666', marginTop: 6, letterSpacing: '0.12em' }}>
              {done ? 'COMPLETE' : 'TAP'}
            </span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatCard label="Total Done" value={totalCount} gold />
        <StatCard label="Remaining" value={mantrasRemaining} />
        <StatCard label="Days Left" value={daysRemaining} />
        <StatCard label="Days Done" value={Math.max(0, day - 1)} />
      </div>

      {/* Actions row */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 4 }}>
        {totalCount > 0 && (
          <button
            onClick={undoLast}
            style={{ color: '#444', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0' }}
          >
            Undo last
          </button>
        )}
        {!showCorrect && (
          <button
            onClick={() => { setShowCorrect(true); setCorrectInput(String(totalCount)) }}
            style={{ color: '#444', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0' }}
          >
            Correct count
          </button>
        )}
      </div>

      {/* Backup / restore */}
      <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
        <button
          onClick={exportData}
          style={{
            flex: 1, padding: '11px', borderRadius: 12,
            background: '#111', border: '1px solid #1a1a1a',
            color: '#555', fontSize: 13, cursor: 'pointer',
          }}
        >
          Export backup
        </button>
        <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
        <button
          onClick={() => fileRef.current?.click()}
          style={{
            flex: 1, padding: '11px', borderRadius: 12,
            background: '#111', border: '1px solid #1a1a1a',
            color: '#555', fontSize: 13, cursor: 'pointer',
          }}
        >
          Import backup
        </button>
      </div>

      {/* Reset */}
      <div className="mt-4 text-center">
        {!showReset ? (
          <button
            onClick={() => setShowReset(true)}
            style={{ color: '#2a2a2a', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Reset counter
          </button>
        ) : (
          <div className="rounded-2xl p-4" style={{ background: '#111', border: '1px solid #1f1f1f' }}>
            <p style={{ color: '#888', fontSize: 13, marginBottom: 12 }}>
              Reset all progress? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowReset(false)}
                style={{ flex: 1, padding: '10px', borderRadius: 12, background: '#1a1a1a', color: '#888', border: 'none', cursor: 'pointer', fontSize: 14 }}
              >
                Cancel
              </button>
              <button
                onClick={() => { reset(); setShowReset(false) }}
                style={{ flex: 1, padding: '10px', borderRadius: 12, background: '#2a0808', color: '#e05555', border: 'none', cursor: 'pointer', fontSize: 14 }}
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Daily log */}
      {groupedHistory.length > 0 && <DailyLog entries={groupedHistory} />}
    </div>
  )
}

function DailyLog({ entries }) {
  const [open, setOpen] = useState(false)

  function formatDate(dateStr) {
    const d = new Date(dateStr + 'T12:00:00')
    const today = new Date()
    today.setHours(12, 0, 0, 0)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    if (d.toDateString() === today.toDateString()) return 'Today'
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  return (
    <div className="mt-6">
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', background: 'none',
          border: 'none', cursor: 'pointer', padding: '0 0 12px 0',
        }}
      >
        <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555' }}>
          Daily Log · {entries.length} day{entries.length !== 1 ? 's' : ''}
        </p>
        <span style={{ color: '#444', fontSize: 16, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          ›
        </span>
      </button>

      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {entries.map(({ date, count, times }) => (
            <div
              key={date}
              style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 14, padding: '12px 14px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: times.some(Boolean) ? 8 : 0 }}>
                <span style={{ fontSize: 14, color: '#d0d0d0', fontWeight: 500 }}>
                  {formatDate(date)}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: GOLD, background: GOLD_DIM, borderRadius: 8, padding: '2px 10px' }}>
                  {count} {count === 1 ? 'mantra' : 'mantras'}
                </span>
              </div>
              {times.some(Boolean) && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {times.map((t, i) =>
                    t ? (
                      <span key={i} style={{ fontSize: 11, color: '#555', background: '#181818', borderRadius: 6, padding: '2px 8px' }}>
                        {t}
                      </span>
                    ) : null
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, gold }) {
  return (
    <div
      style={{
        background: gold ? GOLD_DIM : '#111',
        border: `1px solid ${gold ? '#2e1e04' : '#1a1a1a'}`,
        borderRadius: 16, padding: '14px 16px',
      }}
    >
      <p style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: gold ? GOLD + 'aa' : '#555', marginBottom: 4 }}>
        {label}
      </p>
      <p style={{ fontSize: 30, fontWeight: 700, color: gold ? GOLD : '#f5f5f5', lineHeight: 1 }}>
        {value}
      </p>
    </div>
  )
}
