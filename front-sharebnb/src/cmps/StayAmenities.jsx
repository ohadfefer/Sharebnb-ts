import beach from '../assets/logo/icons/beach.svg'
import wifi from '../assets/logo/icons/wifi.svg'
import kitchen from '../assets/logo/icons/kitchen.svg'
import ac from '../assets/logo/icons/ac.svg'
import heating from '../assets/logo/icons/heating.svg'
import parking from '../assets/logo/icons/parking.svg'
import elevator from '../assets/logo/icons/elevator.svg'
import tv from '../assets/logo/icons/tv.svg'
import freeParking from '../assets/logo/icons/freeParking.svg'
import kidFriendly from '../assets/logo/icons/kidFriendly.svg'
import washer from '../assets/logo/icons/washer.svg'
import dryer from '../assets/logo/icons/dryer.svg'
import smokeDetector from '../assets/logo/icons/smokeDetector.svg'
import shampoo from '../assets/logo/icons/shampoo.svg'
import hairDryer from '../assets/logo/icons/hairDryer.svg'
import iron from '../assets/logo/icons/iron.svg'
import laptopFriendlyWorkspace from '../assets/logo/icons/laptopFriendlyWorkspace.svg'
import buildingStaff from '../assets/logo/icons/buildingStaff.svg'
import privateEntrance from '../assets/logo/icons/privateEntrance.svg'
import bathtub from '../assets/logo/icons/bathtub.svg'
import showerGel from '../assets/logo/icons/showerGel.svg'
import crib from '../assets/logo/icons/crib.svg'
import essentials from '../assets/logo/icons/essentials.svg'
import hotWater from '../assets/logo/icons/hotWater.svg'
import bedLinens from '../assets/logo/icons/bedLinens.svg'
import microwave from '../assets/logo/icons/microwave.svg'
import coffeeMaker from '../assets/logo/icons/coffeeMaker.svg'
import refrigerator from '../assets/logo/icons/refrigerator.svg'
import dishwasher from '../assets/logo/icons/dishwasher.svg'
import dishesAndSilverware from '../assets/logo/icons/dishesAndSilverware.svg'
import cookingBasics from '../assets/logo/icons/cookingBasics.svg'
import oven from '../assets/logo/icons/oven.svg'

import stove from '../assets/logo/icons/stove.svg'
import patioOrBalcony from '../assets/logo/icons/patioOrBalcony.svg'
import { useState } from 'react'

export function StayAmenities({ stay }) {
    function getAmenityIcon(amenity) {
        switch (amenity) {
            case 'Pool':
                return beach
            case 'Wifi':
                return wifi
            case 'Air conditioning':
                return ac
            case 'Kitchen':
                return kitchen
            case 'Parking':
                return parking
            case 'Heating':
                return heating
            case 'Elevator':
                return elevator
            case 'TV':
                return tv
            case 'Free parking on premises':
                return freeParking
            case 'Family/kid friendly':
                return kidFriendly
            case 'Washer':
                return washer
            case 'Dryer':
                return dryer
            case 'Smoke detector':
                return smokeDetector
            case 'Shampoo':
                return shampoo
            case 'Hair dryer':
                return hairDryer
            case 'Iron':
                return iron
            case 'Laptop friendly workspace':
                return laptopFriendlyWorkspace
            case 'Building staff':
                return buildingStaff
            case 'Private entrance':
                return privateEntrance
            case 'Bathtub':
                return bathtub
            case 'Shower gel':
                return showerGel
            case 'Crib':
                return crib
            case 'Essentials':
                return essentials
            case 'Hot water':
                return hotWater
            case 'Bed linens':
                return bedLinens
            case 'Microwave':
                return microwave
            case 'Coffee maker':
                return coffeeMaker
            case 'Refrigerator':
                return refrigerator
            case 'Dishwasher':
                return dishwasher
            case 'Dishes and silverware':
                return dishesAndSilverware
            case 'Cooking basics':
                return cookingBasics
            case 'Oven':
                return oven
            case 'Stove':
                return stove
            case 'Patio or balcony':
                return patioOrBalcony
            default:
                return buildingStaff
        }
    }

    const [isModalOpen, setIsModalOpen] = useState(false)
    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

    const visibleAmenities = Array.isArray(stay?.amenities) ? stay.amenities.slice(0, 10) : []

    return (
        <>
            <div className="stay-amenities">
                <div className="amenities-grid">
                    {visibleAmenities.map((amenity, idx) => (
                        <div className="amenity-row" key={idx}>
                            <img src={getAmenityIcon(amenity)} alt="" width={24} />
                            <div className="amenity-name">{amenity}</div>
                        </div>
                    ))}
                </div>
            </div>
            {Array.isArray(stay?.amenities) && stay.amenities.length > 10 && (
                <div className="show-all-amenities">
                    <button onClick={openModal}>Show all {stay.amenities.length} amenities</button>
                </div>
            )}

            {isModalOpen && (
                <div className="amenities-modal-overlay" onClick={closeModal}>
                    <div className="amenities-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title">All amenities</div>
                            <button className="modal-close" onClick={closeModal}>x</button>
                        </div>
                        <div className="modal-content">
                            <div className="amenities-grid">
                                {stay.amenities.map((amenity, idx) => (
                                    <div className="amenity-row" key={idx}>
                                        <img src={getAmenityIcon(amenity)} alt="" width={24} />
                                        <div className="amenity-name">{amenity}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}