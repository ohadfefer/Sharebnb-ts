import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { setFilter, loadStays } from '../store/actions/stay.actions.js'
import { StayIndex } from './StayIndex.js'
import { ExploreMap } from '../cmps/ExploreMap.jsx'
import { parseSearchParams } from '../services/util.service.js'
import Skeleton from 'react-loading-skeleton'
import { useAppSelector } from '../store/hooks.js'

// types

import { StayFilterBy } from '../types/stay.js'

export function StayExplore() {
    const [searchParams] = useSearchParams()
    const filterFromUrl = useMemo(() => parseSearchParams(searchParams), [searchParams])
    const { stays = [], isLoading } = useAppSelector(state => state.stayModule)

    useEffect(() => {
        setFilter(filterFromUrl)
        loadStays({} as StayFilterBy)
    }, [filterFromUrl])

    const initialLoading = isLoading && stays.length === 0

    return (
        <section className="explore">
            <div className="results-col">
                <StayIndex autoLoad={false} />
            </div>

            <aside className="map-col">
                {initialLoading
                    ? <Skeleton className="map-skeleton" />
                    : <ExploreMap stays={stays} />
                }
            </aside>
        </section>
    )
}
