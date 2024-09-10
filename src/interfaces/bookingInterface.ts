export interface BookingInterface {
    Guest: Guest
    OrderDate: string
    CheckIn: string
    CheckOut: string
    SpecialRequest: string
    RoomType: RoomType
    Status: string
    id: string
}

export interface Guest {
    Name: string
    ReservationID: string
}

export interface RoomType {
    Type: string
    RoomNumber: string
}