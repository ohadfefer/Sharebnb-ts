import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { loadStays, setFilter } from '../store/actions/stay.actions' // EDIT

export function StayListings() {
    const { stays = [] } = useSelector(s => s.stayModule)
    const loggedInUser = useSelector(s => s.userModule.user)
    const [sortConfig, setSortConfig] = useState({ field: null, direction: null })
    const navigate = useNavigate()

    useEffect(() => {
        if (!loggedInUser?._id) return
        setFilter({ hostId: loggedInUser._id })  // EDIT
        loadStays()                              // EDIT
        return () => {
            // NEW: clear host filter when leaving dashboard
            setFilter({ hostId: '' })
        }
    }, [loggedInUser?._id])

    const sortedStays = useMemo(() => {
        if (!sortConfig.field || !sortConfig.direction) return stays
        const arr = [...stays]
        const { field, direction } = sortConfig
        const getVal = (s) => s?.[field] ?? 0
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

    const handleListingClick = (stayId) => navigate(`/stay/${stayId}`)
    const handleUpdateClick = (stayId) => navigate(`/hosting/listings/edit/${stayId}`)
    const handleSort = (field) => {
        if (sortConfig.field !== field) return setSortConfig({ field, direction: 'asc' })
        if (sortConfig.direction === 'asc') return setSortConfig({ field, direction: 'desc' })
        setSortConfig({ field: null, direction: null })
    }
    const getSortIcon = (field) => {
        if (sortConfig.field !== field) return <span className="sort-icon">&#8597;</span>
        if (sortConfig.direction === 'asc') return <span className="sort-icon">&#x25BE;</span>
        if (sortConfig.direction === 'desc') return <span className="sort-icon">&#x25B4;</span>
        return <span className="sort-icon">&#8597;</span>
    }
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        const d = new Date(dateString); const m = String(d.getMonth() + 1).padStart(2, '0'); const day = String(d.getDate()).padStart(2, '0'); const y = String(d.getFullYear()).slice(-2)
        return `${m}/${day}/${y}`
    }

    return (
        <div className="stay-listings-page">
            <header className="listings-header">
                <nav className="listings-nav">
                    <NavLink to="/hosting/listings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Create listing</NavLink>
                    <NavLink to="/dashboard/listings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Listings</NavLink>
                    <NavLink to="/dashboard/reservations" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Reservations</NavLink>
                </nav>
            </header>

            <div className="listings-count"><span>{sortedStays.length} items</span></div>

            <div className="stays-grid-container">
                <table className="stays-table">
                    <thead>
                        <tr>
                            <th>LISTING</th>
                            <th>TODO</th>
                            <th className="sortable-header" onClick={() => handleSort('capacity')} style={{ cursor: 'pointer' }}>CAPACITY {getSortIcon('capacity')}</th>
                            {/* <th className="sortable-header" onClick={() => handleSort('rooms')} style={{ cursor: 'pointer' }}>ROOMS {getSortIcon('rooms')}</th> */}
                            <th className="sortable-header" onClick={() => handleSort('bedrooms')} style={{ cursor: 'pointer' }}>BEDROOMS {getSortIcon('bedrooms')}</th>
                            <th className="sortable-header" onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>PRICE {getSortIcon('price')}</th>
                            <th>LOCATION</th>
                            <th>DATE ADDED</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedStays.map(stay => (
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
                                {/* <td className="rooms-cell">{stay.rooms ?? 'N/A'}</td> */}
                                <td className="bedrooms-cell">{stay.bedrooms ?? 'N/A'}</td>
                                <td className="price-cell">${stay.price ?? 'N/A'}</td>
                                <td className="location-cell">
                                    {stay.loc?.city}{stay.loc?.city && stay.loc?.country ? ', ' : ''}{stay.loc?.country}
                                </td>
                                <td className="date-cell">{formatDate(stay.createdAt || stay.at)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
