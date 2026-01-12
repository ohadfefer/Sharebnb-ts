// Type definitions for Stay-related entities
interface Guests {
  adults: number | string
  children: number | string
  infants: number | string
  pets: number | string
}

interface FilterBy {
  address: string
  maxPrice: string
  checkIn: string
  checkOut: string
  guests: Guests | string | number
  labels: string[]
}

interface Host {
  _id?: string
  fullname: string
  location: string
  about: string
  responseTime: string
  isSuperhost: boolean
  pictureUrl: string
}

interface Location {
  country: string
  countryCode: string
  city: string
  address: string
  lat: number
  lng: number
}

interface Review {
  at: string
  by: { fullname: string; imgUrl: string; id: string }
  txt: string
  _id?: string
}

interface AvailableDate {
  start: string
  end: string
}

interface Stay {
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
  rating?: string | number
  guestFavorit?: boolean
  isGuestFavorite?: boolean
  wishlist?: { userId: string; addedAt: string }[]
}

interface StayServiceRemote {
  query(filterBy: FilterBy): Promise<Stay[]>
  getById(stayId: string): Promise<Stay>
  save(stay: Stay): Promise<Stay>
  remove(stayId: string): Promise<void>
  addStayMsg(stayId: string, txt: string): Promise<any>
  addToWishlist(stayId: string, userId: string): Promise<Stay>
  removeFromWishlist(stayId: string, userId: string): Promise<Stay>
  getWishlistStays(userId: string): Promise<Stay[]>
}

interface StayService extends StayServiceRemote {
  getDefaultFilter(): FilterBy
}

declare global {
  interface Window {
    stayService?: StayService  // ← use ? if it's optional / only in dev
  }
}

export { StayService, StayServiceRemote, Stay, FilterBy, Guests, Host, Location, Review, AvailableDate }  // important: makes this a module (otherwise TS treats it as ambient)