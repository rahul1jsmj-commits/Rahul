import { DotGrid } from './DotGrid'

export function DashboardView({ habits, completionRatio }) {
  return (
    <div className="flex flex-col px-5 pt-12 pb-28">
      <p className="text-[13px] tracking-widest uppercase text-neutral-500 mb-1">
        Dashboard
      </p>
      <h1 className="text-[28px] font-semibold text-white leading-tight mb-8">
        Last 30 days
      </h1>

      {habits.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-center pt-20">
          <div>
            <p className="text-neutral-500 text-base mb-2">No habits yet</p>
            <p className="text-neutral-600 text-sm">Add habits in Settings →</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {habits.map((habit) => (
            <HabitTrack key={habit.id} habit={habit} completionRatio={completionRatio} />
          ))}

          {habits.length > 1 && (
            <OverallTrack habits={habits} completionRatio={completionRatio} />
          )}
        </div>
      )}
    </div>
  )
}

function HabitTrack({ habit, completionRatio }) {
  const singleHabitRatio = (dateKey) => {
    return completionRatio(dateKey, habit.id)
  }

  return (
    <div>
      <p className="text-[15px] font-medium text-neutral-300 mb-3">{habit.name}</p>
      <DotGrid completionRatio={singleHabitRatio} />
    </div>
  )
}

function OverallTrack({ habits, completionRatio }) {
  return (
    <div className="pt-4 border-t border-neutral-900">
      <p className="text-[13px] text-neutral-600 uppercase tracking-widest mb-3">
        Overall
      </p>
      <DotGrid completionRatio={completionRatio} />
    </div>
  )
}
