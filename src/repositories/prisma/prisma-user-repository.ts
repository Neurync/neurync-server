import { prisma } from '../../libs/prisma'
import type IUserRepository from '../interfaces/IUserRepository'

export class PrismaUserRepository implements IUserRepository {
  async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: {
        id,
      },
    })
  }

  async getUserByIdWithHelpsAndDangers(id: string) {
    return await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        Dangers: true,
        Helps: true,
      },
    })
  }

  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    })
  }

  async createUser(
    name: string,
    email: string,
    password: string,
    about?: string,
    neurodivergence?: string
  ) {
    const { id } = await prisma.user.create({
      data: {
        name,
        email,
        password,
        about,
        neurodivergence,
      },
    })

    return id
  }

  async updateUserById(
    id: string, 
    name: string, 
    about: string | null, 
    email: string, 
    password: string, 
    neurodivergence: string | null
  ) {
    await prisma.user.update({
      data: {
        name,
        email,
        password,
        about,
        neurodivergence
      },
      where: {
        id,
      },
    })
  }

  async deleteUserById(id: string) {
    await prisma.user.delete({
      where: { id },
    })
  }
}
