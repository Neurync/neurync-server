import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { UserController } from '../controllers/user-controller'
import { PrismaUserRepository } from '../repositories/prisma/prisma-user-repository'

export class UserRouter {
  private userController: UserController

  constructor() {
    this.userController = new UserController(new PrismaUserRepository())
  }

  routes = async (app: FastifyInstance) => {
    app.get(
      '/:id',
      {
        schema: {
          tags: ['users'],
          description:
            'Retorna as informações de um usuário, com determinado ID, como resposta',
          summary: 'Retorna as informações de um usuário',
          operationId: 'getUserById',
          params: z.object({
            id: z.string().uuid(),
          }),
          response: {
            200: z.object({
              id: z.string().uuid(),
              name: z.string(),
              email: z.string().email(),
              password: z.string(),
            }),
          },
        },
      },
      async req => {
        return await this.userController.getById(req)
      }
    )
    app.post(
      '/register',
      {
        schema: {
          tags: ['users'],
          description:
            'Cria um usuário no banco de dados, pegando nome, email e senha, encriptando esta última.',
          summary: 'Cria um usuário no BD',
          operationId: 'createUser',
          body: z.object({
            name: z.string(),
            email: z.string().email(),
            password: z.string(),
          }),
          response: {
            201: z.object({
              message: z.literal('User created'),
            }),
          },
        },
      },
      async (req, reply) => {
        await this.userController.register(req, reply)
      }
    )
    app.post(
      '/login',
      {
        schema: {
          tags: ['users'],
          description:
            'Realiza um login com base em email e senha do usuário, retornando um JWT Token.',
          summary: 'Faz login do usuário',
          operationId: 'loginUser',
          body: z.object({
            email: z.string().email(),
            password: z.string(),
          }),
          response: {
            200: z.object({
              token: z.string().jwt(),
            }),
          },
        },
      },
      async (req, reply) => {
        await this.userController.login(req, reply, app.jwt.sign)
      }
    )
    app.put(
      '/:id',
      {
        schema: {
          tags: ['users'],
          description:
            'Edita os dados de um usuário com seu ID como parâmetro.',
          summary: 'Edita os dados de um usuário',
          operationId: 'editUser',
          security: [{ BearerAuth: [] }],
          params: z.object({
            id: z.string().uuid(),
          }),
          body: z.object({
            name: z.string(),
            about: z.string(),
            email: z.string().email(),
            password: z.string(),
            neurodivergence: z.string(),
          }),
          response: {
            204: z.void(),
          },
        },
        preHandler: [app.authenticate],
      },
      async (req, reply) => {
        await this.userController.editUser(req, reply)
      }
    )

    app.patch(
      '/about',
      {
        schema: {
          tags: ['users'],
          description: "Edita o 'about' (sobre) de um usuário.",
          summary: "Edita o 'about' de um usuário.",
          operationId: 'editUserAbout',
          security: [{ BearerAuth: [] }],
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
        await this.userController.editAbout(req, reply)
      }
    )

    app.patch(
      '/neurodivergence',
      {
        schema: {
          tags: ['users'],
          description:
            "Edita o 'neurodivergence' (neurodivergencia) de um usuário.",
          summary: "Edita o 'neurodivergence' de um usuário.",
          operationId: 'editUserNeurodivergence',
          security: [{ BearerAuth: [] }],
          body: z.object({
            neurodivergence: z.string(),
          }),
          response: {
            204: z.void(),
          },
        },
        preHandler: [app.authenticate],
      },
      async (req, reply) => {
        await this.userController.editNeurodivergence(req, reply)
      }
    )

    app.delete(
      '/:id',
      {
        schema: {
          tags: ['users'],
          description:
            'Deleta os dados de um usuário com seu ID como parâmetro.',
          summary: 'Deleta os dados de um usuário',
          operationId: 'deleteUser',
          security: [{ BearerAuth: [] }],
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
        await this.userController.deleteUser(req, reply)
      }
    )
  }
}
