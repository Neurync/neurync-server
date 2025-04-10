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

  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    })
  }

  async createUser(name: string, email: string, password: string) {
    await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    })
  }

  async updateUserById(
    id: string,
    name: string,
    email: string,
    password: string
  ) {
    await prisma.user.update({
      data: {
        name,
        email,
        password,
      },
      where: {
        id,
      },
    })
  }

  async updateAbout(id: string, about: string) {
    await prisma.user.update({
      data: {
        about,
      },
      where: {
        id,
      },
    })
  }

  async updateNeurodivergence(id: string, neurodivergence: string) {
    await prisma.user.update({
      data: {
        neurodivergence,
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
