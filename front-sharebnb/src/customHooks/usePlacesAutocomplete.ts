import { useEffect, useMemo, useRef, useState } from "react"
import { loadGoogleMapsPlaces } from "../services/googleMapsLoader.js"  
import { PredictionsProps } from "../types/google-map.js"

function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait = 200
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout | null = null
  return (...args) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), wait)
  }
}



export function usePlacesAutocomplete() {
  const [ready, setReady] = useState(false)
  const acRef = useRef<google.maps.places.AutocompleteService | null>(null)
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null)

  useEffect(() => {
    let mounted = true

    loadGoogleMapsPlaces().then(() => {
      if (!mounted) return

      // No more PlacesService dummy div needed!
      acRef.current = new google.maps.places.AutocompleteService()
      setReady(true)
    })

    return () => {
      mounted = false
    }
  }, [])

  const getPredictions = useMemo(
    () =>
      debounce((input: string, cb: (preds: PredictionsProps[]) => void) => {
        const svc = acRef.current
        if (!svc || !input.trim() || input.trim().length < 2) {
          return cb([])
        }

        if (!sessionTokenRef.current) {
          sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken()
        }

        svc.getPlacePredictions(
          {
            input,
            sessionToken: sessionTokenRef.current,
          },
          (predictions, status) => {
            const isOK = status === google.maps.places.PlacesServiceStatus.OK
            cb(isOK && Array.isArray(predictions) ? predictions.slice(0, 5) : [])
          }
        )
      }, 200),
    []
  )

  async function getDetails(
    placeId: string,
    fields: string[] = [
      "location",              // lat/lng → geometry.location
      "addressComponents",     // structured parts
      "formattedAddress",      // full readable address
      "displayName",           // place name
    ]
  ): Promise<any | null> {   // replace 'any' with proper PlaceResult type if you define it
    if (!placeId) return null

    try {
      // Create a Place object from the place_id (from prediction)
      const place = new google.maps.places.Place({ id: placeId })

      // Automatically uses the session token if it was part of the prediction flow
      // (no need to pass it manually in most cases with AutocompleteService)

      await place.fetchFields({ fields })

      // The place object now has the requested fields populated
      return place  // or return a custom shape: { lat: place.location?.lat(), ... }
    } catch (err) {
      console.error("Place fetch failed:", err)
      return null
    }
  }

  const resetSession = () => {
    sessionTokenRef.current = null
  }

  return { ready, getPredictions, getDetails, resetSession }
}