import { HttpBadRequestError } from '../errors/BadRequest'
import { HttpNotFoundError } from '../errors/NotFound'
import type IAlertMessageRepository from '../repositories/interfaces/IAlertMessageRepository'

export class AlertMessageServices {
  private alertMessageRepository: IAlertMessageRepository

  constructor(alertMessageRepository: IAlertMessageRepository) {
    this.alertMessageRepository = alertMessageRepository
  }

  async getByUserId(userId: string) {
    const messages = await this.alertMessageRepository.getByUserId(userId)
    if (!messages || messages.length === 0)
      throw new HttpNotFoundError(
        `No alert messages found for userId=${userId}`
      )
    return messages
  }

  async createAlertMessage(userId: string, content: string) {
    if (!content.trim())
      throw new HttpBadRequestError('Content cannot be empty')
    await this.alertMessageRepository.createAlertMessage(userId, content)
  }

  async editContent(id: string, content: string) {
    const existing = await this.alertMessageRepository.getById(id)
    if (!existing)
      throw new HttpNotFoundError(`Alert message with id=${id} doesn't exist`)

    await this.alertMessageRepository.editContent(id, content)
  }

  async favoriteAlertMessage(id: string) {
    const exists = await this.alertMessageRepository.getById(id)
    if (!exists)
      throw new HttpNotFoundError(`Alert message with id=${id} doesn't exist`)

    await this.alertMessageRepository.favoriteAlertMessage(id)
  }

  async unfavoriteAlertMessage(id: string) {
    const exists = await this.alertMessageRepository.getById(id)
    if (!exists)
      throw new HttpNotFoundError(`Alert message with id=${id} doesn't exist`)

    await this.alertMessageRepository.unfavoriteAlertMessage(id)
  }

  async deleteAlertMessage(id: string) {
    const exists = await this.alertMessageRepository.getById(id)
    if (!exists)
      throw new HttpNotFoundError(`Alert message with id=${id} doesn't exist`)

    await this.alertMessageRepository.deleteAlertMessage(id)
  }
}
