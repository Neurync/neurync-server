import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import type IDangerRepository from '../repositories/interfaces/IDangerRepository'
import { DangerServices } from '../services/danger-service'

export class DangerController {
  private dangerServices: DangerServices

  constructor(dangerRepository: IDangerRepository) {
    this.dangerServices = new DangerServices(dangerRepository)
  }

  async getByUserId(req: FastifyRequest) {
    const paramsSchema = z.object({
      userId: z.string().uuid(),
    })

    const { userId } = paramsSchema.parse(req.params)
    const dangers = await this.dangerServices.getByUserId(userId)
    return dangers
  }

  async create(req: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
      about: z.string(),
    })

    const userId = req.user.id
    const { about } = bodySchema.parse(req.body)

    await this.dangerServices.createDanger(userId, about)
    return reply.status(201).send({ message: 'Danger created' })
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

    await this.dangerServices.editDanger(id, about)
    return reply.status(204).send()
  }

  async delete(req: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(req.params)

    await this.dangerServices.deleteDanger(id)
    return reply.status(204).send()
  }
}
