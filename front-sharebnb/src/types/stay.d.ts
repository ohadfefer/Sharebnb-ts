export interface Guests {
    adults: number | string
    children: number | string
    infants: number | string
    pets: number | string
}

export interface StayFilterBy {
    address: string
    maxPrice: string
    checkIn: string
    checkOut: string
    guests: Guests | string | number
    labels: string[]
    hostId?: string
    loc?: any // for FilterSheet.tsx
}

export interface Host {
    _id: string
    fullname: string
    location: string
    about: string
    responseTime: string
    isSuperhost: boolean
    pictureUrl: string
}

export interface Location {
    country: string
    countryCode: string
    city: string
    address: string
    lat: number
    lng: number
}

export interface Review {
    at: string
    by: { fullname: string; imgUrl: string; _id: string }
    txt: string
    _id: string
    aboutUser?: { fullname: string; imgUrl: string; _id: string }
}

export interface AvailableDate {
    start: string
    end: string
}

export interface StayMsg {
    id: string
    txt: string
    by: { _id: string; fullname: string; imgUrl?: string }
}

export interface Stay {
    _id: string
    name: string
    type: string
    imgUrls: string[]
    price: number | string
    summary: string
    capacity: number
    amenities: string[]
    bathrooms: number
    bedrooms: number
    host?: Host
    loc: Location
    reviews: Review[] | []
    likedByUsers?: any
    availableDates?: AvailableDate[]
    labels: string[]
    msgs?: StayMsg[]
    rating: number
    guestFavorit?: boolean
    isGuestFavorite?: boolean
    wishlist?: { userId: string; addedAt: string }[]
}