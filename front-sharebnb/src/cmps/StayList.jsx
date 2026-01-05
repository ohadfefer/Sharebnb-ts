import { StayPreview } from './StayPreview'

export function StayList({ stays }) {
    const list = Array.isArray(stays) ? stays : []

    return (
        <section>
            <ul className="stay-list">
                {list.map((stay, i) => (
                    <li key={stay?._id || `skel-${i}`}>
                        <StayPreview stay={stay || undefined} loading={!stay} />
                    </li>
                ))}
            </ul>
        </section>
    )
}
