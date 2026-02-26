
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

    script.onload = () => {
      // Check for InvalidKeyMapError after script loads
      if (!window.google?.maps?.places) {
        const err = new Error("Google Maps loaded but Places API unavailable — check your API key")
        console.warn(err.message)
        reject(err)
        return
      }
      resolve()
    }
    script.onerror = () => {
      console.warn("Failed to load Google Maps script — autocomplete and maps will be unavailable")
      reject(new Error("Failed to load Google Maps script"))
    }

    document.head.appendChild(script)
  })

  // Only reset on success so failed loads don't retry endlessly
  loadingPromise.then(() => {
    // keep the resolved promise cached — no reset needed
  }, () => {
    // keep the rejected promise cached so we don't re-inject broken scripts
  })

  return loadingPromise
}