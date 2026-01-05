
import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'
import { userService } from '../user/index.js'

const STORAGE_KEY = 'stay'
createStays()

export const stayService = {
    query,
    getById,
    save,
    remove,
    addStayMsg,
    createStays
}

window.cs = stayService


async function query(filterBy = { address: '', maxPrice: 0 }) {
    var stays = await storageService.query(STORAGE_KEY)
    const { address, maxPrice, sortField, sortDir } = filterBy

    if (address) {
        const regex = new RegExp(filterBy.address, 'i')
        stays = stays.filter(stay => regex.test(stay.name) || regex.test(stay.loc.country) || regex.test(stay.loc.city))
    }
    if (maxPrice) {
        stays = stays.filter(stay => stay.price >= maxPrice)
    }
    if (sortField === 'name') {
        stays.sort((stay1, stay2) =>
            stay1[sortField].localeCompare(stay2[sortField]) * +sortDir)
    }
    if (sortField === 'price') {
        stays.sort((stay1, stay2) =>
            (stay1[sortField] - stay2[sortField]) * +sortDir)
    }

    stays = stays.map(({ _id, name, price, host, imgUrls, type, loc, capacity, rooms, bedrooms, at }) => ({
        _id,
        name,
        price,
        host,
        imgUrls,
        type,
        loc,
        capacity,
        rooms,
        bedrooms,
        at
    }))
    return stays
}

function getById(stayId) {
    return storageService.get(STORAGE_KEY, stayId)
}

async function remove(stayId) {
    await storageService.remove(STORAGE_KEY, stayId)
}

async function save(stay) {
    let savedStay
    if (stay._id) {
        const stayToSave = {
            _id: stay._id,
            name: stay.name,
            type: stay.type,
            price: Number(stay.price) || 0,
            imgUrls: stay.imgUrls || [],
            loc: stay.loc,
            host: stay.host,
            capacity: Number(stay.capacity) || 0,
            rooms: Number(stay.rooms) || 0,
            bedrooms: Number(stay.bedrooms) || 0,
            bathrooms: Number(stay.bathrooms) || 0,
            labels: stay.labels || [],
            amenities: stay.amenities || [],
            summary: stay.summary || '',
            description: stay.description || ''
        }
        savedStay = await storageService.put(STORAGE_KEY, stayToSave)
    } else {
        const defaultLoc = {
            country: 'Norway', countryCode: 'NO', city: 'Bergen',
            address: '12 Fjord Lane', lat: 60.39299, lng: 5.32415
        }
        const stayToSave = {
            name: stay.name,
            type: stay.type,
            price: Number(stay.price) || 0,
            imgUrls: Array.isArray(stay.imgUrls) ? stay.imgUrls : [],
            loc: (stay.loc && (stay.loc.city || stay.loc.country || stay.loc.address)) ? stay.loc : defaultLoc, // <—
            capacity: Number(stay.capacity) || 0,
            rooms: Number(stay.rooms) || 0,
            bedrooms: Number(stay.bedrooms) || 0,
            bathrooms: Number(stay.bathrooms) || 0,
            labels: stay.labels || [],
            amenities: stay.amenities?.length ? stay.amenities : ['Pool', 'Wifi', 'Air conditioning', 'Kitchen', 'Parking', 'Heating', 'Elevator'],
            summary: stay.summary || '',
            description: stay.description || '',
            reviews: [],
            host: stay.host || {
                _id: 'u103', fullname: 'Maria Gomez',
                imgUrl: 'https://a0.muscache.com/im/pictures/maria.jpg'
            }
        }
        savedStay = await storageService.post(STORAGE_KEY, stayToSave)
    }
    return savedStay
}

async function addStayMsg(stayId, txt) {
    const stay = await getById(stayId)

    const msg = {
        id: makeId(),
        by: userService.getLoggedinUser(),
        txt
    }
    stay.msgs.push(msg)
    await storageService.put(STORAGE_KEY, stay)

    return msg
}

function createStays() {
    let stays = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!stays || !stays.length) {
        stays = [
            {
                _id: 's102',
                name: 'Sea Breeze Villa',
                type: 'Villa',
                imgUrls: ['https://a0.muscache.com/im/pictures/hosting/Hosting-1417371546794397632/original/38455273-3c60-4cc7-8748-dd9c9d695462.jpeg?im_w=960',
                    'https://a0.muscache.com/im/pictures/hosting/Hosting-1417371546794397632/original/f2c33def-1edb-4367-8277-d461ea04da9e.jpeg?im_w=480',
                    'https://a0.muscache.com/im/pictures/hosting/Hosting-1417371546794397632/original/4657d6b9-dbab-4c78-b3e2-aa3f4e1ba4ff.jpeg?im_w=480',
                    'https://a0.muscache.com/im/pictures/hosting/Hosting-1417371546794397632/original/f1d90ccb-fa66-44df-8151-784cdbc3a725.jpeg?im_w=480',
                    'https://a0.muscache.com/im/pictures/hosting/Hosting-1417371546794397632/original/2d866c41-294f-42eb-8e41-46d62a4febaa.jpeg?im_w=480'
                ],
                price: 250.0,
                summary: 'Luxury villa with private pool and ocean view.',
                capacity: 6,
                rooms: 2,
                bedrooms: 2,
                at: "2019-01-11T05:00:00.000Z",
                amenities: ['Pool', 'Wifi', 'Air conditioning', 'Kitchen', 'Parking', 'Heating', 'Elevator'],
                labels: ['Luxury', 'Beachfront', 'Family Friendly'],
                host: {
                    _id: 'u103',
                    fullname: 'Maria Gomez',
                    imgUrl: 'https://a0.muscache.com/im/pictures/maria.jpg',
                },
                loc: {
                    country: 'Spain',
                    countryCode: 'ES',
                    city: 'Barcelona',
                    address: '45 Carrer de la Mar',
                    lat: 41.3851,
                    lng: 2.1734,
                },
                reviews: [
                    {
                        id: 'r101',
                        txt: 'Amazing location, perfect for families.',
                        rate: 4,
                        by: {
                            _id: 'u104',
                            fullname: 'Chris Evans',
                            imgUrl: '/img/chris.jpg',
                        },
                    },
                    {
                        id: 'r102',
                        txt: 'We had a truly amazing stay at this Airbnb in Netanya! The apartment was absolutely perfect very comfortable for a family or anyone else, spotlessly clean',
                        rate: 5,
                        by: {
                            _id: 'u104',
                            fullname: 'Yael Evans',
                            imgUrl: '/img/chris.jpg',
                        },
                    },
                    {
                        id: 'r103',
                        txt: 'Yosef is a great host and the apartment was a great find. Located first line to the sea with breeze and plenty of lights. Restaurants salons and synagogue within ealking',
                        rate: 1,
                        by: {
                            _id: 'u104',
                            fullname: 'Eva Evans',
                            imgUrl: '/img/chris.jpg',
                        },
                    },
                    {
                        id: 'r104',
                        txt: 'the apartment was clean great location.  yosef was always available with any questions I had.',
                        rate: 5,
                        by: {
                            _id: 'u104',
                            fullname: 'Liz Evans',
                            imgUrl: '/img/chris.jpg',
                        },
                    },
                    {
                        id: 'r105',
                        txt: 'Amazing location, perfect for families.',
                        rate: 2,
                        by: {
                            _id: 'u104',
                            fullname: 'Chris Evans',
                            imgUrl: '/img/chris.jpg',
                        },
                    },
                    {
                        id: 'r106',
                        txt: 'Great location. The host is very responsive and was always making sure we have everything we need',
                        rate: 3,
                        by: {
                            _id: 'u104',
                            fullname: 'Adir Evans',
                            imgUrl: '/img/chris.jpg',
                        },
                    },
                ],
                likedByUsers: ['user3', 'user4'],
            },
            {
                _id: 's103',
                name: 'Mountain Escape Cabin',
                type: 'Cabin',
                imgUrls: ['https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cm9vbXN8ZW58MHx8MHx8fDA%3D', 'https://plus.unsplash.com/premium_photo-1675616575255-99f40284212a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHJvb21zfGVufDB8fDB8fHww'],
                price: 120.0,
                summary: 'Rustic cabin in the mountains with fireplace.',
                capacity: 4,
                rooms: 2,
                bedrooms: 2,
                at: "2019-01-11T05:00:00.000Z",
                amenities: ['Fireplace', 'Wifi', 'Kitchen', 'Heating'],
                labels: ['Cozy', 'Nature', 'Hiking'],
                host: {
                    _id: 'u105',
                    fullname: 'Lars Eriksson',
                    imgUrl: 'https://a0.muscache.com/im/pictures/lars.jpg',
                },
                loc: {
                    country: 'Norway',
                    countryCode: 'NO',
                    city: 'Bergen',
                    address: '12 Fjord Lane',
                    lat: 60.39299,
                    lng: 5.32415,
                },
                reviews: [
                    {
                        id: 'r102',
                        txt: 'So peaceful, loved the fireplace!',
                        rate: 5,
                        by: {
                            _id: 'u106',
                            fullname: 'Emma Stone',
                            imgUrl: '/img/emma.jpg',
                        },
                    },
                ],
                likedByUsers: ['user2'],
            },
            {
                _id: 's104',
                name: 'City Center Loft',
                type: 'Apartment',
                imgUrls: ['https://plus.unsplash.com/premium_photo-1663126298656-33616be83c32?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cm9vbXN8ZW58MHx8MHx8fDA%3D', 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHJvb21zfGVufDB8fDB8fHww'],
                price: 150.0,
                summary: 'Modern loft in the heart of the city.',
                capacity: 2,
                rooms: 2,
                bedrooms: 2,
                at: "2019-01-11T05:00:00.000Z",
                amenities: ['Wifi', 'Kitchen', 'Workspace', 'Elevator'],
                labels: ['Business', 'Trendy', 'Central'],
                host: {
                    _id: 'u107',
                    fullname: 'Akira Tanaka',
                    imgUrl: 'https://a0.muscache.com/im/pictures/akira.jpg',
                },
                loc: {
                    country: 'Japan',
                    countryCode: 'JP',
                    city: 'Tokyo',
                    address: '5 Chiyoda',
                    lat: 35.6895,
                    lng: 139.6917,
                },
                reviews: [
                    {
                        id: 'r103',
                        txt: 'Perfect for a short stay, very central.',
                        rate: 4,
                        by: {
                            _id: 'u108',
                            fullname: 'Mark Lee',
                            imgUrl: '/img/mark.jpg',
                        },
                    },
                ],
                likedByUsers: ['user5'],
            },
            {
                _id: 's105',
                name: 'Countryside B&B',
                type: 'Bed & Breakfast',
                imgUrls: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHJvb21zfGVufDB8fDB8fHww', 'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cm9vbXN8ZW58MHx8MHx8fDA%3D'],
                price: 90.0,
                summary: 'Charming countryside stay with homemade breakfast.',
                capacity: 3,
                rooms: 2,
                bedrooms: 2,
                at: "2019-01-11T05:00:00.000Z",
                amenities: ['Breakfast included', 'Wifi', 'Parking', 'Garden'],
                labels: ['Charming', 'Relaxing', 'Countryside'],
                host: {
                    _id: 'u109',
                    fullname: 'Sophie Laurent',
                    imgUrl: 'https://a0.muscache.com/im/pictures/sophie.jpg',
                },
                loc: {
                    country: 'France',
                    countryCode: 'FR',
                    city: 'Lyon',
                    address: '78 Rue de la Campagne',
                    lat: 45.764,
                    lng: 4.8357,
                },
                reviews: [
                    {
                        id: 'r104',
                        txt: 'Delicious breakfast, lovely garden.',
                        rate: 5,
                        by: {
                            _id: 'u110',
                            fullname: 'Anna Petrova',
                            imgUrl: '/img/anna.jpg',
                        },
                    },
                ],
                likedByUsers: ['mini-user'],
            },
            {
                _id: 's106',
                name: 'Desert Dome Stay',
                type: 'Unique Stay',
                imgUrls: ['https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHJvb21zfGVufDB8fDB8fHww', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHJvb21zfGVufDB8fDB8fHww'],
                price: 180.0,
                summary: 'Sleep under the stars in a desert dome.',
                capacity: 2,
                rooms: 2,
                bedrooms: 2,
                at: "2019-01-11T05:00:00.000Z",
                amenities: ['AC', 'Private bathroom', 'Stargazing deck'],
                labels: ['Unique', 'Adventure', 'Romantic'],
                host: {
                    _id: 'u111',
                    fullname: 'Mohammed Ali',
                    imgUrl: 'https://a0.muscache.com/im/pictures/mohammed.jpg',
                },
                loc: {
                    country: 'Morocco',
                    countryCode: 'MA',
                    city: 'Merzouga',
                    address: 'Sahara Desert Camp',
                    lat: 31.0994,
                    lng: -4.0127,
                },
                reviews: [
                    {
                        id: 'r105',
                        txt: 'Unforgettable experience, sky was breathtaking!',
                        rate: 5,
                        by: {
                            _id: 'u112',
                            fullname: 'David Chen',
                            imgUrl: '/img/david.jpg',
                        },
                    },
                ],
                likedByUsers: ['user6', 'user7'],
            },
        ]
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stays))
    }
}

const orders = [
    {
        _id: 'o1225',
        hostId: { _id: 'u102', fullname: "bob", imgUrl: "..." },
        guest: {
            _id: 'u101',
            fullname: 'User 1',
        },
        totalPrice: 160,
        startDate: '2025/10/15',
        endDate: '2025/10/17',
        guests: {
            adults: 1,
            kids: 2,
        },
        stay: {
            _id: 'h102',
            name: 'House Of Uncle My',
            price: 80.0,
        },
        msgs: [],
        status: 'pending',
    },
]

const users = [
    {
        _id: 'u101',
        fullname: 'User 1',
        imgUrl: '/img/img1.jpg',
        username: 'user1',
        password: 'secret',
        reviews: [
            {
                id: 'madeId',
                txt: 'Quiet guest...',
                rate: 4,
                by: {
                    _id: 'u102',
                    fullname: 'user2',
                    imgUrl: '/img/img2.jpg',
                },
            },
        ],
    },
    {
        _id: 'u102',
        fullname: 'User 2',
        imgUrl: '/img/img2.jpg',
        username: 'user2',
        password: 'secret',
    },
]