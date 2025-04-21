import type IAlertMessageRepository from '../repositories/interfaces/IAlertMessageRepository'

export class AlertMessageServices {
  private alertMessageRepository: IAlertMessageRepository

  constructor(alertMessageRepository: IAlertMessageRepository) {
    this.alertMessageRepository = alertMessageRepository
  }

  async getByUserId(userId: string) {
    return await this.alertMessageRepository.getByUserId(userId)
  }

  async createAlertMessage(userId: string, content: string) {
    await this.alertMessageRepository.createAlertMessage(userId, content)
  }

  async editContent(id: string, content: string) {
    await this.alertMessageRepository.editContent(id, content)
  }

  async favoriteAlertMessage(id: string) {
    await this.alertMessageRepository.favoriteAlertMessage(id)
  }

  async unfavoriteAlertMessage(id: string) {
    await this.alertMessageRepository.unfavoriteAlertMessage(id)
  }

  async deleteAlertMessage(id: string) {
    await this.alertMessageRepository.deleteAlertMessage(id)
  }
}
