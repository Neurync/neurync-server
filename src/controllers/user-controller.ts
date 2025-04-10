import type { SignOptions, SignPayloadType } from '@fastify/jwt'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import type IUserRepository from '../repositories/interfaces/IUserRepository'
import { UserServices } from '../services/user-services'

export class UserController {
  private userServices: UserServices

  constructor(userRepository: IUserRepository) {
    this.userServices = new UserServices(userRepository)
  }

  async getById(req: FastifyRequest) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(req.params)
    const user = await this.userServices.getById(id)
    return user
  }
  async register(req: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
    })

    const { name, email, password } = bodySchema.parse(req.body)
    await this.userServices.createUser(name, email, password)
    return reply.status(201).send({ message: 'User created' })
  }

  async login(
    req: FastifyRequest,
    reply: FastifyReply,
    jwtCallback: (
      payload: SignPayloadType,
      options?: Partial<SignOptions>
    ) => string
  ) {
    const bodySchema = z.object({
      email: z.string(),
      password: z.string(),
    })

    const { email, password } = bodySchema.parse(req.body)
    const userId = await this.userServices.findUserToCreateJWT(email, password)

    if (!userId) {
      return reply.status(401).send({ message: 'Invalid Credentials' })
    }

    const token = jwtCallback({
      id: userId,
      email,
      password,
    })

    return reply.status(200).send({ token })
  }

  async editUser(req: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string(),
      about: z.string(),
      password: z.string(),
      neurodivergence: z.string(),
    })

    const { name, email, about, password, neurodivergence } = bodySchema.parse(
      req.body
    )
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params)
    await this.userServices.updateUser(
      id,
      name,
      about,
      email,
      password,
      neurodivergence
    )
    return reply.status(204).send()
  }

  async editAbout(req: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
      about: z.string(),
    })

    const { id } = req.user
    const { about } = bodySchema.parse(req.body)

    await this.userServices.updateAbout(id, about)

    return reply.status(204).send()
  }

  async editNeurodivergence(req: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
      neurodivergence: z.string(),
    })

    const { id } = req.user
    const { neurodivergence } = bodySchema.parse(req.body)

    await this.userServices.updateNeurodivergence(id, neurodivergence)

    return reply.status(204).send()
  }

  async deleteUser(req: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(req.params)
    await this.userServices.deleteUser(id)
    return reply.status(204).send()
  }
}
