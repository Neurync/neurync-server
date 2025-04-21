import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { AlertMessageController } from '../controllers/alert-message-controller'
import { PrismaAlertMessageRepository } from '../repositories/prisma/prisma-alert-messages-repository'

export class AlertMessageRouter {
  private alertMessageController: AlertMessageController

  constructor() {
    this.alertMessageController = new AlertMessageController(
      new PrismaAlertMessageRepository()
    )
  }

  routes = async (app: FastifyInstance) => {
    app.get(
      '/',
      {
        schema: {
          tags: ['alert message'],
          description:
            'Retorna todas as mensagens pre-salvas, que são direcionadas para o totem, de um usuário pelo o seu ID. Requer autenticação',
          summary: 'Retorna todas as mensagens sigilosas de um usuário',
          operationId: 'getUserAlertMessages',
          response: {
            200: z.array(
              z.object({
                id: z.string().uuid(),
                content: z.string(),
                is_favorited: z.boolean().default(false),
              })
            ),
          },
        },
        preHandler: [app.authenticate],
      },
      async (req, reply) => {
        return await this.alertMessageController.getByUserId(req)
      }
    )

    app.post(
      '/',
      {
        schema: {
          tags: ['alert message'],
          description:
            "Cria uma nova mensagem sigilosa pré-salva, através do ID de usuário e o conteúdo dela, deixando como padrão 'false' para o atributo 'is_favorited'. Requer autenticação",
          summary: 'Cria uma nova mensagem sigilosa pré-salva',
          operationId: 'createUserAlertMessage',
          body: z.object({
            content: z.string(),
          }),
          response: {
            201: z.object({
              message: z.literal('Alert Message created'),
            }),
          },
        },
        preHandler: [app.authenticate],
      },
      async (req, reply) => {
        await this.alertMessageController.create(req, reply)
      }
    )

    app.patch(
      '/edit/content/:id',
      {
        schema: {
          tags: ['alert message'],
          description:
            'Edita o conteúdo de uma mensagem pré-salva de um usuário, buscando pelo o ID dessa mensagem. Requer autenticação',
          summary: 'Edita o conteúdo de uma mensagem pré-salva de um usuário.',
          operationId: 'editContentUserAlertMessage',
          params: z.object({
            id: z.string().uuid(),
          }),
          body: z.object({
            content: z.string(),
          }),
          response: {
            204: z.void(),
          },
        },
        preHandler: [app.authenticate],
      },
      async (req, reply) => {
        await this.alertMessageController.editContent(req, reply)
      }
    )

    app.patch(
      '/favorite/:id',
      {
        schema: {
          tags: ['alert message'],
          description:
            'Favorita uma mensagem sigilosa pré-salva do usuário. Requer autenticação',
          summary: 'Favorita uma mensagem sigilosa pré-salva do usuário.',
          operationId: 'favoriteContentUserAlertMessage',
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
        await this.alertMessageController.favorite(req, reply)
      }
    )

    app.patch(
      '/unfavorite/:id',
      {
        schema: {
          tags: ['alert message'],
          description:
            'Desfavorita uma mensagem sigilosa pré-salva do usuário. Requer autenticação',
          summary: 'Desfavorita uma mensagem sigilosa pré-salva do usuário.',
          operationId: 'unfavoriteContentUserAlertMessage',
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
        await this.alertMessageController.unfavorite(req, reply)
      }
    )

    app.delete(
      '/:id',
      {
        schema: {
          tags: ['alert message'],
          description:
            'Deleta uma mensagem sigilosa pré-salva do usuário. Requer autenticação',
          summary: 'Deleta uma mensagem sigilosa pré-salva do usuário.',
          operationId: 'deleteContentUserAlertMessage',
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
        await this.alertMessageController.delete(req, reply)
      }
    )
  }
}
