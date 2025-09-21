import type { Danger } from '@prisma/client'

export default interface IDangerRepository {
  getById: (id: string) => Promise<Danger | null>
  getByUserId: (userId: string) => Promise<Partial<Danger>[]>
  createDangers: (userId: string, helps: string[]) => Promise<void>
  editDanger: (id: string, about: string) => Promise<void>
  deleteDangers: (ids: string[]) => Promise<void>
}
