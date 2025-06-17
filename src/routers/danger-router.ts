import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { DangerController } from '../controllers/danger-controller'
import { PrismaDangerRepository } from '../repositories/prisma/prisma-danger-repository'

export class DangerRouter {
  private dangerController: DangerController

  constructor() {
    this.dangerController = new DangerController(new PrismaDangerRepository())
  }

  routes = async (app: FastifyInstance) => {
    app.get(
      '/:userId',
      {
        schema: {
          tags: ['dangers'],
          description:
            'Retorna todos os gatilhos de crise de um usuário, através de seu ID',
          summary: "Retorna os 'dangers' de um usuário",
          operationId: 'getUserDangers',
          params: z.object({
            userId: z.string().uuid(),
          }),
          response: {
            200: z.array(
              z.object({
                id: z.string().uuid(),
                about: z.string(),
              })
            ),
          },
        },
      },
      async (req, reply) => {
        return await this.dangerController.getByUserId(req)
      }
    )

    app.post(
      '/',
      {
        schema: {
          tags: ['dangers'],
          description:
            'Cria um gatilho de crise do usuário. Requer autenticação',
          summary: "Criar um 'danger' de um usuário",
          operationId: 'createUserDanger',
          body: z.object({
            userId: z.string().uuid(),
            about: z.string(),
          }),
          response: {
            201: z.object({
              message: z.literal('Danger created'),
            }),
          },
        },
        preHandler: [app.authenticate],
      },
      async (req, reply) => {
        await this.dangerController.create(req, reply)
      }
    )

    app.put(
      '/:id',
      {
        schema: {
          tags: ['dangers'],
          description:
            'Edita um gatilho de crise do usuário. Requer autenticação',
          summary: "Edita um 'danger' de um usuário",
          operationId: 'editUserDanger',
          params: z.object({
            id: z.string().uuid(),
          }),
          body: z.object({
            about: z.string(),
          }),
          response: {
            204: z.void(),
          },
        },
        preHandler: [app.authenticate],
      },
      async (req, reply) => {
        await this.dangerController.edit(req, reply)
      }
    )

    app.delete(
      '/:id',
      {
        schema: {
          tags: ['dangers'],
          description:
            'Deleta um gatilho de crise do usuário. Requer autenticação',
          summary: "Deleta um 'danger' de um usuário",
          operationId: 'deleteUserDanger',
          params: z.object({
            id: z.string().uuid(),
          }),
          response: {
            204: z.void(),
          },
        },
        preHandler: [app.authenticate],
      },
      async (req, reply) => {
        await this.dangerController.delete(req, reply)
      }
    )
  }
}
