import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { showSuccessMsg } from '../services/event-bus.service.js'
import { orderService } from '../services/order/index.js'
import { addOrder, getCmdAddOrder, getCmdUpdateOrder, updateOrder as updateOrderAction } from '../store/actions/order.actions.js'
import { formatDateMMDDYYYY, nightsBetween, parseSearchParams, buildStayPathWithParams, formatGuestsLabel } from '../services/util.service.js'


import viza from '../assets/logo/vize-card.png'
import arrow from '../assets/logo/arrow.png'

export function StayOrder() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { stayId } = useParams()
    const [searchParams] = useSearchParams()

    const [order, setOrder] = useState(null)
    const [isSaved, setIsSaved] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [stay, setStay] = useState(null)

    const backHref = buildStayPathWithParams(stayId, searchParams)
    const { user } = useSelector(s => s.userModule)

    const { checkIn, checkOut, guests } = parseSearchParams(searchParams)
    const nights = nightsBetween(checkIn, checkOut)

    useEffect(() => {
        if (stayId) loadStay()
    }, [stayId])

    // useEffect(() => {
    //     if (stay && !order) createOrderFromService()
    // }, [stay, order])

    async function loadStay() {
        try {
            setIsLoading(true)
            setError(null)
            const stayData = await orderService.getStayById(stayId)
            // console.log('loadStay - stayData loaded:', stayData)
            // console.log('loadStay - stayData.host:', stayData?.host)
            // console.log('loadStay - stayData.hostId:', stayData?.hostId)

            if (!stayData) {
                setError('Stay not found')
                return
            }
            setStay(stayData)

            // if (order) {
            //     const updatedOrder = {
            //         ...order,
            //         hostId: stayData.host?._id || order.hostId,
            //         totalPrice: order.totalPrice || stayData.price,
            //         stay: {
            //             ...(order.stay || {}),
            //             _id: stayData._id,
            //             name: stayData.name,
            //             price: stayData.price,
            //         },
            //     }
                // const saved = await orderService.save(updatedOrder)
            //     setOrder(updatedOrder)
            //     // dispatch(getCmdUpdateOrder(saved))
            // }
        } catch (err) {
            console.error('Error loading stay:', err)
            setError('Failed to load stay details')
        } finally {
            setIsLoading(false)
        }
    }

    // async function createOrderFromService() {
    //     try {
    //         // console.log('createOrderFromService - stay data:', stay)
    //         // console.log('createOrderFromService - stay.host:', stay?.host)
    //         // console.log('createOrderFromService - stay.hostId:', stay?.hostId)

    //         const overrides = {
    //             startDate: checkIn,
    //             endDate: checkOut,
    //             guests: guests || { adults: 1, children: 0, infants: 0, pets: 0 },
    //             totalPrice: (stay?.price || 0) * Math.max(1, nights || 1),
    //         }
    //         const created = await orderService.createOrder(stayId, stay, overrides)
    //         setOrder(created)
    //         // dispatch(getCmdAddOrder(created))
    //     } catch (err) {
    //         console.error('Error creating order:', err)
    //         setError('Failed to create order')
    //     }
    // }



    async function handleConfirmAndPay() {
        try {
            // Ensure guests object exists and has valid values
            const defaultGuests = { adults: 1, children: 0, infants: 0, pets: 0 }
            const validGuests = guests && typeof guests === 'object' ? guests : defaultGuests

            // Check if guests object has at least one valid guest count
            // const hasValidGuests = Object.values(validGuests).some(count => count > 0)

            // if (!hasValidGuests) {
            //     setError('Please select at least one guest')
            //     return
            // }

            // const base = order 
            // || await orderService.createOrder(stayId, stay, {
            //     startDate: checkIn,
            //     endDate: checkOut,
            //     guests: validGuests,
            //     totalPrice: (stay?.price || 0) * Math.max(1, nights || 1),
            // })

            // if (!order) {
            //     setOrder(base)
            //     dispatch(getCmdAddOrder(base))
            // }

            const computedTotal = (stay?.price && nights ? stay.price * nights : 0)

            // const updated = await updateOrderAction({
            //     ...base,
            //     startDate: checkIn || base.startDate,
            //     endDate: checkOut || base.endDate,
            //     guests: validGuests,
            //     totalPrice: computedTotal,
            //     status: 'confirmed',
            // })

            if (!stay || !user) return

            console.log('Creating order with stay data:', stay)
            console.log('Stay host:', stay.host)
            console.log('Stay host._id:', stay.host?._id)
            
            const orderToSave = {
                stayId: stay._id,
                userId: user._id,
                hostId: stay.host?._id,
                startDate: checkIn || base.startDate,
                endDate: checkOut || base.endDate,
                guests: validGuests,
                totalPrice: computedTotal,
                status: 'pending'
            }
            
            console.log('Order to save:', orderToSave)

            const savedOrder = await addOrder(orderToSave)
            setOrder(savedOrder)
            setIsSaved(true)
            showSuccessMsg('Order confirmed successfully!')
            console.log(savedOrder)

            // Navigate to order confirmation page
            navigate(`/order/${savedOrder.insertedId}/confirmation`)
        } catch (err) {
            console.error('Cannot confirm and pay:', err)
            setError('Failed to confirm order. Please try again.')
        }
    }

    function handleMouseMove(e) {
        const el = e.currentTarget
        const r = el.getBoundingClientRect()
        const x = ((e.clientX - r.left) / r.width) * 100
        const y = ((e.clientY - r.top) / r.height) * 100
        el.style.setProperty('--mouse-x', `${x}%`)
        el.style.setProperty('--mouse-y', `${y}%`)
    }

    return (
        <div className="main-order">
            <Link to={backHref}>
                <button className="arrow-btn"><img src={arrow} alt="" /></button>
            </Link>

            <header><h1>Request to book</h1></header>

            <div className="order-body">
                <div className="order-payment">
                    <div className="payment-method">
                        <div className="payment-details">
                            <h2>1. Choose when to pay</h2>
                        </div>

                        <label className="payment-option">
                            <h1>Pay $ 120 now</h1>
                            <input type="radio" name="payment" value="pay-now" className="payment-radio" />
                        </label>

                        <label className="payment-option">
                            <div>
                                <h1>Pay in 3 payments with Klarna</h1>
                                <br />
                                <p>Split your purchase into 3 payments of $ 40.00 (0% APR). More info</p>
                            </div>
                            <input type="radio" name="payment" value="klarna" className="payment-radio" />
                        </label>
                    </div>

                    <div className="payment-card">
                        <p>Payment method</p>
                        <div className="payment-row">
                            <img src={viza} alt="Visa" />
                            <span>3867</span>
                        </div>
                    </div>

                    <hr />

                    <div className="confirm">
                        {error && <p className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
                        <button
                            onClick={handleConfirmAndPay}
                            onMouseMove={handleMouseMove}
                            className="action-btn"
                            disabled={isLoading || isSaved}
                        >
                            <p>{isSaved ? 'Order Confirmed!' : 'Confirm and pay'}</p>
                        </button>
                    </div>
                </div>

                <div className="order-details">
                    <div className="preview-order">
                        {isLoading ? (
                            <p>Loading stay details...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : stay ? (
                            <div>
                                <div className="order-title">
                                    {stay.imgUrls?.[0] ? (
                                        <img src={stay.imgUrls[0]} alt={stay.name} />
                                    ) : (
                                        <div className="no-image-placeholder"><p>No image available</p></div>
                                    )}
                                    <div className="title-txt">
                                        <h3>{stay.name}</h3>
                                        <p>{stay.type}</p>
                                        <span><i className="fa-solid fa-star"></i>4.95 (199)</span>
                                    </div>
                                </div>

                                <div className="free-cancelation">
                                    <p className="item1">Free cancelation</p>
                                    <p>Cancel before 11 Sept for a full refund.</p>
                                </div>

                                <hr />

                                <div className="date-guests">
                                    <p className="date">Dates & guests</p>
                                    <div className="guests">
                                        <span>
                                            {checkIn && checkOut
                                                ? `${formatDateMMDDYYYY(checkIn)} - ${formatDateMMDDYYYY(checkOut)}`
                                                : 'Add dates'}
                                        </span>
                                        <span>{formatGuestsLabel(guests || { adults: 1, children: 0, infants: 0, pets: 0 })}</span>
                                    </div>
                                </div>

                                <hr />

                                <div className="price">
                                    <p>Price details</p>
                                    <span>
                                        {nights} night{nights === 1 ? '' : 's'} x ${stay.price}
                                    </span>
                                </div>

                                <hr />
                                <div className="total-details">
                                    <div className="total">
                                        <p>Total</p>
                                        <p>${(stay.price || 0) * Math.max(1, nights || 1)}</p>
                                    </div>
                                    <p className="item">Price breakdown</p>
                                </div>
                            </div>
                        ) : (
                            <p>Stay not found</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
