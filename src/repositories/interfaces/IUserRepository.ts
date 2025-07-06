import type { User } from '@prisma/client'

export default interface IUserRepository {
  getUserById: (id: string) => Promise<User | null>
  getUserByEmail: (email: string) => Promise<User | null>
  createUser: (
    name: string,
    email: string,
    password: string,
    about?: string,
    neurodivergence?: string
  ) => Promise<string>
  updateUserById: (
    id: string,
    name: string,
    about: string,
    email: string,
    password: string,
    neurodivergence: string
  ) => Promise<void>
  updateAbout: (id: string, about: string) => Promise<void>
  updateNeurodivergence: (id: string, neurodivergence: string) => Promise<void>
  deleteUserById: (id: string) => Promise<void>
}
