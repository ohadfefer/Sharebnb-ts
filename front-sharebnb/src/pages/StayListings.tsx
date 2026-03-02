import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { loadStays, setFilter, getCmdSetStays } from '../store/actions/stay.actions.js'
import { useAppSelector } from '../store/hooks.js'
import { StayFilterBy } from '../types/stay.js'
import { store } from '../store/store.js'
import Skeleton from 'react-loading-skeleton'

export function StayListings() {
    const { stays = [], isLoading } = useAppSelector(s => s.stayModule)
    const loggedInUser = useAppSelector(s => s.userModule.user)
    const [sortConfig, setSortConfig] = useState({ field: '', direction: '' })
    const navigate = useNavigate()

    useEffect(() => {
        if (!loggedInUser?._id) return

        // Clear stale stays immediately so we don't flash previous results
        store.dispatch(getCmdSetStays([]) as any)

        const filter = { hostId: loggedInUser._id } as StayFilterBy
        setFilter(filter)
        loadStays(filter)

        return () => {
            // Reset filter fully to default so StayIndex doesn't inherit hostId
            setFilter({ hostId: undefined } as Partial<StayFilterBy>)
        }
    }, [loggedInUser?._id])

    const sortedStays = useMemo(() => {
        if (!sortConfig.field || !sortConfig.direction) return stays
        const arr = [...stays]
        const { field, direction } = sortConfig
        const getVal = (s: any) => s?.[field] ?? 0
        arr.sort((a, b) => {
            const av = getVal(a), bv = getVal(b)
            if (typeof av === 'number' && typeof bv === 'number') {
                return direction === 'asc' ? av - bv : bv - av
            }
            const as = String(av).toLowerCase(), bs = String(bv).toLowerCase()
            return direction === 'asc' ? as.localeCompare(bs) : bs.localeCompare(as)
        })
        return arr
    }, [stays, sortConfig])

    const handleListingClick = (stayId: string) => navigate(`/stay/${stayId}`)
    const handleUpdateClick = (stayId: string) => navigate(`/hosting/listings/edit/${stayId}`)
    const handleSort = (field: string) => {
        if (sortConfig.field !== field) return setSortConfig({ field, direction: 'asc' })
        if (sortConfig.direction === 'asc') return setSortConfig({ field, direction: 'desc' })
        setSortConfig({ field: '', direction: '' })
    }
    const getSortIcon = (field: string) => {
        if (sortConfig.field !== field) return <span className="sort-icon">&#8597;</span>
        if (sortConfig.direction === 'asc') return <span className="sort-icon">&#x25BE;</span>
        if (sortConfig.direction === 'desc') return <span className="sort-icon">&#x25B4;</span>
        return <span className="sort-icon">&#8597;</span>
    }
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A'
        const d = new Date(dateString); const m = String(d.getMonth() + 1).padStart(2, '0'); const day = String(d.getDate()).padStart(2, '0'); const y = String(d.getFullYear()).slice(-2)
        return `${m}/${day}/${y}`
    }

    const showSkeleton = isLoading && stays.length === 0
    const SKELETON_ROWS = 5

    return (
        <div className="stay-listings-page">
            <header className="listings-header">
                <nav className="listings-nav">
                    <NavLink to="/hosting/listings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Create listing</NavLink>
                    <NavLink to="/dashboard/listings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Listings</NavLink>
                    <NavLink to="/dashboard/reservations" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Reservations</NavLink>
                </nav>
            </header>

            <div className="listings-count">
                <span>{showSkeleton ? <Skeleton width={60} /> : `${sortedStays.length} items`}</span>
            </div>

            <div className="stays-grid-container">
                <table className="stays-table">
                    <thead>
                        <tr>
                            <th>LISTING</th>
                            <th>TODO</th>
                            <th className="sortable-header" onClick={() => handleSort('capacity')} style={{ cursor: 'pointer' }}>CAPACITY {getSortIcon('capacity')}</th>
                            <th className="sortable-header" onClick={() => handleSort('bedrooms')} style={{ cursor: 'pointer' }}>BEDROOMS {getSortIcon('bedrooms')}</th>
                            <th className="sortable-header" onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>PRICE {getSortIcon('price')}</th>
                            <th>LOCATION</th>
                            <th>DATE ADDED</th>
                        </tr>
                    </thead>
                    <tbody>
                        {showSkeleton
                            ? Array(SKELETON_ROWS).fill(0).map((_, i) => (
                                <tr key={`skel-${i}`} className="stay-row">
                                    <td className="listing-cell">
                                        <div className="listing-info">
                                            <Skeleton width={48} height={48} borderRadius={6} />
                                            <Skeleton width={120} height={14} />
                                        </div>
                                    </td>
                                    <td className="todo-cell"><Skeleton width={60} height={30} borderRadius={6} /></td>
                                    <td className="capacity-cell"><Skeleton width={30} /></td>
                                    <td className="bedrooms-cell"><Skeleton width={30} /></td>
                                    <td className="price-cell"><Skeleton width={50} /></td>
                                    <td className="location-cell"><Skeleton width={100} /></td>
                                    <td className="date-cell"><Skeleton width={70} /></td>
                                </tr>
                            ))
                            : sortedStays.map(stay => (
                                <tr key={stay._id} className="stay-row">
                                    <td className="listing-cell">
                                        <div className="listing-info" onClick={() => handleListingClick(stay._id)}>
                                            <img src={stay.imgUrls?.[0] || '/img/default-stay.jpg'} alt={stay.name} className="stay-image" />
                                            <span className="stay-name">{stay.name}</span>
                                        </div>
                                    </td>
                                    <td className="todo-cell">
                                        <button
                                            className="update-btn"
                                            onClick={() => handleUpdateClick(stay._id)}
                                        >
                                            Update
                                        </button>
                                    </td>
                                    <td className="capacity-cell">{stay.capacity ?? 'N/A'}</td>
                                    <td className="bedrooms-cell">{stay.bedrooms ?? 'N/A'}</td>
                                    <td className="price-cell">${stay.price ?? 'N/A'}</td>
                                    <td className="location-cell">
                                        {stay.loc?.city}{stay.loc?.city && stay.loc?.country ? ', ' : ''}{stay.loc?.country}
                                    </td>
                                    <td className="date-cell">{formatDate(stay.createdAt as any || '')}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
