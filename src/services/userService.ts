import dataUsers from '../../apiData.json'
import { UserInterface } from '../interfaces/userInterface'

const users: UserInterface[] = dataUsers.users

export class UserService {
    getAll(): UserInterface[] {
        return users
    }

    getById(id: string): UserInterface {
        const user = users.find((userData: UserInterface) => userData.id === id)
        if (!user) {
            throw new Error(`User with id: ${id} not found`)
        }
        return user
    }

    create(newUser: UserInterface): UserInterface {
        users.push(newUser)
        return newUser
    }

    update(id: string, updatedUser: UserInterface): UserInterface {
        const userIndex = users.findIndex((user) => user.id === id)
        if (userIndex !== -1) {
            users[userIndex] = updatedUser
            return users[userIndex]
        }
        return users[userIndex]
    }

    delete(id: string): boolean {
        const userIndex = users.findIndex((user) => user.id === id)
        if (userIndex === -1) {
            return false
        }
        users.splice(userIndex, 1)
        return true
    }
}