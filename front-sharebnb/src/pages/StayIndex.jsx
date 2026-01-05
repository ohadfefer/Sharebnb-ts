import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { loadStays } from '../store/actions/stay.actions'
import Skeleton from 'react-loading-skeleton'

import { StayList } from '../cmps/StayList'
import { Pagination } from '../cmps/Pagination'

const PER_PAGE = 20

export function StayIndex({ autoLoad = true }) {
    const { stays = [], filterBy, isLoading } = useSelector(s => s.stayModule)
    const [searchParams, setSearchParams] = useSearchParams()

    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const total = stays.length
    const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))
    const start = (page - 1) * PER_PAGE
    const pageStays = stays.slice(start, start + PER_PAGE)
    const shownEnd = Math.min(total, start + pageStays.length)

    const setPage = (next) => {
        const params = new URLSearchParams(searchParams)
        if (next === 1) params.delete('page')
        else params.set('page', String(next))
        setSearchParams(params)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    useEffect(() => {
        if (!autoLoad) return
        loadStays(filterBy)
    }, [autoLoad, filterBy])

    const initialLoading = isLoading && total === 0
    const listForRender = initialLoading
        ? Array.from({ length: PER_PAGE }).map(() => null)
        : pageStays

    return (
        <section className="stay-index">
            <div className="stay-idx-title"><span>Explore over {total} homes</span></div>
            <div className="stay-idx-subtitle">
                <span>Showing {total ? `${start + 1} - ${shownEnd}` : '0'}</span>
            </div>

            <StayList stays={listForRender} />

            {!initialLoading && (
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
