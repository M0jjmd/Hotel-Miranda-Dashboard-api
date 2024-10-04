export interface RoomInterface {
    id?: number
    photo: string
    room_number: number
    bed_type: 'Single' | 'Double' | 'Queen' | 'King'
    rate: number
    offer_price: number
    status: 'available' | 'booked'
    facilities?: Facility[]
}

export interface Facility {
    id: number
    facility_name: string
}

export interface RoomFacilityInterface {
    room_id: number
    facility_id: number
}