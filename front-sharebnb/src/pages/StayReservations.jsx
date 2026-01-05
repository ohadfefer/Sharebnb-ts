import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { loadOrders, setFilter as setOrderFilter } from '../store/actions/order.actions' // EDIT
import { formatDateMMDDYYYY as fmtDate, formatMoney } from '../services/util.service.js'
import { KpiCards } from '../cmps/KpiCards.jsx'
import { ReservationsToolbar } from '../cmps/ReservationsToolbar.jsx'
import { ReservationsTable } from '../cmps/ReservationsTable.jsx'
import { InsightsRow } from '../cmps/InsightsRow.jsx'
import { setFilter } from '../store/actions/order.actions.js'


export function StayReservations() {
    const { orders, isLoading } = useSelector(s => s.orderModule)
    const { user } = useSelector(s => s.userModule)
    const { filterBy } = useSelector(s => s.orderModule)


    const [q, setQ] = useState('')
    const [status, setStatus] = useState('all') // all | pending | approved | rejected | completed

    useEffect(() => {
        setFilter({ hostId: user._id })
        onLoadOrders()
    }, [])

    async function onLoadOrders() {
        console.log(filterBy)
        const orders = await loadOrders()
        console.log(orders)
    }

    // filter client-side for now
    const rows = useMemo(() => {
        const needle = q.trim().toLowerCase()
        return (orders || []).filter(o => {
            if (status !== 'all' && o.status !== status) return false
            if (!needle) return true
            const hay = [
                o.guest?.fullname,
                o.stay?.name,
                o.status,
                fmtDate(o.startDate),
                fmtDate(o.endDate),
                String(o.totalPrice),
            ].join(' ').toLowerCase()
            return hay.includes(needle)
        })
    }, [orders, q, status])

    const now = new Date()
    const month = now.getMonth(), year = now.getFullYear()
    const revenueThisMonth = rows
        .filter(o => {
            const d = new Date(o.startDate || o.endDate || 0)
            return d.getMonth() === month && d.getFullYear() === year &&
                (o.status === 'approved' || o.status === 'completed')
        })
        .reduce((acc, o) => acc + (Number(o.totalPrice) || 0), 0)

    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date(now); d.setDate(now.getDate() - (6 - i))
        d.setHours(12, 0, 0, 0)
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
        const count = rows.filter(o => {
            const sd = new Date(o.startDate || 0); sd.setHours(12, 0, 0, 0)
            return `${sd.getFullYear()}-${sd.getMonth()}-${sd.getDate()}` === key
        }).length
        return { d: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), count }
    })

    const totalApproved = rows.filter(o => o.status === 'approved' || o.status === 'completed').length
    const totalPending = rows.filter(o => o.status === 'pending').length

    function handleExportCsv() {
        const header = ['Guest', 'Check-in', 'Checkout', 'Listing', 'Total Payout', 'Status']
        const csvSafe = (s) => /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s
        const lines = rows.map(o => ([
            csvSafe(o.guest?.fullname || ''),
            csvSafe(fmtDate(o.startDate)),
            csvSafe(fmtDate(o.endDate)),
            csvSafe(o.stay?.name || ''),
            csvSafe(String(o.totalPrice ?? 0)),
            csvSafe(o.status || ''),
        ].join(',')))
        const blob = new Blob([header.join(',') + '\n' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'reservations.csv'
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <section className="reservations-page">
            <header className="listings-header">
                <nav className="listings-nav">
                    <NavLink to="/dashboard/stay/edit" className="nav-link">Create listing</NavLink>
                    <NavLink to="/dashboard/listings" className="nav-link">Listings</NavLink>
                    <NavLink to="/dashboard/reservations" className="nav-link active">Reservations</NavLink>
                </nav>
            </header>

            <KpiCards
                revenueLabel={formatMoney(revenueThisMonth, 'USD')}
                approved={totalApproved}
                pending={totalPending}
                total={rows.length}
                spark={last7Days}
            />

            <InsightsRow orders={orders} />
            <ReservationsToolbar q={q} onQuery={setQ} status={status} onStatus={setStatus} onExport={handleExportCsv} />
            <div className="res-card data-table">
                <ReservationsTable rows={rows} isLoading={isLoading} />
            </div>
        </section>
    )
}




