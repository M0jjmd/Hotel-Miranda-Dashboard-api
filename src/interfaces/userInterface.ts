export interface UserInterface {
    username: string
    FullName: string
    password?: string
    Email: string
    Photo: string
    EntryDate: string
    PositionDescription: string
    Phone: string
    State: string
    position: string
}

export interface JwtPayload {
    username: string
}