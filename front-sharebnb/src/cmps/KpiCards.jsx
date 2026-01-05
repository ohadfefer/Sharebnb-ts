import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis, YAxis } from 'recharts'

export function KpiCards({ revenueLabel, approved, pending, total, spark }) {
    return (
        <div className="dash-cards">
            <Card title="Revenue (this month)" value={revenueLabel}>
                <TinyArea data={spark} />
            </Card>
            <Card title="Approved bookings" value={approved} sub={`${spark?.[6]?.count || 0} today`} />
            <Card title="Pending requests" value={pending} />
            <Card title="Total reservations" value={total} />
        </div>
    )
}

function Card({ title, value, sub, children }) {
    return (
        <div className="dash-card">
            <div className="dash-card__texts">
                <div className="dash-card__title">{title}</div>
                <div className="dash-card__value">{value}</div>
                {sub && <div className="dash-card__sub">{sub}</div>}
            </div>
            {children && <div className="dash-card__chart">{children}</div>}
        </div>
    )
}

function TinyArea({ data }) {
    return (
        <ResponsiveContainer width="100%" height={48}>
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis dataKey="d" hide />
                <YAxis hide />
                <Tooltip cursor={false} />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="url(#grad)" strokeWidth={2} />
            </AreaChart>
        </ResponsiveContainer>
    )
}
