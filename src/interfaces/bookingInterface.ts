export interface BookingInterface {
    _id?: string
    Guest: Guest
    OrderDate: Date
    CheckIn: Date
    CheckOut: Date
    SpecialRequest: string
    RoomType: RoomType
    Status: string
}

export interface Guest {
    UserId: string
    RoomId: string
}

export interface RoomType {
    Type: string
    RoomNumber: string
}