import { useMemo } from "react"
import { DayPicker} from "react-day-picker"
import { parseISO, isValid, format } from "date-fns"

const ISO_FORMAT = "yyyy-MM-dd"

function toIsoString(date: Date | undefined) {
  return date ? format(date, ISO_FORMAT) : ""
}

function fromIsoString(isoString: string) {
  if (!isoString) return undefined
  const parsed = parseISO(isoString)
  return isValid(parsed) ? parsed : undefined
}



export function DateRangePanel({ activeCell, value, onChange, onComplete }: DateRangePanelProps) {
  const selectedRange = useMemo(
    () => ({
      from: fromIsoString(value?.checkIn),
      to: fromIsoString(value?.checkOut),
    }),
    [value?.checkIn, value?.checkOut]
  )

  function handleSelect(nextRange: { from?: Date; to?: Date } | undefined) {
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


type DateRangePanelProps = {
  activeCell: "checkin" | "checkout"
  value: { checkIn: string, checkOut: string }   // ISO "yyyy-MM-dd" or ""
  onChange: (nextDates: { checkIn: string; checkOut: string }) => void
  onComplete?: () => void                        // called when both dates chosen
}