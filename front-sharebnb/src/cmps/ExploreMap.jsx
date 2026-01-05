import { useEffect, useRef } from 'react'

const AIRBNB_LITE_STYLE = [
    { featureType: "landscape.natural", elementType: "geometry.fill", stylers: [{ color: "#e8f2ca" }] },
    { featureType: "landscape.natural.terrain", elementType: "geometry.fill", stylers: [{ color: "#e8f2ca" }] },
    { featureType: "poi.park", elementType: "geometry.fill", stylers: [{ color: "#e1f3ca" }] },
    { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#cae8f2" }] },
]


let mapsPromise
function loadGoogleMaps() {
    // Already loaded?
    if (window.google?.maps) return Promise.resolve(window.google.maps)
    if (mapsPromise) return mapsPromise

    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    if (!key) {
        return Promise.reject(new Error('VITE_GOOGLE_MAPS_API_KEY is missing'))
    }

    mapsPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script')
        // JS Maps API (not Static Maps). Add libraries you use.
        script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&v=weekly&libraries=marker,places`
        script.async = true
        script.onerror = (error) => reject(new Error('Failed to load Google Maps JS API', error))
        script.onload = () => resolve(window.google.maps)
        document.head.appendChild(script)
    })

    return mapsPromise
}

export function ExploreMap({ stays }) {
    const ref = useRef(null)
    const mapRef = useRef(null)
    const markersRef = useRef([])

    useEffect(() => {
        let mounted = true;

        loadGoogleMaps()
            .then(() => {
                if (!mounted || !ref.current) return
                
                // Default center to Santorini, Greece
                const center = { lat: 36.4123, lng: 25.4321 }

                mapRef.current = new window.google.maps.Map(ref.current, {
                    center,
                    zoom: 13, // Good zoom level for Santorini
                    mapTypeId: 'roadmap',
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: true,
                    styles: AIRBNB_LITE_STYLE,
                });

                renderMarkers(stays)
            })
            .catch((err) => {
                console.error('Maps load failed:', err)
            })

        return () => { mounted = false; }
    }, [])

    useEffect(() => {
        if (mapRef.current) renderMarkers(stays)
    }, [stays])

    function renderMarkers(items) {
        // clear old
        markersRef.current.forEach(marker => marker.setMap(null))
        markersRef.current = []

        if (!items?.length) return

        const bounds = new google.maps.LatLngBounds()

        items.forEach(stay => {
            const pos = { lat: stay.loc.lat, lng: stay.loc.lng }
            const marker = new google.maps.Marker({
                position: pos,
                map: mapRef.current,
                label: {
                    text: `$${Math.round(stay.price)}`,
                    className: 'price-label',
                }
            })
            markersRef.current.push(marker)
            bounds.extend(pos)
        })

        // Only fit bounds if there are multiple stays and they're spread out
        // This prevents the map from zooming out too much when there are many stays
        if (items.length > 1) {
            const ne = bounds.getNorthEast()
            const sw = bounds.getSouthWest()
            const latDiff = ne.lat() - sw.lat()
            const lngDiff = ne.lng() - sw.lng()
            
            // Only fit bounds if the stays are reasonably close together
            // (within about 2 degrees of latitude/longitude)
            if (latDiff < 2 && lngDiff < 2) {
                mapRef.current.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 })
            }
        }
    }

    return <div ref={ref} style={{ width: '100%', height: '100%' }} />
}
