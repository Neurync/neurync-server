import type { NonverbalMessage, NonverbalMessageType } from '@prisma/client'
import { HttpBadRequestError } from '../errors/BadRequest'
import { HttpNotFoundError } from '../errors/NotFound'
import type INonverbalMessageRepository from '../repositories/interfaces/INonverbalMessageRepository'

export class NonverbalMessagesServices {
  private nonverbalMessageRepository: INonverbalMessageRepository

  constructor(nonverbalMessageRepository: INonverbalMessageRepository) {
    this.nonverbalMessageRepository = nonverbalMessageRepository
  }

  async getByUserId(userId: string): Promise<Partial<NonverbalMessage>[]> {
    const messages = await this.nonverbalMessageRepository.getByUserId(userId)
    if (!messages || messages.length === 0)
      throw new HttpNotFoundError(
        `No nonverbal messages found for userId=${userId}`
      )
    return messages
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
}
