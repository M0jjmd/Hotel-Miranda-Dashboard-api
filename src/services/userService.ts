import dataUsers from '../../apiData.json'
import { UserInterface } from '../interfaces/userInterface'

const users: UserInterface[] = dataUsers.users

export class UserService {
    getAll(): UserInterface[] {
        return users
    }

    getById(id: string): UserInterface | null {
        const user = users.find((userData: UserInterface) => userData.id === id);
        return user || null;
    }

    create(newUser: UserInterface): UserInterface {
        users.push(newUser);
        return newUser;
    }

    update(id: string, updatedUser: UserInterface): UserInterface | null {
        const userIndex = users.findIndex((user) => user.id === id);
        if (userIndex !== -1) {
            users[userIndex] = updatedUser
            return users[userIndex];
        }
        return null;
    }

    delete(id: string): boolean {
        const userIndex = users.findIndex((user) => user.id === id);
        if (userIndex !== -1) {
            users.splice(userIndex, 1)
            return true;
        }
        return false;
    }
}