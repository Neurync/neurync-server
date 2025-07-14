import type { AlertMessage } from '@prisma/client'

export default interface IAlertMessageRepository {
  getById: (id: string) => Promise<AlertMessage | null>
  getByUserId: (userId: string) => Promise<Partial<AlertMessage>[]>
  createAlertMessage: (userId: string, content: string) => Promise<void>
  editContent: (id: string, content: string) => Promise<void>
  favoriteAlertMessage: (id: string) => Promise<void>
  unfavoriteAlertMessage: (id: string) => Promise<void>
  deleteAlertMessage: (id: string) => Promise<void>
}
