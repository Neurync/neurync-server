import type { NonverbalMessage, NonverbalMessageType } from '@prisma/client'
import { HttpBadRequestError } from '../errors/BadRequest'
import { HttpNotFoundError } from '../errors/NotFound'
import { prisma } from '../libs/prisma'
import type INonverbalMessageRepository from '../repositories/interfaces/INonverbalMessageRepository'

export class NonverbalMessagesServices {
  private nonverbalMessageRepository: INonverbalMessageRepository

  constructor(nonverbalMessageRepository: INonverbalMessageRepository) {
    this.nonverbalMessageRepository = nonverbalMessageRepository
  }

  async getByUserId(userId: string): Promise<Partial<NonverbalMessage>[]> {
    const messages = await this.nonverbalMessageRepository.getByUserId(userId)

    const defaultMessages = (
      await prisma.userHasDefaultNonverbalMessage.findMany({
        where: {
          userId,
          userHas: true,
        },
        include: {
          defaultNonverbalMessage: true,
        },
      })
    ).map(msg => ({
      ...msg.defaultNonverbalMessage,
      is_favorited: msg.isFavorited,
    }))

    const response = [...messages, ...defaultMessages]
    return response
  }

  async getFeelingsMessagesByUserId(userId: string) {
    return (await this.getByUserId(userId)).filter(
      message => message.type === 'feelings'
    )
  }

  async getProblemsMessagesByUserId(userId: string) {
    return (await this.getByUserId(userId)).filter(
      message => message.type === 'problems'
    )
  }

  async getFavoritedsByUserId(userId: string) {
    const messages =
      await this.nonverbalMessageRepository.getFavoritedsByUserId(userId)

    const defaultMessages = (
      await prisma.userHasDefaultNonverbalMessage.findMany({
        where: {
          userId,
          userHas: true,
          isFavorited: true,
        },
        include: {
          defaultNonverbalMessage: true,
        },
      })
    ).map(msg => ({
      ...msg.defaultNonverbalMessage,
      is_favorited: msg.isFavorited,
    }))

    const response = [...messages, ...defaultMessages]
    return response
  }

  async createNonverbalMessage(
    userId: string,
    content: string,
    emoji_icon: string,
    type: NonverbalMessageType
  ): Promise<void> {
    if (!content.trim())
      throw new HttpBadRequestError('Content cannot be empty')

    await this.nonverbalMessageRepository.createNonverbalMessage(
      userId,
      content,
      emoji_icon,
      type
    )
  }

  async editNonverbalMessage(
    id: string,
    userId: string,
    content: string,
    emoji_icon: string,
    type: NonverbalMessageType,
    is_favorited: boolean
  ): Promise<void> {
    const exists = await this.nonverbalMessageRepository.getById(id)
    if (!exists)
      throw new HttpNotFoundError(
        `Nonverbal message with id=${id} doesn't exist`
      )

    await this.nonverbalMessageRepository.editNonverbalMessage(
      id,
      userId,
      content,
      emoji_icon,
      type,
      is_favorited
    )
  }

  async favoriteNonverbalMessage(id: string): Promise<void> {
    const exists = await this.nonverbalMessageRepository.getById(id)
    if (!exists)
      throw new HttpNotFoundError(
        `Nonverbal message with id=${id} doesn't exist`
      )

    await this.nonverbalMessageRepository.favoriteNonverbalMessage(id)
  }

  async unfavoriteNonverbalMessage(id: string): Promise<void> {
    const exists = await this.nonverbalMessageRepository.getById(id)
    if (!exists)
      throw new HttpNotFoundError(
        `Nonverbal message with id=${id} doesn't exist`
      )

    await this.nonverbalMessageRepository.unfavoriteNonverbalMessage(id)
  }

  async deleteNonverbalMessage(id: string): Promise<void> {
    const exists = await this.nonverbalMessageRepository.getById(id)
    if (!exists)
      throw new HttpNotFoundError(
        `Nonverbal message with id=${id} doesn't exist`
      )

    await this.nonverbalMessageRepository.deleteNonverbalMessage(id)
  }

  async deleteDefaultNonverbalMessage(
    id: string,
    userId: string
  ): Promise<void> {
    const relation = await prisma.userHasDefaultNonverbalMessage.findFirst({
      where: {
        userId,
        defaultNonverbalMessageId: id,
      },
    })

    if (!relation)
      throw new HttpNotFoundError(
        'Not found any default nonverbal message with that id'
      )

    await prisma.userHasDefaultNonverbalMessage.update({
      where: {
        id: relation.id,
      },
      data: {
        userHas: false,
      },
    })
  }
}
