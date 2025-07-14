import { fastifyCors } from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import type { FastifyReply, FastifyRequest } from 'fastify'
import fastify from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { env } from './env'
import { errorHandler } from './error-handler'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setErrorHandler(errorHandler)

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors)
app.register(fastifyJwt, { secret: env.SECRET_JWT_KEY })

app.decorate(
  'authenticate',
  async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await req.jwtVerify()
    } catch (error) {
      reply.status(401).send({ error: 'Unauthorized' })
    }
  }
)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Neurync - Documentação da API',
      description:
        'A API consiste na manipulação de registros do banco de dados de diferentes formas, além de métodos de login.',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insira o token JWT no formato: Bearer <token>',
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

export { app }
