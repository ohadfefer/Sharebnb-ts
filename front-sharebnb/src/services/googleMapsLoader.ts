
let loadingPromise: Promise<void> | undefined

export function loadGoogleMapsPlaces(): Promise<void> {
  // Already loaded - instant success
  if (window.google?.maps?.places) {
    return Promise.resolve()
  }

  // Already loading - reuse the same promise
  if (loadingPromise) {
    return loadingPromise
  }

  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  if (!key) {
    return Promise.reject(new Error("Google Maps API key is missing"))
  }

  const url = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`

  loadingPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script")

    script.src = url
    script.async = true
    script.defer = true           

    script.onload = () => resolve()        
    script.onerror = () => reject(new Error("Failed to load Google Maps script"))

    document.head.appendChild(script)
  })

  loadingPromise.finally(() => {
    loadingPromise = undefined
  })

  return loadingPromise
}