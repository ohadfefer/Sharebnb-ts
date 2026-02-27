import { useEffect, useMemo, useRef, useState } from "react"
import { loadGoogleMapsPlaces } from "../services/googleMapsLoader.js"

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

export interface SuggestionItem {
  id: string
  label: string
  sub: string
  description: string
  toPlace: () => google.maps.places.Place
}

export function usePlacesAutocomplete() {
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null)

  useEffect(() => {
    let mounted = true

    loadGoogleMapsPlaces()
      .then(() => {
        if (!mounted) return
        setReady(true)
      })
      .catch((err) => {
        if (!mounted) return
        console.warn("Places autocomplete unavailable:", err.message)
        setError(err.message || "Google Maps API failed to load")
      })

    return () => {
      mounted = false
    }
  }, [])

  const getPredictions = useMemo(
    () =>
      debounce((input: string, cb: (items: SuggestionItem[]) => void) => {
        if (!input.trim() || input.trim().length < 2) {
          return cb([])
        }

        if (!sessionTokenRef.current) {
          sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken()
        }

        const request: google.maps.places.AutocompleteRequest = {
          input,
          sessionToken: sessionTokenRef.current,
        }

        google.maps.places.AutocompleteSuggestion
          .fetchAutocompleteSuggestions(request)
          .then(({ suggestions }) => {
            const items: SuggestionItem[] = (suggestions || [])
              .slice(0, 5)
              .filter(s => s.placePrediction)
              .map(s => {
                const p = s.placePrediction!
                const mainText = p.mainText?.text || p.text?.text || ""
                const secondaryText = p.secondaryText?.text || ""
                return {
                  id: p.placeId,
                  label: mainText,
                  sub: secondaryText,
                  description: p.text?.text || mainText,
                  toPlace: () => p.toPlace(),
                }
              })
            cb(items)
          })
          .catch(() => cb([]))
      }, 200),
    []
  )

  async function getDetails(
    place: google.maps.places.Place,
    fields: string[] = [
      "location",
      "addressComponents",
      "formattedAddress",
      "displayName",
    ]
  ): Promise<google.maps.places.Place | null> {
    try {
      await place.fetchFields({ fields })
      return place
    } catch (err) {
      console.error("Place fetch failed:", err)
      return null
    }
  }

  const resetSession = () => {
    sessionTokenRef.current = null
  }

  return { ready, error, getPredictions, getDetails, resetSession }
}
