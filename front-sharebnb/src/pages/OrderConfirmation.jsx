import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import confetti from 'canvas-confetti'
import { orderService } from '../services/order/index.js'
import { getCmdUpdateOrder } from '../store/actions/order.actions.js'
import { formatGuestsLabel, formatDateMMDDYYYY, buildStayPathWithParams } from '../services/util.service.js'

export function OrderConfirmation() {
    const { orderId: id } = useParams()
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()

    const orders = useSelector(s => s.orderModule.orders)
    const fromStore = useMemo(() => orders.find(o => o._id === id), [orders, id])

    const [order, setOrder] = useState(fromStore || null)
    const [loading, setLoading] = useState(!fromStore)
    const [error, setError] = useState(null)

    // load fallback if not in store
    useEffect(() => {
        let alive = true
        if (fromStore) return
            ; (async () => {
                try {
                    setLoading(true)
                    const fetched = await orderService.getById(id)
                    if (!alive) return
                    if (fetched) {
                        setOrder(fetched)
                        dispatch(getCmdUpdateOrder(fetched))
                    } else {
                        setError('Order not found')
                    }
                } catch (err) {
                    setError('Failed to load order')
                    console.error(err)
                } finally {
                    if (alive) setLoading(false)
                }
            })()
        return () => { alive = false }
    }, [id, fromStore, dispatch])

    // Conffety Effect
    useEffect(() => {
        if (!order) return
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })
    }, [order])

    // isLoading + Error handeling
    if (loading) {
        return <section className="confirm-page"><div className="confirm-card">Loading…</div></section>
    }
    if (error || !order) {
        return <section className="confirm-page"><div className="confirm-card">{error || 'Order not found'}</div></section>
    }

    const backToStayHref = order.stay?._id
        ? buildStayPathWithParams(order.stay._id, searchParams)
        : '/trips'

    const statusLabel = 'Pending'

    return (
        <section className="confirm-page">
            <div className="confirm-hero">
                <div className="badge-check" aria-hidden>✓</div>
                <h1>Booking requested!</h1>
                <p>We’ve sent your request to the host. You’ll get a confirmation soon.</p>
            </div>

            <div className="confirm-card">
                <div className="confirm-row">
                    <div className="confirm-col">
                        <h3>Stay</h3>
                        <div className="stay-mini">
                            {order.stay?.name || '—'}
                            {order.stay?._id && (
                                <span className="muted"> &nbsp;·&nbsp; #{order._id}</span>
                            )}
                        </div>
                    </div>

                    <div className="confirm-col">
                        <h3>Dates</h3>
                        <div>{formatDateMMDDYYYY(order.startDate)} – {formatDateMMDDYYYY(order.endDate)}</div>
                    </div>

                    <div className="confirm-col">
                        <h3>Guests</h3>
                        <div>{formatGuestsLabel(order.guests)}</div>
                    </div>

                    <div className="confirm-col">
                        <h3>Total</h3>
                        <div className="money">${Number(order.totalPrice || 0).toFixed(2)}</div>
                    </div>

                    <div className="confirm-col">
                        <h3>Status</h3>
                        <span className="pill pending">{statusLabel}</span>
                    </div>
                </div>

                <div className="confirm-actions">
                    <Link to="/trips" className="btn primary">View all trips</Link>
                    {order.stay?._id && (
                        <Link to={backToStayHref} className="btn ghost">Go to stay</Link>
                    )}
                    <button
                        className="btn subtle"
                        type="button"
                        onClick={() => {
                            // Manual “celebrate again” button
                            confetti({
                                particleCount: 120,
                                spread: 80,
                                origin: { y: 0.6 }
                            })
                        }}
                    >
                        Celebrate again 🎉
                    </button>
                </div>
            </div>
        </section>
    )
}
