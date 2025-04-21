import type { AlertMessage } from '@prisma/client'
import { prisma } from '../../libs/prisma'
import type IAlertMessageRepository from '../interfaces/IAlertMessageRepository'

export class PrismaAlertMessageRepository implements IAlertMessageRepository {
  async getByUserId(userId: string): Promise<Partial<AlertMessage>[]> {
    return await prisma.alertMessage.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        content: true,
        is_favorited: true,
      },
    })
  }

  async createAlertMessage(userId: string, content: string): Promise<void> {
    await prisma.alertMessage.create({
      data: {
        userId,
        content,
      },
    })
  }

  async editContent(id: string, content: string): Promise<void> {
    await prisma.alertMessage.update({
      where: {
        id,
      },
      data: {
        content,
      },
    })
  }

  async favoriteAlertMessage(id: string): Promise<void> {
    await prisma.alertMessage.update({
      where: {
        id,
      },
      data: {
        is_favorited: true,
      },
    })
  }

  async unfavoriteAlertMessage(id: string): Promise<void> {
    await prisma.alertMessage.update({
      where: {
        id,
      },
      data: {
        is_favorited: false,
      },
    })
  }

  async deleteAlertMessage(id: string): Promise<void> {
    await prisma.alertMessage.delete({
      where: {
        id,
      },
    })
  }
}
