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