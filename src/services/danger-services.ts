import type IDangerRepository from '../repositories/interfaces/IDangerRepository'

export class DangerServices {
  private dangerRepository: IDangerRepository

  constructor(dangerRepository: IDangerRepository) {
    this.dangerRepository = dangerRepository
  }

  async getByUserId(userId: string) {
    return await this.dangerRepository.getByUserId(userId)
  }

  async createDangers(userId: string, dangers: string[]) {
    await this.dangerRepository.createDangers(userId, dangers)
  }

  async editDanger(id: string, about: string) {
    await this.dangerRepository.editDanger(id, about)
  }

  async deleteDanger(id: string) {
    await this.dangerRepository.deleteDanger(id)
  }
}
