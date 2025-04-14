import type { Help } from '@prisma/client'

export default interface IHelpRepository {
  getByUserId: (userId: string) => Promise<Partial<Help>[]>
  createHelp: (userId: string, about: string) => Promise<void>
  editHelp: (id: string, about: string) => Promise<void>
  deleteHelp: (id: string) => Promise<void>
}
