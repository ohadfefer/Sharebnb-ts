export function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

export function makeLorem(size = 100) {
    var words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

export function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}


export function randomPastTime() {
    const HOUR = 1000 * 60 * 60
    const DAY = 1000 * 60 * 60 * 24
    const WEEK = 1000 * 60 * 60 * 24 * 7

    const pastTime = getRandomIntInclusive(HOUR, WEEK)
    return Date.now() - pastTime
}

export function debounce(func, timeout = 300) {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => { func.apply(this, args) }, timeout)
    }
}

export function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

export function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return (data) ? JSON.parse(data) : undefined
}


// Turn the current filter into URLSearchParams
export function buildSearchParams(filter = {}) {
    const params = new URLSearchParams()

    const { address, checkIn, checkOut, guests } = filter

    if (address) params.set("address", address)
    if (checkIn) params.set("checkIn", checkIn)
    if (checkOut) params.set("checkOut", checkOut)

    // ---- flatten guests ----
    if (typeof guests === "number") {
        if (guests > 0) params.set("adults", String(guests))
    } else if (guests && typeof guests === "object") {
        for (const [k, v] of Object.entries(guests)) {
            const n = Number(v) || 0
            if (n > 0) params.set(k, String(n))
        }
    }

    return params;
}

export function parseSearchParams(searchParams) {
    const params = searchParams instanceof URLSearchParams
        ? searchParams
        : new URLSearchParams(searchParams)

    const filter = {}
    const value = (key) => params.get(key) || ""

    if (value("address")) filter.address = value("address")
    const checkIn = value("checkIn") || value("checkin")
    const checkOut = value("checkOut") || value("checkout")
    if (checkIn) filter.checkIn = checkIn
    if (checkOut) filter.checkOut = checkOut

    const keys = ["adults", "children", "infants", "pets"]
    const guests = {}
    for (const key of keys) {
        const value = params.get(key)
        if (value != null && value !== "" && Number(value) > 0) guests[key] = Number(value)
    }

    const legacyTotal = params.get("guests")
    if (!Object.keys(guests).length && legacyTotal && Number(legacyTotal) > 0) {
        guests.adults = Number(legacyTotal)
    }

    if (Object.keys(guests).length) filter.guests = guests

    return filter
}

// Format gurest label
// "Guests" -> Adults + Children
// "Infants" -> Infants
// "Pets" -> Pets
export function formatGuestsLabel(guests) {
    if (!guests) return "Add guests"
    if (typeof guests === "number") return guests ? `${guests} guests` : "Add guests"

    const adults = Number(guests.adults) || 0
    const children = Number(guests.children) || 0
    const infants = Number(guests.infants) || 0
    const pets = Number(guests.pets) || 0

    const guestsLabel = adults + children
    let label = guestsLabel ? `${guestsLabel} guest${guestsLabel === 1 ? "" : "s"}` : "Add guests"

    const extras = []
    if (infants) extras.push(`${infants} infant${infants === 1 ? "" : "s"}`)
    if (pets) extras.push(`${pets} pet${pets === 1 ? "" : "s"}`)

    if (extras.length) label += `, ${extras.join(", ")}`
    return label
}

// Dates & formatting

export function formatDateMMDDYYYY(iso) {
    if (!iso) return '—'
    const d = new Date(iso)
    if (Number.isNaN(+d)) return '—'
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const yyyy = d.getFullYear()
    return `${mm}/${dd}/${yyyy}`
}

// nights-between calculation.
export function nightsBetween(startIso, endIso) {
    if (!startIso || !endIso) return 0
    const a = new Date(startIso)
    const b = new Date(endIso)
    if (Number.isNaN(+a) || Number.isNaN(+b)) return 0
    a.setHours(12, 0, 0, 0)
    b.setHours(12, 0, 0, 0)
    const MS = 1000 * 60 * 60 * 24
    return Math.max(0, Math.round((b - a) / MS))
}

// label like "Sep 8"
export function formatDateShort(iso) {
    if (!iso) return ''
    const d = new Date(iso)
    if (Number.isNaN(+d)) return ''
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ISO helpers (used in DateRangePanel)
export function toIsoDate(date) {
    if (!date || Number.isNaN(+date)) return ''
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
}
export function fromIsoDate(iso) {
    if (!iso) return undefined
    const d = new Date(iso)
    return Number.isNaN(+d) ? undefined : d
}

// Format Money
export function formatMoney(value, currency = 'USD', min = 0, max = 0) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: min,
        maximumFractionDigits: max
    }).format(Number(value) || 0)
}

// URL helpers
export function buildStayPathWithParams(stayId, searchParams) {
    const q = searchParams?.toString?.() || ''
    return q ? `/stay/${stayId}?${q}` : `/stay/${stayId}`
}

// Format a date range like "8–9 Sept" or "28 Sept – 2 Oct"
export function formatDateRangeShort(startIso, endIso) {
    if (!startIso || !endIso) return ''

    const startDate = new Date(startIso)
    const endDate = new Date(endIso)
    if (Number.isNaN(+startDate) || Number.isNaN(+endDate)) return ''

    const startDay = startDate.getDate()
    const endDay = endDate.getDate()

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"]
    const startMonth = months[startDate.getMonth()]
    const endMonth = months[endDate.getMonth()]

    // Same month & year
    if (startDate.getFullYear() === endDate.getFullYear() &&
        startDate.getMonth() === endDate.getMonth()) {
        return `${startDay}–${endDay} ${startMonth}`
    }

    // Same year, different months
    if (startDate.getFullYear() === endDate.getFullYear()) {
        return `${startDay} ${startMonth} – ${endDay} ${endMonth}`
    }

    // Different years
    return `${startDay} ${startMonth} ${startDate.getFullYear()} – ${endDay} ${endMonth} ${endDate.getFullYear()}`
}