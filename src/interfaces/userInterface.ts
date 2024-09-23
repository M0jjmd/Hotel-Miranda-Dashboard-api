export interface UserInterface {
    username: string
    FullName: string
    password?: string
    Email: string
    Photo: string
    EntryDate: Date
    PositionDescription: string
    Phone: string
    State: string
    position: string
}

export interface JwtPayload {
    username: string
}