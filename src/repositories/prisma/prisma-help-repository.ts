import { prisma } from '../../libs/prisma'
import type IHelpRepository from '../interfaces/IHelpRepository'

export class PrismaHelpRepository implements IHelpRepository {
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

  async createHelp(userId: string, about: string) {
    await prisma.help.create({
      data: {
        userId,
        about,
      },
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

  async deleteHelp(id: string) {
    await prisma.help.delete({
      where: {
        id,
      },
    })
  }
}
