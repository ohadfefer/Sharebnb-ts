import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts'
import { buildNext30Occupancy, leadTimeBuckets, revenueByListing } from '../services/analytics.service'

// Simple color set for the donut
const donutColors = ['#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8']

export function InsightsRow({ orders = [] }) {
    const occ = buildNext30Occupancy(orders)        // [{ occ: boolean, label: 'Sep 4' }, ...] length 30
    const lead = leadTimeBuckets(orders)
    const top5 = revenueByListing(orders)

    const hasAny = (arr) => Array.isArray(arr) && arr.length && arr.some(x => (x.v ?? x.total ?? x.occ) > 0)

    return (
        <section className="insights-grid">
            {/* Next 30 nights — calendar */}
            <article className="insight-card">
                <header className="insight-head">
                    <h3>Next 30 nights</h3>
                    <p>Green = booked</p>
                </header>
                {occ?.length ? <Next30Calendar occ={occ} /> : <EmptyState />}
            </article>

            {/* Booking window donut */}
            <article className="insight-card">
                <header className="insight-head">
                    <h3>Booking window</h3>
                    <p>How far ahead guests book</p>
                </header>

                {hasAny(lead) ? (
                    <div className="chart-wrap">
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie data={lead} dataKey="v" innerRadius={55} outerRadius={80} paddingAngle={2}>
                                    {lead.map((_, i) => <Cell key={i} fill={donutColors[i % donutColors.length]} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <EmptyState />
                )}
            </article>

            {/* Revenue by listing — VERTICAL columns */}
            <article className="insight-card">
                <header className="insight-head">
                    <h3>Top revenue by listing</h3>
                    <p>This month to date</p>
                </header>

                {hasAny(top5) ? (
                    <div className="chart-wrap">
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={top5} margin={{ left: 8, right: 8, bottom: 22 }}>
                                {/* vertical columns: category on X, numbers on Y */}
                                <XAxis
                                    dataKey="name"
                                    interval={0}
                                    height={40}
                                    tick={{ fontSize: 12 }}
                                    angle={-25}
                                    textAnchor="end"
                                />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Revenue']} />
                                <Bar dataKey="total" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <EmptyState />
                )}
            </article>
        </section>
    )
}

/* ---------- Mini calendar for next 30 nights ---------- */
function Next30Calendar({ occ = [] }) {
    // Build 30 sequential dates starting today
    const start = new Date(); start.setHours(0, 0, 0, 0)
    const days = [...Array(30)].map((_, i) => {
        const d = new Date(start); d.setDate(start.getDate() + i)
        return {
            date: d,
            // fallback: if buildNext30Occupancy returns {occ,label} in order, align by index
            booked: !!occ[i]?.occ,
            label: occ[i]?.label || d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }
    })

    // Calendar grid: weekday headers + 5 rows of 7 cells (with leading blanks)
    const firstDow = start.getDay() // 0=Sun … 6=Sat
    const leading = [...Array(firstDow)].map(() => ({ empty: true }))
    const cells = [...leading, ...days]
    while (cells.length % 7 !== 0) cells.push({ empty: true }) // pad to full weeks

    const weekNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    const todayKey = start.toDateString()

    return (
        <div className="occ-cal">
            <div className="occ-cal__weekdays">
                {weekNames.map(w => <span key={w} className="occ-cal__weekday">{w}</span>)}
            </div>

            <div className="occ-cal__grid" aria-label="Next 30 nights calendar">
                {cells.map((c, idx) => {
                    if (c.empty) return <div key={idx} className="occ-cal__cell is-empty" />
                    const isToday = c.date.toDateString() === todayKey
                    return (
                        <div
                            key={idx}
                            className={
                                'occ-cal__cell' +
                                (c.booked ? ' is-booked' : '') +
                                (isToday ? ' is-today' : '')
                            }
                            title={`${c.label} — ${c.booked ? 'Booked' : 'Free'}`}
                        >
                            <span className="occ-cal__num">{c.date.getDate()}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function EmptyState() { return <div className="insight-empty">No data yet.</div> }
