import 'react-day-picker/dist/style.css'
import { DayPicker } from 'react-day-picker'
import { parseISO, isValid, format } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'

/** ---------- helpers (same API you used) ---------- */
const ISO_FORMAT = 'yyyy-MM-dd'
const toIso = d => (d ? format(d, ISO_FORMAT) : '')
const fromIso = s => (s ? (isValid(parseISO(s)) ? parseISO(s) : undefined) : undefined)

/** tiny hook to detect mobile */
function useIsMobile(q = '(max-width: 768px)') {
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' ? window.matchMedia(q).matches : false
    )
    useEffect(() => {
        if (typeof window === 'undefined') return
        const mql = window.matchMedia(q)
        const onChange = e => setIsMobile(e.matches)
        mql.addEventListener?.('change', onChange)
        return () => mql.removeEventListener?.('change', onChange)
    }, [q])
    return isMobile
}

/**
 * Props:
 * - value: { checkIn, checkOut }
 * - onChange: ({checkIn, checkOut}) => void
 * - onToleranceChange?: (days:number) => void   // 0,1,2,3,7  (optional)
 * - fromMonth?: Date                              // default: today
 */
export function DateRangePanel({ value, onChange, onToleranceChange, fromMonth }) {
    const isMobile = useIsMobile()
    const today = useMemo(() => new Date(), [])
    const minMonth = fromMonth || today

    const selectedRange = useMemo(
        () => ({ from: fromIso(value?.checkIn), to: fromIso(value?.checkOut) }),
        [value?.checkIn, value?.checkOut]
    )

    const [hoverDay, setHoverDay] = useState()
    const hoverRange = useMemo(() => {
        if (!selectedRange.from || selectedRange.to || !hoverDay) return undefined
        const a = selectedRange.from
        const b = hoverDay
        return a <= b ? { from: a, to: b } : { from: b, to: a }
    }, [selectedRange, hoverDay])

    useEffect(() => {
        if (selectedRange.to) setHoverDay(undefined)
    }, [selectedRange.to])

    function handleSelect(range) {
        onChange({
            checkIn: toIso(range?.from),
            checkOut: toIso(range?.to),
        })
    }

    // optional: “Exact / +days” chips
    const [tolerance, setTolerance] = useState(0)
    function chooseTolerance(d) {
        setTolerance(d)
        onToleranceChange?.(d)
    }

    return (
        <div className="date-range-panel">
            <DayPicker
                className="stay-picker"
                mode="range"
                selected={selectedRange}
                onSelect={handleSelect}
                modifiers={hoverRange ? { rangeHover: hoverRange } : undefined}
                modifiersClassNames={{ rangeHover: 'is-range-hover' }}
                onDayMouseEnter={(d) => {
                    // don’t try to hover on touch
                    if (isMobile) return
                    if (selectedRange.from && !selectedRange.to) setHoverDay(d)
                }}
                onDayMouseLeave={() => setHoverDay(undefined)}
                numberOfMonths={isMobile ? 1 : 2}
                showOutsideDays
                fromMonth={minMonth}
                disabled={{ before: today }}
                defaultMonth={selectedRange.from || selectedRange.to || today}
                initialFocus
                styles={{
                    root: {
                        // tokens for consistent sizing
                        '--rdp-months-gap': isMobile ? '16px' : '32px',
                        '--rdp-day-width': '46px',
                        '--rdp-day-height': '46px',
                        '--rdp-day_button-width': '44px',
                        '--rdp-day_button-height': '44px',
                        '--rdp-day_button-border-radius': '999px',
                        '--rdp-accent-color': '#111',
                        '--rdp-accent-background-color': '#fff',
                        '--rdp-range_middle-background-color': '#F3F4F6',
                        '--rdp-range_middle-color': '#111',
                        '--rdp-outside-opacity': '0.35',
                        '--rdp-disabled-opacity': '0.35',
                        '--rdp-weekday-opacity': '0.75',
                        '--rdp-nav_button-width': '36px',
                        '--rdp-nav_button-height': '36px',
                        '--rdp-animation_duration': '.25s',
                        '--rdp-animation_timing': 'cubic-bezier(.2,.8,.2,1)',
                    },
                }}
            />
        </div>
    )
}
