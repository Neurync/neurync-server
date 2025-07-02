import type { Danger } from '@prisma/client'

export default interface IDangerRepository {
  getByUserId: (userId: string) => Promise<Partial<Danger>[]>
  createDangers: (userId: string, helps: string[]) => Promise<void>
  editDanger: (id: string, about: string) => Promise<void>
  deleteDanger: (id: string) => Promise<void>
}
