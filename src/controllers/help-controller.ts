import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import type IHelpRepository from '../repositories/interfaces/IHelpRepository'
import { HelpServices } from '../services/help-services'

export class HelpController {
  private helpServices: HelpServices

  constructor(helpRepository: IHelpRepository) {
    this.helpServices = new HelpServices(helpRepository)
  }

  async getByUserId(req: FastifyRequest) {
    const paramsSchema = z.object({
      userId: z.string().uuid(),
    })

    const { userId } = paramsSchema.parse(req.params)
    const helps = await this.helpServices.getByUserId(userId)
    return helps
  }

  async create(req: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
      about: z.string(),
    })

    const userId = req.user.id
    const { about } = bodySchema.parse(req.body)

    await this.helpServices.createHelp(userId, about)
    return reply.status(201).send({ message: 'Help created' })
  }

  async edit(req: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const bodySchema = z.object({
      about: z.string(),
    })

    const { id } = paramsSchema.parse(req.params)
    const { about } = bodySchema.parse(req.body)

    await this.helpServices.editHelp(id, about)
    return reply.status(204).send()
  }

  async delete(req: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(req.params)

    await this.helpServices.deleteHelp(id)
    return reply.status(204).send()
  }
}
