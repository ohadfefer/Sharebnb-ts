let loadingPromise

export function loadGoogleMapsPlaces() {
    if (window.google?.maps?.places) return Promise.resolve()
    if (loadingPromise) return loadingPromise

    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    const url = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`
    loadingPromise = new Promise((resolve, reject) => {
        const s = document.createElement('script')
        s.src = url
        s.async = true
        s.onload = () => resolve()
        s.onerror = reject
        document.head.appendChild(s)
    })

    return loadingPromise
}
