export interface Order {
	_id: string
	userId: string
	stayId: string
	hostId: string
	totalPrice: number
	startDate: Date | string
	endDate: Date | string
	guests: {
		adults: number
		children: number
	}
	status: "pending" | "approved" | "completed" | "rejected"
	createdAt: Date | string
	contactEmail?: string | null
	emails?: Record<string, any>
}

export interface OrderFilterBy {
	hostId?: string
	userId?: string
	guestId?: string
	status?: string
}

export interface AggregateOrderGuest {
	_id: string
	imgUrl?: string | null
	fullname: string
	email?: string | null
}

export interface AggregateOrderStay {
	_id: string
	name: string
	imgUrls?: string[]
	imgUrl?: string
	price?: number
	loc?: {
		country: string
		countryCode: string
		city: string
		address: string
		lat: number
		lng: number
	}
}

export interface AggregateOrderHost {
	_id: string
	imgUrl?: string | null
	fullname: string
	email?: string | null
}

export interface AggregateOrder extends Order {
	guest: AggregateOrderGuest
	stay: AggregateOrderStay
	host?: AggregateOrderHost
}
