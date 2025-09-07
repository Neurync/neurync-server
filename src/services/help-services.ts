import type { Help } from '@prisma/client'
import { HttpBadRequestError } from '../errors/BadRequest'
import { HttpNotFoundError } from '../errors/NotFound'
import type IHelpRepository from '../repositories/interfaces/IHelpRepository'

export class HelpServices {
  private helpRepository: IHelpRepository

  constructor(helpRepository: IHelpRepository) {
    this.helpRepository = helpRepository
  }

  async getByUserId(userId: string) {
    const helps = await this.helpRepository.getByUserId(userId)
    if (!helps || helps.length === 0)
      throw new HttpNotFoundError(`No helps found for userId=${userId}`)
    return helps
  }

  async createHelps(userId: string, helps: string[]) {
    if (!helps.length)
      throw new HttpBadRequestError('At least one help must be provided')
    await this.helpRepository.createHelps(userId, helps)
  }

  async editHelp(id: string, about: string) {
    if (!about.trim())
      throw new HttpBadRequestError('Help description cannot be empty')

    const existing = await this.helpRepository.getById(id)
    if (!existing)
      throw new HttpNotFoundError(`Help with id=${id} doesn't exist`)

    await this.helpRepository.editHelp(id, about)
  }

  async editManyHelps(helps: Help[]) {
    await Promise.all(
      helps.map(async help => {
        this.editHelp(help.id, help.about)
      })
    )
  }

  async deleteHelps(ids: string[]) {
    if (!ids || ids.length === 0) {
      throw new HttpBadRequestError('At least one help ID must be provided')
    }

    const existingHelps = await Promise.all(
      ids.map(id => this.helpRepository.getById(id))
    )

    const nonExistingIds = ids.filter((id, index) => !existingHelps[index])
    if (nonExistingIds.length > 0) {
      throw new HttpNotFoundError(
        `The following help IDs do not exist: ${nonExistingIds.join(', ')}`
      )
    }

    await this.helpRepository.deleteHelps(ids)
  }
}
