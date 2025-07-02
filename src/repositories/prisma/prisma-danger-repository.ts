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

  async createDangers(userId: string, dangers: string[]) {
    await prisma.danger.createMany({
      data: dangers.map(danger => ({
        userId,
        about: danger,
      })),
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
