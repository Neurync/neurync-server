import type { Danger, Help, User } from '@prisma/client'

type UserWithHelpsAndDangers = User & { Dangers: Danger[]; Helps: Help[] }

export default interface IUserRepository {
  getUserById: (id: string) => Promise<User | null>
  getUserByIdWithHelpsAndDangers: (
    id: string
  ) => Promise<UserWithHelpsAndDangers | null>
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
