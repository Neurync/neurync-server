import type { NonverbalMessage, NonverbalMessageType } from '@prisma/client'

export default interface INonverbalMessageRepository {
  getById: (id: string) => Promise<NonverbalMessage | null>
  getByUserId: (userId: string) => Promise<Partial<NonverbalMessage>[]>
  createNonverbalMessage: (
    userId: string,
    content: string,
    emoji_icon: string,
    type: NonverbalMessageType
  ) => Promise<void>
  editNonverbalMessage: (
    id: string,
    userId: string,
    content: string,
    emoji_icon: string,
    type: NonverbalMessageType,
    is_favorited: boolean
  ) => Promise<void>
  favoriteNonverbalMessage: (id: string) => Promise<void>
  unfavoriteNonverbalMessage: (id: string) => Promise<void>
  deleteNonverbalMessage: (id: string) => Promise<void>
}
