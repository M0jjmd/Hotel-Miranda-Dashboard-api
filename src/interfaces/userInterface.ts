export interface UserInterface {
    id?: number
    username: string
    fullname: string
    password: string
    email: string
    photo?: string
    entry_date: Date | string
    position_description: string
    phone: string
    state: 'active' | 'inactive'
    position: string
}

export interface JwtPayload {
    username: string
}

export interface LoginInterface {
    username: string
    password: string
}