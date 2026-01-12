import { httpService } from '../http.service.js'
import { StayServiceRemote, FilterBy, Stay } from '../../types/global.js'

export const stayService: StayServiceRemote = {
    query,
    getById,
    save,
    remove,
    addStayMsg,
    addToWishlist,
    removeFromWishlist,
    getWishlistStays
}

async function query(filterBy: FilterBy) {
    const f: FilterBy = { ...filterBy }
    console.log('stay.service.remote.query -> original filterBy:', filterBy)

    // Only sum if guests is an object from the UI.
    if (f.guests && typeof f.guests === 'object') {
        const { adults = 0, children = 0 } = f.guests
        
        if (typeof adults === "string" && typeof children === "string") {
            f.guests = (parseInt(adults, 10) || 0) + (parseInt(children, 10) || 0)
        }
    }

    // If it's a string from URL (?guests=8), make sure it's numeric:
    if (typeof f.guests === 'string') f.guests = parseInt(f.guests, 10) || 0

    console.log('stay.service.remote.query -> processed filter:', f)
    return httpService.get('stay', f)
    // if (filterBy.guests) {
    //     const sum = filterBy.guests.adults +
    //         filterBy.guests.children
    //     filterBy.guests = sum
    // }

    // return httpService.get(`stay`, filterBy)
}

function getById(stayId: string) {
    return httpService.get(`stay/${stayId}`)
}

async function remove(stayId: string) {
    return httpService.delete(`stay/${stayId}`)
}
async function save(stay: Stay) {
    var savedStay
    if (stay._id) {
        savedStay = await httpService.put(`stay/${stay._id}`, stay)
    } else {
        savedStay = await httpService.post('stay', stay)
    }
    return savedStay
}

async function addStayMsg(stayId: string, txt: string) {
    const savedMsg = await httpService.post(`stay/${stayId}/msg`, { txt })
    return savedMsg
}

async function addToWishlist(stayId: string, userId: string) {
    const updatedStay = await httpService.post(`stay/${stayId}/wishlist`)
    return updatedStay
}

async function removeFromWishlist(stayId: string, userId: string) {
    const updatedStay = await httpService.delete(`stay/${stayId}/wishlist/${userId}`)
    return updatedStay
}

async function getWishlistStays(userId: string) {
    const stays = await httpService.get(`stay/wishlist/${userId}`)
    return stays
}


