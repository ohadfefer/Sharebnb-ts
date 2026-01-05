/**
 * GuestsPanel
 * Props from DynamicPanel:
 *  - value: { guests, checkIn, ... } OR directly { adults, children, infants, pets }
 *  - onChange: (partialFilter) => void   // we call onChange({ guests: next })
 *  - onComplete?: () => void
 */

export function GuestsPanel({ value = {}, onChange, onComplete }) {
  // Accept either shape: {guests:{...}} or {adults,...}
  const src = value.guests ?? value
  const guests = {
    adults: Number(src.adults ?? 0),
    children: Number(src.children ?? 0),
    infants: Number(src.infants ?? 0),
    pets: Number(src.pets ?? 0),
  }

  const rows = [
    { key: "adults", label: "Adults", desc: "Ages 13 or above" },
    { key: "children", label: "Children", desc: "Ages 2 – 12" },
    { key: "infants", label: "Infants", desc: "Under 2" },
    { key: "pets", label: "Pets", desc: <a href="#" onClick={(e) => e.preventDefault()}>Bringing a service animal?</a> },
  ]

  function commit(next) {
    onChange?.({ guests: next })
  }

  function inc(key) {
    const next = { ...guests, [key]: guests[key] + 1 }
    if (key === "children" && next.adults === 0) next.adults = 1
    commit(next)
  }

  function dec(key) {
    let next = { ...guests, [key]: Math.max(0, guests[key] - 1) }
    // Keep at least 1 adult if there are children
    if (key === "adults" && next.adults === 0 && (next.children > 0)) {
      next.adults = 1
    }
    commit(next)
  }

  function canDec(key) {
    if (guests[key] <= 0) return false
    // Can't drop adults to 0 while children exist
    if (key === "adults" && guests.adults === 1 && guests.children > 0) return false
    return true
  }

  function clearAll() {
    commit({ adults: 0, children: 0, infants: 0, pets: 0 })
  }

  return (
    <div className="guests-panel">
      {rows.map((row) => (
        <div key={row.key} className="guest-row">
          <div className="guest-labels">
            <div className="label">{row.label}</div>
            <div className="desc">{row.desc}</div>
          </div>

          <div className="guest-controls">
            <button
              type="button"
              className="round minus"
              aria-label={`Decrease ${row.label}`}
              disabled={!canDec(row.key)}
              onClick={() => dec(row.key)}
            >−</button>

            <span className="count" aria-live="polite">{guests[row.key]}</span>

            <button
              type="button"
              className="round plus"
              aria-label={`Increase ${row.label}`}
              onClick={() => inc(row.key)}
            >+</button>
          </div>
        </div>
      ))}
    </div>
  )
}
