import { parseISO, isValid, format } from "date-fns"

export function formatForDisplay(isoString) {
  if (!isoString) return ""
  const parsed = parseISO(isoString)
  return isValid(parsed) ? format(parsed, "MMM d") : ""
}
