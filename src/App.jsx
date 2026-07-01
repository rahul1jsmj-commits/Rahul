import { useState } from 'react'
import { useHabits } from './hooks/useHabits'
import { useMantra } from './hooks/useMantra'
import { TodayView } from './components/TodayView'
import { DashboardView } from './components/DashboardView'
import { SettingsView } from './components/SettingsView'
import { MantraView } from './components/MantraView'

export default function App() {
  const [tab, setTab] = useState('japa')
  const {
    habits,
    addHabit,
    removeHabit,
    renameHabit,
    toggleToday,
    completionRatio,
    todayCompletions,
  } = useHabits()
  const mantra = useMantra()

  return (
    <div className="flex flex-col min-h-dvh max-w-md mx-auto relative">
      <main className="flex-1 overflow-y-auto">
        {tab === 'japa' && <MantraView mantra={mantra} />}
        {tab === 'today' && (
          <TodayView
            habits={habits}
            todayCompletions={todayCompletions}
            toggleToday={toggleToday}
          />
        )}
        {tab === 'dashboard' && (
          <DashboardView habits={habits} completionRatio={completionRatio} />
        )}
        {tab === 'settings' && (
          <SettingsView
            habits={habits}
            addHabit={addHabit}
            removeHabit={removeHabit}
            renameHabit={renameHabit}
          />
        )}
      </main>

      <nav
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md flex items-center justify-around"
        style={{
          background: 'rgba(10,10,10,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid #1a1a1a',
          paddingBottom: 'max(env(safe-area-inset-bottom), 16px)',
          paddingTop: '12px',
        }}
      >
        <NavButton active={tab === 'japa'} onClick={() => setTab('japa')} label="Japa" icon={<JapaIcon />} />
        <NavButton active={tab === 'today'} onClick={() => setTab('today')} label="Today" icon={<TodayIcon />} />
        <NavButton active={tab === 'dashboard'} onClick={() => setTab('dashboard')} label="Stats" icon={<GridIcon />} />
        <NavButton active={tab === 'settings'} onClick={() => setTab('settings')} label="Settings" icon={<SettingsIcon />} />
      </nav>
    </div>
  )
}

function NavButton({ active, onClick, label, icon }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 px-6 py-1"
      style={{ color: active ? '#f5f5f5' : '#555' }}
    >
      <span style={{ transform: active ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.15s' }}>
        {icon}
      </span>
      <span className="text-[10px] tracking-wide">{label}</span>
    </button>
  )
}

function JapaIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="8.5" stroke="currentColor" strokeWidth="1.5" />
      <text x="11" y="15.5" textAnchor="middle" fontSize="10" fill="currentColor" fontWeight="600">ॐ</text>
    </svg>
  )
}

function TodayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 7V11L14 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="3" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="13" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="13" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M11 4v1.5M11 16.5V18M4 11h1.5M16.5 11H18M5.93 5.93l1.06 1.06M14.01 14.01l1.06 1.06M5.93 16.07l1.06-1.06M14.01 7.99l1.06-1.06"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      />
    </svg>
  )
}
