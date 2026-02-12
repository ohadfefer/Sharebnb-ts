// TripIndex.jsx
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { loadOrders, setFilter, setupOrderSocketListeners, cleanupOrderSocketListeners } from "../store/actions/order.actions.js" // EDIT
import { useAppSelector } from "../store/hooks.js"
import { OrderFilterBy } from "../types/order.js"

function formatDate(iso: string | Date) {
  if (!iso) return "—"
  const d = new Date(iso)
  if (isNaN(d as any)) return "—"
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  const yyyy = d.getFullYear()
  return `${mm}/${dd}/${yyyy}`
}

function formatMoney(value: string | number, currency = "USD") {
  const n = Number(value ?? 0)
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n)
  } catch {
    return `$${n.toFixed(2)}`
  }
}

function capFirst(txt = "") {
  return txt ? txt.charAt(0).toUpperCase() + txt.slice(1) : ""
}

export function TripIndex() {
  const navigate = useNavigate()
  const filterBy = useAppSelector(s => s.orderModule.filterBy)
  const user = useAppSelector(s => s.userModule.user)
  const { orders, isLoading } = useAppSelector(s => s.orderModule)

  // console.log('TripIndex - user:', user)
  // console.log('TripIndex - orders:', orders)

  // Set the backend filter to the logged-in user's id (guest) and load orders.
  useEffect(() => {
    // Handle guest mode - if no user is logged in, use a default guest user ID
    const userId = user?._id || ''
    console.log('TripIndex - setting filter with userId:', userId)
    setFilter({ userId : userId}) // backend aliases userId -> guestId
    onLoadOrders(filterBy)
    console.log(orders)
  }, [user?._id])

  // Set up socket listeners for real-time order updates
  useEffect(() => {
    setupOrderSocketListeners()
    
    // Test socket connection and ensure user is logged in
    if (window.socketService) {
      window.socketService.testConnection()
      
      // Try to ensure user is logged in after a short delay
      setTimeout(() => {
        window.socketService.ensureUserLoggedIn()
      }, 1000)
    }
    
    return () => {
      cleanupOrderSocketListeners()
    }
  }, [])

  async function onLoadOrders(filterBy: OrderFilterBy) {
    await loadOrders(filterBy)
    console.log(orders)
  }

  function handleRowClick(stayId: string) {
    if (stayId) navigate(`/stay/${stayId}`)
  }

  if (!user?._id) {
    return (
      <section className="trips-page">
        <h2 className="trips-title">My Trips</h2>
        <div className="trips-card"><p>Please sign in to see your trips.</p></div>
      </section>
    )
  }

  return (
    <section className="trips-page">
      <div className="trips-container">
        <h2 className="trips-title">
          {isLoading ? "Loading…" : `My Trips (${orders?.length || 0})`}
        </h2>

        <div className="trips-card">
          <table className="trips-table">
            <thead>
              <tr>
                <th className="col-destination">Destination</th>
                <th className="col-in">Check-in</th>
                <th className="col-out">Checkout</th>
                <th className="col-booked">Booked</th>
                <th className="col-total">Total</th>
                <th className="col-status">Status</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading && Array.isArray(orders) && orders.length > 0 && orders.map((o, idx) => {
                // missing "stay" property from order object. Use aggregation for order collection or retrieve stay using
                // stayId from the order object. For now, "stayName" and "stayThumb" are hard-coded.
                const stayName = "—"
                const stayThumb = "https://via.placeholder.com/72?text=%20"
                const checkIn = formatDate(o?.startDate)
                const checkOut = formatDate(o?.endDate)
                const bookedAt = formatDate(o?.createdAt)
                const total = formatMoney(o?.totalPrice ?? 0)
                const status = capFirst(o?.status || "pending")

                return (
                  <tr key={o._id} className={idx % 2 ? "zebra" : ""} onClick={() => handleRowClick(o?.stayId)} role="button">
                    <td className="col-destination">
                      <div className="dest-cell">
                        <img src={stayThumb} alt="" className="dest-thumb" width={72} height={72} loading="lazy" />
                        <span className="dest-name">{stayName}</span>
                      </div>
                    </td>
                    <td className="col-in">{checkIn}</td>
                    <td className="col-out">{checkOut}</td>
                    <td className="col-booked">{bookedAt}</td>
                    <td className="col-total">{total}</td>
                    <td className="col-status"><span className={`status-pill ${status.toLowerCase()}`}>{status}</span></td>
                  </tr>
                )
              })}

              {!isLoading && (!orders || orders.length === 0) && (
                <tr><td colSpan={6} className="empty">No trips yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
