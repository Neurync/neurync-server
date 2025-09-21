import { NonverbalMessageType } from '@prisma/client'
import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { NonverbalMessageController } from '../controllers/nonverbal-message-controller'
import { PrismaNonverbalMessageRepository } from '../repositories/prisma/prisma-nonverbal-messages-repository'

export class NonverbalMessageRouter {
  private nonverbalMessageController: NonverbalMessageController

  constructor() {
    this.nonverbalMessageController = new NonverbalMessageController(
      new PrismaNonverbalMessageRepository()
    )
  }

  routes = async (app: FastifyInstance) => {
    app.get(
      '/',
      {
        schema: {
          tags: ['nonverbal message'],
          description:
            'Retorna todas as mensagens não verbais pré-prontas de um usuário, com base no ID. Requer autenticação.',
          summary: 'Listar mensagens não verbais de um usuário',
          operationId: 'getUserNonverbalMessages',
          response: {
            200: z.array(
              z.object({
                id: z.string(),
                content: z.string(),
                emoji_icon: z.string(),
                type: z.nativeEnum(NonverbalMessageType),
                is_favorited: z.boolean(),
              })
            ),
          },
        },
        preHandler: [app.authenticate],
      },
      async (req, reply) => {
        return await this.nonverbalMessageController.getByUserId(req, reply)
      }
    )

    app.get(
      '/favoriteds',
      {
        schema: {
          tags: ['nonverbal message'],
          description:
            'Retorna todas as mensagens não verbais pré-prontas favoritadas de um usuário, com base no ID. Requer autenticação.',
          summary: 'Listar mensagens não verbais favoritadas de um usuário',
          operationId: 'getUserNonverbalMessages',
          response: {
            200: z.array(
              z.object({
                id: z.string(),
                content: z.string(),
                emoji_icon: z.string(),
                type: z.nativeEnum(NonverbalMessageType),
                is_favorited: z.literal(true),
              })
            ),
          },
        },
        preHandler: [app.authenticate],
      },
      async (req, reply) => {
        return await this.nonverbalMessageController.getFavoritedsByUserId(
          req,
          reply
        )
      }
    )

    app.post(
      '/',
      {
        schema: {
          tags: ['nonverbal message'],
          description:
            'Cria uma nova mensagem não verbal pré-pronta para o usuário autenticado.',
          summary: 'Criar mensagem não verbal',
          operationId: 'createUserNonverbalMessage',
          body: z.object({
            content: z.string(),
            emoji_icon: z.string(),
            type: z.nativeEnum(NonverbalMessageType),
          }),
          response: {
            201: z.object({
              message: z.literal('Nonverbal Message created'),
            }),
          },
        },
        preHandler: [app.authenticate],
      },
      async (req, reply) => {
        await this.nonverbalMessageController.create(req, reply)
      }
    )

    app.put(
      '/edit/:id',
      {
        schema: {
          tags: ['nonverbal message'],
          description:
            'Edita uma mensagem não verbal existente de um usuário autenticado.',
          summary: 'Editar mensagem não verbal',
          operationId: 'editUserNonverbalMessage',
          params: z.object({
            id: z.string().uuid(),
          }),
          body: z.object({
            content: z.string(),
            emoji_icon: z.string(),
            type: z.nativeEnum(NonverbalMessageType),
            is_favorited: z.boolean(),
          }),
          response: {
            204: z.void(),
          },
        },
        preHandler: [app.authenticate],
      },
      async (req, reply) => {
        await this.nonverbalMessageController.edit(req, reply)
      }
    )

    app.patch(
      '/favorite/:id',
      {
        schema: {
          tags: ['nonverbal message'],
          description: 'Marca uma mensagem não verbal como favorita.',
          summary: 'Favoritar mensagem não verbal',
          operationId: 'favoriteUserNonverbalMessage',
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
        await this.nonverbalMessageController.favorite(req, reply)
      }
    )

    app.patch(
      '/unfavorite/:id',
      {
        schema: {
          tags: ['nonverbal message'],
          description:
            'Remove a marcação de favorita de uma mensagem não verbal.',
          summary: 'Desfavoritar mensagem não verbal',
          operationId: 'unfavoriteUserNonverbalMessage',
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
        await this.nonverbalMessageController.unfavorite(req, reply)
      }
    )

    app.patch(
      '/delete/default-nonverbal-message/:id',
      {
        schema: {
          tags: ['nonverbal message'],
          description:
            'Realiza o soft delete de uma mensagem não verbal padrão do usuário.',
          summary: 'Deletar mensagem não verbal padrão',
          operationId: 'deleteDefaultUserNonverbalMessage',
          params: z.object({
            id: z.string(),
          }),
          response: {
            204: z.void(),
          },
        },
        preHandler: [app.authenticate],
      },
      async (req, reply) => {
        await this.nonverbalMessageController.deleteDefault(req, reply)
      }
    )

    app.delete(
      '/:id',
      {
        schema: {
          tags: ['nonverbal message'],
          description: 'Deleta uma mensagem não verbal do usuário.',
          summary: 'Deletar mensagem não verbal',
          operationId: 'deleteUserNonverbalMessage',
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
        await this.nonverbalMessageController.delete(req, reply)
      }
    )
  }
}
