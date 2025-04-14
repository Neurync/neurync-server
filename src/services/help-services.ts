import type IHelpRepository from '../repositories/interfaces/IHelpRepository'

export class HelpServices {
  private helpRepository: IHelpRepository

  constructor(helpRepository: IHelpRepository) {
    this.helpRepository = helpRepository
  }

  async getByUserId(userId: string) {
    await this.helpRepository.getByUserId(userId)
  }

  async createHelp(userId: string, about: string) {
    await this.helpRepository.createHelp(userId, about)
  }

  async editHelp(id: string, about: string) {
    await this.helpRepository.editHelp(id, about)
  }

  async deleteHelp(id: string) {
    await this.helpRepository.deleteHelp(id)
  }
}
