import { Order, OccupancyDay, LeadTimeBucket, RevenueEntry } from '../types/order.js'

// --- 30-day occupancy (booked=1, free=0) ---

export function buildNext30Occupancy(orders: Order[] = []): OccupancyDay[] {
    const days: OccupancyDay[] = [];
    const start = new Date();
    start.setHours(12, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const ts = d.getTime();

        const occupied = orders.some((o) => {
            const a = new Date(o.startDate).setHours(12, 0, 0, 0);
            const b = new Date(o.endDate).setHours(12, 0, 0, 0);
            const isBooked = o.status === 'approved' || o.status === 'completed';
            return isBooked && ts >= a && ts < b;
        });

        days.push({
            label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            occ: occupied ? 1 : 0,
        });
    }

    return days;
}

/**
 * Groups orders into lead-time (booking window) buckets for donut/pie chart
 */
export function leadTimeBuckets(orders: Order[] = []): LeadTimeBucket[] {
    const buckets: LeadTimeBucket[] = [
        { name: '0-3d', v: 0 },
        { name: '4-7d', v: 0 },
        { name: '8-14d', v: 0 },
        { name: '15-30d', v: 0 },
        { name: '30d+', v: 0 },
    ];

    for (const o of orders) {
        const start = new Date(o.startDate);
        const created = new Date(o.createdAt || o.startDate);

        const diffMs = start.getTime() - created.getTime();
        const days = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));

        const idx =
            days <= 3 ? 0 :
                days <= 7 ? 1 :
                    days <= 14 ? 2 :
                        days <= 30 ? 3 : 4;

        buckets[idx].v++;
    }

    return buckets;
}

/**
 * Returns top 5 listings by total revenue (only approved/completed orders)
 */
export function revenueByListing(orders: Order[] = []): RevenueEntry[] {
    const map = new Map < string, number> ();

    for (const o of orders) {
        const isRevenue = o.status === 'approved' || o.status === 'completed';
        if (!isRevenue) continue;

        const name = '—';       // missing o.stay property in Order type
        const amount = Number(o.totalPrice) || 0;

        map.set(name, (map.get(name) || 0) + amount);
    }

    return [...map.entries()]
        .map(([name, total]) => ({ name, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);
}
