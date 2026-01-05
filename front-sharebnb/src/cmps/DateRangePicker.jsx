import { useMemo } from "react"
import { DayPicker } from "react-day-picker"
import { parseISO, isValid, format } from "date-fns"

const ISO_FORMAT = "yyyy-MM-dd"

function toIsoString(date) {
  return date ? format(date, ISO_FORMAT) : ""
}

function fromIsoString(isoString) {
  if (!isoString) return undefined
  const parsed = parseISO(isoString)
  return isValid(parsed) ? parsed : undefined
}

/**
 * Props:
 *  - activeCell: "checkin" | "checkout"
 *  - value: { checkIn: string, checkOut: string }   // ISO "yyyy-MM-dd" or ""
 *  - onChange: (nextDates) => void
 *  - onComplete?: () => void                        // called when both dates chosen
 */


export function DateRangePanel({ activeCell, value, onChange, onComplete }) {
  const selectedRange = useMemo(
    () => ({
      from: fromIsoString(value?.checkIn),
      to: fromIsoString(value?.checkOut),
    }),
    [value?.checkIn, value?.checkOut]
  )

  function handleSelect(nextRange) {
    const updatedDates = {
      checkIn: toIsoString(nextRange?.from),
      checkOut: toIsoString(nextRange?.to),
    }
    onChange(updatedDates)

    if (nextRange?.from && nextRange?.to) {
      onComplete?.()
    }
  }

  return (
    <DayPicker
      mode="range"
      selected={selectedRange}
      onSelect={handleSelect}
      numberOfMonths={2}
      showOutsideDays
      defaultMonth={selectedRange.from || selectedRange.to || new Date()}
      initialFocus
    />
  )
}
