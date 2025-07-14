import type { NonverbalMessage, NonverbalMessageType } from '@prisma/client'
import { prisma } from '../../libs/prisma'
import type INonverbalMessageRepository from '../interfaces/INonverbalMessageRepository'

export class PrismaNonverbalMessageRepository
  implements INonverbalMessageRepository
{
  async getById(id: string): Promise<NonverbalMessage | null> {
    return await prisma.nonverbalMessage.findUnique({ where: { id } })
  }

  async getByUserId(userId: string): Promise<Partial<NonverbalMessage>[]> {
    return await prisma.nonverbalMessage.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        content: true,
        emoji_icon: true,
        type: true,
        is_favorited: true,
      },
    })
  }

  async createNonverbalMessage(
    userId: string,
    content: string,
    emoji_icon: string,
    type: NonverbalMessageType
  ): Promise<void> {
    await prisma.nonverbalMessage.create({
      data: {
        userId,
        content,
        emoji_icon,
        type,
      },
    })
  }

  async editNonverbalMessage(
    id: string,
    userId: string,
    content: string,
    emoji_icon: string,
    type: NonverbalMessageType,
    is_favorited: boolean
  ): Promise<void> {
    await prisma.nonverbalMessage.update({
      where: {
        id,
      },
      data: {
        userId,
        content,
        emoji_icon,
        type,
        is_favorited,
      },
    })
  }

  async favoriteNonverbalMessage(id: string): Promise<void> {
    await prisma.nonverbalMessage.update({
      where: {
        id,
      },
      data: {
        is_favorited: true,
      },
    })
  }

  async unfavoriteNonverbalMessage(id: string): Promise<void> {
    await prisma.nonverbalMessage.update({
      where: {
        id,
      },
      data: {
        is_favorited: false,
      },
    })
  }

  async deleteNonverbalMessage(id: string): Promise<void> {
    await prisma.nonverbalMessage.delete({
      where: {
        id,
      },
    })
  }
}
