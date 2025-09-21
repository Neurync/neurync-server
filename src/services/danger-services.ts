import type { Danger } from '@prisma/client'
import { HttpBadRequestError } from '../errors/BadRequest'
import { HttpNotFoundError } from '../errors/NotFound'
import type IDangerRepository from '../repositories/interfaces/IDangerRepository'

export class DangerServices {
  private dangerRepository: IDangerRepository

  constructor(dangerRepository: IDangerRepository) {
    this.dangerRepository = dangerRepository
  }

  async getByUserId(userId: string) {
    const dangers = await this.dangerRepository.getByUserId(userId)
    if (!dangers || dangers.length === 0)
      throw new HttpNotFoundError(`No dangers found for userId=${userId}`)
    return dangers
  }

  async createDangers(userId: string, dangers: string[]) {
    if (!dangers.length)
      throw new HttpBadRequestError('At least one danger must be provided')
    await this.dangerRepository.createDangers(userId, dangers)
  }

  async editDanger(id: string, about: string) {
    if (!about.trim())
      throw new HttpBadRequestError('Danger description cannot be empty')

    const existing = await this.dangerRepository.getById(id)
    if (!existing)
      throw new HttpNotFoundError(`Danger with id=${id} doesn't exist`)

    await this.dangerRepository.editDanger(id, about)
  }

  async editManyDangers(helps: Danger[]) {
    await Promise.all(
      helps.map(async help => {
        this.editDanger(help.id, help.about)
      })
    )
  }

  async deleteDangers(ids: string[]) {
    if (!ids || ids.length === 0) {
      throw new HttpBadRequestError('At least one danger ID must be provided')
    }

    const existingDangers = await Promise.all(
      ids.map(id => this.dangerRepository.getById(id))
    )

    const nonExistingIds = ids.filter((id, index) => !existingDangers[index])
    if (nonExistingIds.length > 0) {
      throw new HttpNotFoundError(
        `The following danger IDs do not exist: ${nonExistingIds.join(', ')}`
      )
    }

    await this.dangerRepository.deleteDangers(ids)
  }
}
