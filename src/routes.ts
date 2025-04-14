import type { FastifyInstance } from 'fastify'
import { DangerRouter } from './routers/danger-router'
import { HelpRouter } from './routers/help-router'
import { UserRouter } from './routers/user-router'

const userRouter = new UserRouter()
const dangerRouter = new DangerRouter()
const helpRouter = new HelpRouter()

export async function configRoutes(app: FastifyInstance) {
  app.register(userRouter.routes, { prefix: '/users' })
  app.register(dangerRouter.routes, { prefix: '/dangers' })
  app.register(helpRouter.routes, { prefix: '/helps' })
}
