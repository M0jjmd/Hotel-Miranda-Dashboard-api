export interface ContactInterface {
    date: Date
    customer: {
        userId?: string
        name: string
        email: string
        phone: string
    };
    subject: string
    comment: string
    actions: {
        archive: boolean
    }
}

export interface UpdateArchiveStatusPayload {
    id: string
    archiveStatus: boolean
}