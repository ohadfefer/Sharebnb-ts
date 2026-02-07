import { useEffect, useMemo, useRef, useState } from "react"
import { loadGoogleMapsPlaces } from "../services/googleMapsLoader.js"


function debounce<T extends (...args: any[]) => any>(
        fn: T,
        wait?: number
    ): (...args: Parameters<T>) => void {
    let t: any
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait) }
}

export function usePlacesAutocomplete() {
    const [ready, setReady] = useState(false)
    const acRef = useRef<google.maps.places.AutocompleteService | null>(null)
    const detailsRef = useRef<google.maps.places.PlacesService | null>(null)
    const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null)

    useEffect(() => {
        let mounted = true
        loadGoogleMapsPlaces().then(() => {
            if (!mounted) return
            acRef.current = new window.google.maps.places.AutocompleteService()
            detailsRef.current = new window.google.maps.places.PlacesService(document.createElement('div'))
            setReady(true)
        })
        return () => { mounted = false }
    }, [])

    const getPredictions = useMemo(() => debounce((input, cb) => {
        const svc  = acRef.current
        if (!svc || !input || input.trim().length < 2) return cb([])
        if (!sessionTokenRef.current) {
            sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken()
        }
        svc.getPlacePredictions(
            {
                input,
                sessionToken: sessionTokenRef.current,
                // Optional filters:
                // types: ["geocode"], // or "(cities)"
                // componentRestrictions: { country: ["il","es"] },
            },
            (preds, status) => {
                const OK = window.google.maps.places.PlacesServiceStatus.OK;
                cb(status === OK && Array.isArray(preds) ? preds.slice(0, 5) : [])
            }
        );
    }, 200), [])

    // NEW: lightweight details fetch
    function getDetails(placeId: string, fields: string[] = ['geometry', 'address_components', 'formatted_address', 'name']): Promise<PlaceResult | null> {
        return new Promise((resolve, reject) => {
            const svc = detailsRef.current;
            if (!svc || !placeId) return resolve(null);
            svc.getDetails(
                { placeId, fields, sessionToken: sessionTokenRef.current ?? undefined},
                (place, status) => {
                    const OK = window.google.maps.places.PlacesServiceStatus.OK
                    if (status !== OK || !place) return reject(new Error('Place details failed'))
                    resolve(place as PlaceResult)
                }
            )
        })
    }

    const resetSession = () => { sessionTokenRef.current = null }

    return { ready, getPredictions, getDetails, resetSession }
}
