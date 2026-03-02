import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { loadStays, setFilter } from '../store/actions/stay.actions.js'
import { stayService } from '../services/stay/index.js'

import { StayList } from '../cmps/StayList.jsx'
import { Pagination } from '../cmps/Pagination.jsx'

import { useAppSelector } from '../store/hooks.js'
import { Stay } from '../types/stay.js'

interface StayIndexProps {
    autoLoad?: boolean
}

const PER_PAGE = 20

export function StayIndex({ autoLoad = true }: StayIndexProps) {

    const { stays = [], filterBy, isLoading } = useAppSelector(s => s.stayModule)
    const [searchParams, setSearchParams] = useSearchParams()
    const didResetRef = useRef(false)

    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const total = stays.length
    const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))
    const start = (page - 1) * PER_PAGE
    const pageStays = stays.slice(start, start + PER_PAGE)
    const shownEnd = Math.min(total, start + pageStays.length)

    const setPage = (next: number) => {
        const params = new URLSearchParams(searchParams)
        if (next === 1) params.delete('page')
        else params.set('page', String(next))
        setSearchParams(params)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // On mount: reset to clean filter and load. After mount: reload on filterBy changes.
    const isMountRef = useRef(true)

    useEffect(() => {
        if (!autoLoad) return
        if (isMountRef.current) {
            isMountRef.current = false
            const clean = { ...stayService.getDefaultFilter(), hostId: '' }
            setFilter(clean)
            loadStays(clean)
            return
        }
        loadStays(filterBy)
    }, [autoLoad, filterBy])

    const listForRender = isLoading
        ? Array(PER_PAGE).fill({} as Stay)
        : pageStays

    return (
        <section className="stay-index">
            <div className="stay-idx-title"><span>Explore over {total} homes</span></div>
            <div className="stay-idx-subtitle">
                <span>Showing {total ? `${start + 1} - ${shownEnd}` : '0'}</span>
            </div>

            <StayList stays={listForRender} />

            {!isLoading && (
                <Pagination
                    page={Math.min(page, totalPages)}
                    perPage={PER_PAGE}
                    total={total}
                    onChange={setPage}
                />
            )}
        </section>
    )
}
