import { Schema, Document, model, models } from 'mongoose'
import { UserInterface } from '../interfaces/userInterface'

export interface UserDocument extends Document, UserInterface { }

const UserSchema: Schema<UserDocument> = new Schema({
    username: { type: String, required: true },
    FullName: { type: String, required: true },
    password: { type: String },
    Email: { type: String, required: true, unique: true },
    Photo: { type: String, required: true },
    EntryDate: { type: Date, required: true },
    PositionDescription: { type: String, required: true },
    Phone: { type: String, required: true },
    State: { type: String, required: true },
    position: { type: String, required: true },
})

const User = models.User || model<UserDocument>('User', UserSchema)
export default User