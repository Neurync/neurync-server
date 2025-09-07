import type { Help } from '@prisma/client'

export default interface IHelpRepository {
  getById: (id: string) => Promise<Help | null>
  getByUserId: (userId: string) => Promise<Partial<Help>[]>
  createHelps: (userId: string, helps: string[]) => Promise<void>
  editHelp: (id: string, about: string) => Promise<void>
  deleteHelps: (ids: string[]) => Promise<void>
}
