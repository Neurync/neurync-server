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

  async deleteHelp(id: string) {
    const exists = await this.helpRepository.getById(id)
    if (!exists) throw new HttpNotFoundError(`Help with id=${id} doesn't exist`)

    await this.helpRepository.deleteHelp(id)
  }
}
