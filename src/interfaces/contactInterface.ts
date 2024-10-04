export interface ContactInterface {
    id?: number
    date: Date | string
    subject: string
    comment: string
    archive: boolean
}

export interface UpdateArchiveStatusPayload {
    id: string
    archiveStatus: boolean
}