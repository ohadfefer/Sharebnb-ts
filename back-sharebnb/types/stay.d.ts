export interface Host {
    _id?: string
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
    by: { fullname: string; imgUrl: string; id: string }
    txt: string
    _id?: string
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
    _id?: string
    name: string
    type: string
    imgUrls: string[]
    price: number
    summary: string
    capacity: number
    amenities: string[]
    bathrooms: number
    bedrooms: number
    roomType: string
    host?: Host
    loc?: Location
    reviews?: Review[] | string
    likedByUsers?: any
    availableDates?: AvailableDate[]
    labels: string[]
    msgs?: StayMsg[]
    rating?: string | number
    guestFavorit?: boolean
    isGuestFavorite?: boolean
    wishlist?: { userId: string; addedAt: string }[]
    createdAt?: Date
}

export interface FilterBy {
    address: string
    guests: number
    maxPrice: number
    checkIn: string
    checkOut: string
    sortField: string
    sortDir: number
    hostId: string
}