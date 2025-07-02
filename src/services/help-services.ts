import type IHelpRepository from '../repositories/interfaces/IHelpRepository'

export class HelpServices {
  private helpRepository: IHelpRepository

  constructor(helpRepository: IHelpRepository) {
    this.helpRepository = helpRepository
  }

  async getByUserId(userId: string) {
    return await this.helpRepository.getByUserId(userId)
  }

  async createHelps(userId: string, helps: string[]) {
    await this.helpRepository.createHelps(userId, helps)
  }

  async editHelp(id: string, about: string) {
    await this.helpRepository.editHelp(id, about)
  }

  async deleteHelp(id: string) {
    await this.helpRepository.deleteHelp(id)
  }
}
