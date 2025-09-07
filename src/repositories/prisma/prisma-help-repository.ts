import { prisma } from '../../libs/prisma'
import type IHelpRepository from '../interfaces/IHelpRepository'

export class PrismaHelpRepository implements IHelpRepository {
  async getById(id: string) {
    return await prisma.help.findUnique({ where: { id } })
  }

  async getByUserId(userId: string) {
    return await prisma.help.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        about: true,
      },
    })
  }

  async createHelps(userId: string, helps: string[]) {
    await prisma.help.createMany({
      data: helps.map(help => ({
        userId,
        about: help,
      })),
    })
  }

  async editHelp(id: string, about: string) {
    await prisma.help.update({
      where: {
        id,
      },
      data: {
        about,
      },
    })
  }

  async deleteHelps(ids: string[]) {
    await prisma.help.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    })
  }
}
