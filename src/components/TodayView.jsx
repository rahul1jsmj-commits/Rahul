export function TodayView({ habits, todayCompletions, toggleToday }) {
  const today = new Date()
  const label = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const completions = todayCompletions()
  const doneCount = habits.filter((h) => completions[h.id]).length

  return (
    <div className="flex flex-col flex-1 px-5 pt-12 pb-28">
      <p className="text-[13px] tracking-widest uppercase text-neutral-500 mb-1">
        Today
      </p>
      <h1 className="text-[28px] font-semibold text-white leading-tight mb-8">
        {label}
      </h1>

      {habits.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-center">
          <div>
            <p className="text-neutral-500 text-base mb-2">No habits yet</p>
            <p className="text-neutral-600 text-sm">Add habits in Settings →</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 flex-1">
            {habits.map((habit) => {
              const done = !!completions[habit.id]
              return (
                <button
                  key={habit.id}
                  onClick={() => toggleToday(habit.id)}
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl transition-all active:scale-[0.98]"
                  style={{
                    background: done ? '#1a1a1a' : '#111',
                    border: `1.5px solid ${done ? '#3a3a3a' : '#1e1e1e'}`,
                  }}
                >
                  <div
                    className="flex-shrink-0 rounded-full transition-all"
                    style={{
                      width: 28,
                      height: 28,
                      background: done ? '#f5f5f5' : 'transparent',
                      border: `2px solid ${done ? '#f5f5f5' : '#444'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {done && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path
                          d="M2.5 7L5.5 10L11.5 4"
                          stroke="#0a0a0a"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className="text-[17px] font-medium flex-1 text-left"
                    style={{ color: done ? '#f5f5f5' : '#888' }}
                  >
                    {habit.name}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-8 text-center">
            <p className="text-neutral-600 text-[13px]">
              {doneCount} of {habits.length} done
            </p>
          </div>
        </>
      )}
    </div>
  )
}
