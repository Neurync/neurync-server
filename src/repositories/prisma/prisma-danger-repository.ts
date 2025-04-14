import { prisma } from '../../libs/prisma'
import type IDangerRepository from '../interfaces/IDangerRepository'

export class PrismaDangerRepository implements IDangerRepository {
  async getByUserId(userId: string) {
    return await prisma.danger.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        about: true,
      },
    })
  }

  async createDanger(userId: string, about: string) {
    await prisma.danger.create({
      data: {
        userId,
        about,
      },
    })
  }

  async editDanger(id: string, about: string) {
    await prisma.danger.update({
      where: {
        id,
      },
      data: {
        about,
      },
    })
  }

  async deleteDanger(id: string) {
    await prisma.danger.delete({
      where: {
        id,
      },
    })
  }
}
