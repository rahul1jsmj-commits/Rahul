export function DotGrid({ completionRatio }) {
  const today = new Date()
  const days = []

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    days.push(key)
  }

  return (
    <div className="grid gap-[6px]" style={{ gridTemplateColumns: 'repeat(10, 1fr)' }}>
      {days.map((key) => {
        const ratio = completionRatio(key)
        const isFuture = key > today.toISOString().slice(0, 10)
        const isToday = key === today.toISOString().slice(0, 10)
        return (
          <Dot key={key} ratio={ratio} isFuture={isFuture} isToday={isToday} />
        )
      })}
    </div>
  )
}

function Dot({ ratio, isFuture, isToday }) {
  let bg
  if (isFuture) {
    bg = 'transparent'
  } else if (ratio === 0) {
    bg = 'transparent'
  } else {
    const lightness = Math.round(90 - ratio * 85)
    bg = `hsl(0,0%,${lightness}%)`
  }

  const borderColor = isFuture ? '#222' : isToday ? '#666' : '#333'

  return (
    <div
      style={{
        aspectRatio: '1',
        borderRadius: '50%',
        background: bg,
        border: `1.5px solid ${borderColor}`,
        transition: 'background 0.3s ease',
      }}
    />
  )
}
