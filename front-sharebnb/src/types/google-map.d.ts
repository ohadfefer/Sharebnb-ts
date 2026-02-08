interface Window {
  google?: typeof google
}

interface PlaceResult {
  formatted_address?: string
  address_components?: google.maps.GeocoderAddressComponent[]
  geometry?: {
    location: {
      lat: () => number
      lng: () => number
    }
  }
  name?: string
}

export interface PredictionsProps {
  place_id: string
  structured_formatting?: { main_text: string, secondary_text?: string }
  description: string
}

export interface ItemProps {
  id: string
  label: string
  sub: string
  description: string
} 