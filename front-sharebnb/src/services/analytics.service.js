// --- 30-day occupancy (booked=1, free=0) ---
export function buildNext30Occupancy(orders = []) {
    const days = []
    const start = new Date()
    start.setHours(12, 0, 0, 0)

    for (let i = 0; i < 30; i++) {
        const d = new Date(start)
        d.setDate(start.getDate() + i)
        const ts = d.getTime()

        const occupied = orders.some(o => {
            const a = new Date(o.startDate).setHours(12, 0, 0, 0)
            const b = new Date(o.endDate).setHours(12, 0, 0, 0)
            const isBooked = o.status === 'approved' || o.status === 'completed'
            return isBooked && ts >= a && ts < b
        })

        days.push({
            label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            occ: occupied ? 1 : 0
        })
    }
    return days
}

// --- Lead-time (booking window) buckets for donut ---
export function leadTimeBuckets(orders = []) {
    const buckets = [
        { name: '0–3d', v: 0 },
        { name: '4–7d', v: 0 },
        { name: '8–14d', v: 0 },
        { name: '15–30d', v: 0 },
        { name: '30d+', v: 0 }
    ]

    for (const o of orders) {
        const start = new Date(o.startDate)
        const created = new Date(o.createdAt || o.bookedAt || o.startDate)
        const days = Math.max(0, Math.round((start - created) / (1000 * 60 * 60 * 24)))
        const idx = days <= 3 ? 0 : days <= 7 ? 1 : days <= 14 ? 2 : days <= 30 ? 3 : 4
        buckets[idx].v++
    }
    return buckets
}

// --- Top-5 revenue by listing (bar) ---
export function revenueByListing(orders = []) {
    const map = new Map()

    for (const o of orders) {
        const isRevenue = o.status === 'approved' || o.status === 'completed'
        if (!isRevenue) continue
        const name = o.stay?.name || '—'
        map.set(name, (map.get(name) || 0) + (Number(o.totalPrice) || 0))
    }

    return [...map.entries()]
        .map(([name, total]) => ({ name, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5)
}
