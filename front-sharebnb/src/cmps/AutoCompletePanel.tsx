import { useEffect, useState } from "react"
import { usePlacesAutocomplete, SuggestionItem } from "../customHooks/usePlacesAutocomplete.js"
import location from "../assets/imgs/location.png"

// types
import { WherePanelProps } from "./WherePanel.js"

function parseComponents(components: google.maps.places.AddressComponent[] | undefined) {
    if (components) {
        const out = {} as any
        for (const c of components) {
            const t = c.types || []
            if (t.includes('country')) { out.country = c.longText; out.countryCode = c.shortText }
            if (t.includes('locality')) out.city = c.longText
            if (t.includes('postal_town') && !out.city) out.city = c.longText
            if (t.includes('administrative_area_level_2') && !out.city) out.city = c.longText
            if (t.includes('route')) out.route = c.longText
            if (t.includes('street_number')) out.streetNumber = c.longText
        }
        out.street = [out.streetNumber, out.route].filter(Boolean).join(' ')
        return out
    }
}

export function AutoCompletePanel({ value, onChange, onComplete, onAdvance }: WherePanelProps) {
    const query = value.address || ""
    const { ready, error, getPredictions, getDetails, resetSession } = usePlacesAutocomplete()
    const [items, setItems] = useState<SuggestionItem[]>([])

    useEffect(() => {
        if (!ready || query.trim().length < 2) { setItems([]); return }
        getPredictions(query, (suggestions) => setItems(suggestions))
    }, [ready, query, getPredictions])

    async function select(item: SuggestionItem) {
        const fallbackAddress = item.description || item.label
        try {
            const place = await getDetails(item.toPlace())
            const comps = parseComponents(place?.addressComponents)
            const lat = place?.location?.lat()
            const lng = place?.location?.lng()
            const address = place?.formattedAddress || fallbackAddress

            onChange?.({
                placeId: item.id,
                address,
                city: comps?.city || '',
                country: comps?.country || '',
                countryCode: comps?.countryCode || '',
                street: comps?.street || '',
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

    if (error) {
        return (
            <div className="where-suggestions">
                <p style={{ color: '#717171', fontSize: '0.85rem', padding: '8px 0' }}>
                    Address autocomplete is unavailable — please enter your location manually below.
                </p>
            </div>
        )
    }

    if (!items.length) return null

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
                            <span className="where-icon-mobile"><img src={location} alt="" className="location-icon" /></span>
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
