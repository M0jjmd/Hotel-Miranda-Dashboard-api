export interface BookingInterface {
    id?: number
    room_id: number
    order_date: Date | string
    check_in: Date | string
    check_out: Date | string
    special_request?: string
    room_type: 'Single' | 'Double' | 'Suite'
    status: 'checked-in' | 'checked-out' | 'in-progress'
}