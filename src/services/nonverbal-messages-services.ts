import type { NonverbalMessage, NonverbalMessageType } from '@prisma/client'
import type INonverbalMessageRepository from '../repositories/interfaces/INonverbalMessageRepository'

export class NonverbalMessagesServices {
  private nonverbalMessageRepository: INonverbalMessageRepository

  constructor(nonverbalMessageRepository: INonverbalMessageRepository) {
    this.nonverbalMessageRepository = nonverbalMessageRepository
  }

  async getByUserId(userId: string): Promise<Partial<NonverbalMessage>[]> {
    return await this.nonverbalMessageRepository.getByUserId(userId)
  }

  async createNonverbalMessage(
    userId: string,
    content: string,
    emoji_icon: string,
    type: NonverbalMessageType
  ): Promise<void> {
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
    await this.nonverbalMessageRepository.favoriteNonverbalMessage(id)
  }

  async unfavoriteNonverbalMessage(id: string): Promise<void> {
    await this.nonverbalMessageRepository.unfavoriteNonverbalMessage(id)
  }

  async deleteNonverbalMessage(id: string): Promise<void> {
    await this.nonverbalMessageRepository.deleteNonverbalMessage(id)
  }
}
