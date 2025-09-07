import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { HelpController } from '../controllers/help-controller'
import { PrismaHelpRepository } from '../repositories/prisma/prisma-help-repository'

export class HelpRouter {
  private helpController: HelpController

  constructor() {
    this.helpController = new HelpController(new PrismaHelpRepository())
  }

  routes = async (app: FastifyInstance) => {
    app.get(
      '/:userId',
      {
        schema: {
          tags: ['helps'],
          description:
            'Retorna todas as formas de ajua de crise de um usuário, através de seu ID',
          summary: "Retorna os 'helps' de um usuário",
          operationId: 'getUserHelps',
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
        return await this.helpController.getByUserId(req)
      }
    )

    app.post(
      '/',
      {
        schema: {
          tags: ['helps'],
          description: 'Cria ajudas de crise do usuário. Requer autenticação',
          summary: "Criar 'helps' de um usuário",
          operationId: 'createManyUserHelp',
          body: z.object({
            userId: z.string().uuid(),
            helps: z.array(z.string()).min(1),
          }),
          response: {
            201: z.object({
              message: z.literal('Helps created'),
            }),
          },
        },
        preHandler: [app.authenticate],
      },
      async (req, reply) => {
        await this.helpController.createMany(req, reply)
      }
    )

    app.put(
      '/:id',
      {
        schema: {
          tags: ['helps'],
          description:
            'Edita uma ajuda de crise do usuário. Requer autenticação',
          summary: "Edita um 'help' de um usuário",
          operationId: 'editUserHelp',
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
        await this.helpController.edit(req, reply)
      }
    )

    app.put(
      '/edit-many',
      {
        schema: {
          tags: ['helps'],
          description:
            'Edita confortos de crise do usuário. Requer autenticação',
          summary: "Edita 'helps' de um usuário",
          operationId: 'editManyUserHelp',
          body: z.object({
            helps: z.array(
              z.object({
                id: z.string().uuid(),
                about: z.string().min(1),
                userId: z.string().uuid(),
              })
            ),
          }),
          response: {
            204: z.void(),
          },
        },
        preHandler: [app.authenticate],
      },
      async (req, reply) => {
        await this.helpController.editMany(req, reply)
      }
    )

    app.post(
      '/delete',
      {
        schema: {
          tags: ['helps'],
          description:
            'Deleta várias ajudas de crise do usuário. Requer autenticação',
          summary: "Deleta vários 'helps' de um usuário",
          operationId: 'deleteUserHelps',
          body: z.object({
            helps: z.array(z.string().uuid()),
          }),
          response: {
            204: z.void(),
          },
        },
        preHandler: [app.authenticate],
      },
      async (req, reply) => {
        await this.helpController.delete(req, reply)
      }
    )

    // app.delete(
    //   '/:id',
    //   {
    //     schema: {
    //       tags: ['helps'],
    //       description:
    //         'Deleta uma ajuda de crise do usuário. Requer autenticação',
    //       summary: "Deleta um 'help' de um usuário",
    //       operationId: 'deleteUserHelp',
    //       params: z.object({
    //         id: z.string().uuid(),
    //       }),
    //       response: {
    //         204: z.void(),
    //       },
    //     },
    //     preHandler: [app.authenticate],
    //   },
    //   async (req, reply) => {
    //     await this.helpController.delete(req, reply)
    //   }
    // )
  }
}
