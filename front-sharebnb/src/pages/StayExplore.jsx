import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { setFilter, loadStays } from '../store/actions/stay.actions'
import { StayIndex } from './StayIndex'
import { ExploreMap } from '../cmps/ExploreMap'
import { parseSearchParams } from '../services/util.service'
import Skeleton from 'react-loading-skeleton'

export function StayExplore() {
    const [searchParams] = useSearchParams()
    const filterFromUrl = useMemo(() => parseSearchParams(searchParams), [searchParams])
    const { stays = [], isLoading } = useSelector(state => state.stayModule)

    useEffect(() => {
        setFilter(filterFromUrl)
        loadStays()
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
