import { useEffect, useRef } from 'react'

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY_DETAILS;

export function StayMap({ stay }) {
    const mapRef = useRef(null)
    const mapInstanceRef = useRef(null)
    const markerRef = useRef(null)

    useEffect(() => {
        if (!stay || !stay.loc || !mapRef.current) return

        if (!window.google || !window.google.maps) {
            const script = document.createElement('script')
            script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`
            script.async = true
            script.defer = true
            script.onload = initMap
            document.head.appendChild(script)
        } else {
            initMap()
        }

        function initMap() {
            const { lat, lng } = stay.loc
            const position = { lat, lng }

            const map = new window.google.maps.Map(mapRef.current, {
                center: position,
                zoom: 15,
                mapTypeId: window.google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                styles: [
                    {
                        featureType: 'poi',
                        elementType: 'labels',
                        stylers: [{ visibility: 'off' }]
                    }
                ]
            })

            const marker = new window.google.maps.Marker({
                position: position,
                map: map,
                icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 0C10.477 0 6 4.477 6 10C6 17.5 16 32 16 32S26 17.5 26 10C26 4.477 21.523 0 16 0ZM16 14C13.791 14 12 12.209 12 10C12 7.791 13.791 6 16 6C18.209 6 20 7.791 20 10C20 12.209 18.209 14 16 14Z" fill="#FF385C"/>
                        </svg>
                    `),
                    scaledSize: new window.google.maps.Size(32, 32),
                    anchor: new window.google.maps.Point(16, 32)
                },
                title: stay.name
            })

            mapInstanceRef.current = map
            markerRef.current = marker
        }

        return () => {
            if (markerRef.current) {
                markerRef.current.setMap(null)
            }
            if (mapInstanceRef.current) {
                mapInstanceRef.current = null
            }
        }
    }, [stay])

    if (!stay || !stay.loc) {
        return null
    }

    return (
        <div className="stay-map">
            <div className="map-header">Where you'll be</div>
            <div className="location-header">{stay.loc.city}, {stay.loc.country}</div>
            <div className="map-container">
                <div ref={mapRef} className="google-map"></div>
            </div>
        </div>
    )
}