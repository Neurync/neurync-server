import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import type IAlertMessageRepository from '../repositories/interfaces/IAlertMessageRepository'
import { AlertMessageServices } from '../services/alert-messages-services'

export class AlertMessageController {
  private alertMessageServices: AlertMessageServices

  constructor(alertMessageRepository: IAlertMessageRepository) {
    this.alertMessageServices = new AlertMessageServices(alertMessageRepository)
  }

  async getByUserId(req: FastifyRequest) {
    const userId = req.user.id
    const alertMessages = await this.alertMessageServices.getByUserId(userId)
    return alertMessages
  }

  async create(req: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
      content: z.string(),
    })

    const userId = req.user.id
    const { content } = bodySchema.parse(req.body)

    await this.alertMessageServices.createAlertMessage(userId, content)

    return reply.status(201).send({ message: 'Alert Message created' })
  }

  async editContent(req: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const bodySchema = z.object({
      content: z.string(),
    })

    const { id } = paramsSchema.parse(req.params)
    const { content } = bodySchema.parse(req.body)

    await this.alertMessageServices.editContent(id, content)

    return reply.status(204).send()
  }

  async favorite(req: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(req.params)
    await this.alertMessageServices.favoriteAlertMessage(id)
    return reply.status(204).send()
  }

  async unfavorite(req: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(req.params)
    await this.alertMessageServices.unfavoriteAlertMessage(id)
    return reply.status(204).send()
  }

  async delete(req: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(req.params)
    await this.alertMessageServices.deleteAlertMessage(id)
    return reply.status(204).send()
  }
}
