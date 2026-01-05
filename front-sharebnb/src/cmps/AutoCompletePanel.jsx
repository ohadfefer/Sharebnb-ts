// cmps/AutoCompletePanel.jsx
import { useEffect, useState } from "react"
import { usePlacesAutocomplete } from "../customHooks/usePlacesAutocomplete.js"
import location from "../assets/imgs/location.png"

function parseComponents(components = []) {
    const out = {}
    for (const c of components) {
        const t = c.types || []
        if (t.includes('country')) { out.country = c.long_name; out.countryCode = c.short_name }
        if (t.includes('locality')) out.city = c.long_name
        if (t.includes('postal_town') && !out.city) out.city = c.long_name
        if (t.includes('administrative_area_level_2') && !out.city) out.city = c.long_name
        if (t.includes('route')) out.route = c.long_name
        if (t.includes('street_number')) out.streetNumber = c.long_name
    }
    out.street = [out.streetNumber, out.route].filter(Boolean).join(' ')
    return out
}

export function AutoCompletePanel({ value = {}, onChange, onComplete, onAdvance }) {
    const query = value.address || ""
    const { ready, getPredictions, getDetails, resetSession } = usePlacesAutocomplete()
    const [items, setItems] = useState([])

    useEffect(() => {
        if (!ready || query.trim().length < 2) { setItems([]); return; }
        getPredictions(query, (preds) =>
            setItems((preds || []).slice(0, 5).map(p => ({
                id: p.place_id,
                label: p.structured_formatting?.main_text || p.description,
                sub: p.structured_formatting?.secondary_text || "",
                description: p.description,
            })))
        )
    }, [ready, query, getPredictions])

    async function select(item) {
        const fallbackAddress = item.description || item.label
        try {
            const details = await getDetails(item.id, ['geometry', 'address_components', 'formatted_address', 'name'])
            const comps = parseComponents(details?.address_components)
            const lat = details?.geometry?.location?.lat?.()
            const lng = details?.geometry?.location?.lng?.()
            const address = details?.formatted_address || fallbackAddress

            onChange?.({
                placeId: item.id,
                address,
                city: comps.city || '',
                country: comps.country || '',
                countryCode: comps.countryCode || '',
                street: comps.street || '',
                lat, lng
            })
        } catch {
            // Fall back to just text if details fail
            onChange?.({ placeId: item.id, address: fallbackAddress })
        } finally {
            resetSession()
            onAdvance?.()
            onComplete?.()
        }
    }

    return (
        <div className="where-suggestions">
            <ul className="where-list">
                {items.map(item => (
                    <li key={item.id}>
                        <button
                            type="button"
                            className="where-row"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); select(item) }}
                        >
                            <span className="where-icon-mobile"><img src={location} alt="" className="location-icon"/></span>
                            <span className="where-texts">
                                <span className="where-title">{item.label}</span>
                                {item.sub && <span className="where-sub">{item.sub}</span>}
                            </span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
