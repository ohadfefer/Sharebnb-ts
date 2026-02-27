export interface StayFormData {
    name: string
    type: string
    price: string | number
    loc: {
        address: string
        city: string
        country: string
        countryCode: string
        lat: number | null
        lng: number | null
    }
    imgUrls: string[]
    capacity: number
    rooms: number
    bedrooms: number
    bathrooms: number
    labels: string[]
    amenities: string[]
    summary: string
}