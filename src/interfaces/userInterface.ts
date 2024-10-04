export interface UserInterface {
    _id?: string
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

export interface LoginInterface {
    username: string
    password: string
}