import { StayPreview } from './StayPreview.jsx'

// types
import { Stay } from '../types/stay.js'

export function StayList({ stays }: { stays: Stay[] }) {
    const list = Array.isArray(stays) ? stays : []

    return (
        <section>
            <ul className="stay-list">
                {list.map((stay, i) => (
                    <li key={stay?._id || `skel-${i}`}>
                        <StayPreview stay={stay} loading={!stay} />
                    </li>
                ))}
            </ul>
        </section>
    )
}
