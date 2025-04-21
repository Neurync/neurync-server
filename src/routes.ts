import type { FastifyInstance } from 'fastify'
import { AlertMessageRouter } from './routers/alert-messages-routes'
import { DangerRouter } from './routers/danger-router'
import { HelpRouter } from './routers/help-router'
import { NonverbalMessageRouter } from './routers/nonverbal-messages-routes'
import { UserRouter } from './routers/user-router'

const userRouter = new UserRouter()
const alertMessageRouter = new AlertMessageRouter()
const nonverbalMessageRouter = new NonverbalMessageRouter()
const dangerRouter = new DangerRouter()
const helpRouter = new HelpRouter()

export async function configRoutes(app: FastifyInstance) {
  app.register(userRouter.routes, { prefix: '/users' })
  app.register(alertMessageRouter.routes, { prefix: '/alert-messages' })
  app.register(nonverbalMessageRouter.routes, { prefix: '/nonverbal-messages' })
  app.register(dangerRouter.routes, { prefix: '/dangers' })
  app.register(helpRouter.routes, { prefix: '/helps' })
}
