import { NonverbalMessageType } from '@prisma/client'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import type INonverbalMessageRepository from '../repositories/interfaces/INonverbalMessageRepository'
import { NonverbalMessagesServices } from '../services/nonverbal-messages-services'

export class NonverbalMessageController {
  private nonverbalMessageServices: NonverbalMessagesServices

  constructor(nonverbalMessageRepository: INonverbalMessageRepository) {
    this.nonverbalMessageServices = new NonverbalMessagesServices(
      nonverbalMessageRepository
    )
  }

  async getByUserId(req: FastifyRequest, reply: FastifyReply) {
    const userId = req.user.id
    const messages = await this.nonverbalMessageServices.getByUserId(userId)
    return reply.status(200).send(messages)
  }

  async getFavoritedsByUserId(req: FastifyRequest, reply: FastifyReply) {
    const userId = req.user.id
    const messages =
      await this.nonverbalMessageServices.getFavoritedsByUserId(userId)
    return reply.status(200).send(messages)
  }

  async create(req: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
      content: z.string(),
      emoji_icon: z.string(),
      type: z.nativeEnum(NonverbalMessageType),
    })

    const userId = req.user.id
    const { content, emoji_icon, type } = bodySchema.parse(req.body)

    await this.nonverbalMessageServices.createNonverbalMessage(
      userId,
      content,
      emoji_icon,
      type
    )
    return reply.status(201).send({ message: 'Nonverbal Message created' })
  }

  async edit(req: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const bodySchema = z.object({
      content: z.string(),
      emoji_icon: z.string(),
      type: z.nativeEnum(NonverbalMessageType),
      is_favorited: z.boolean(),
    })

    const { id } = paramsSchema.parse(req.params)
    const { content, emoji_icon, type, is_favorited } = bodySchema.parse(
      req.body
    )
    const userId = req.user.id

    await this.nonverbalMessageServices.editNonverbalMessage(
      id,
      userId,
      content,
      emoji_icon,
      type,
      is_favorited
    )
    return reply.status(204).send()
  }

  async favorite(req: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(req.params)

    await this.nonverbalMessageServices.favoriteNonverbalMessage(id)
    return reply.status(204).send()
  }

  async unfavorite(req: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(req.params)

    await this.nonverbalMessageServices.unfavoriteNonverbalMessage(id)
    return reply.status(204).send()
  }

  async delete(req: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(req.params)

    await this.nonverbalMessageServices.deleteNonverbalMessage(id)
    return reply.status(204).send()
  }
}
