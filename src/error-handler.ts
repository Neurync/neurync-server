import type { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'
import { HttpBadRequestError } from './errors/BadRequest'
import { HttpNotFoundError } from './errors/NotFound'
import { HttpUnauthorizedError } from './errors/Unauthorized'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, _request, reply) => {
  console.error(`> ❌ ${error}`)

  if (error instanceof ZodError)
    return reply
      .status(400)
      .send({ message: 'Invalid input', errors: error.flatten().fieldErrors })

  if (error instanceof HttpBadRequestError)
    return reply.status(400).send({ message: error.message })

  if (error instanceof HttpUnauthorizedError)
    return reply.status(401).send({ message: error.message })

  if (error instanceof HttpNotFoundError)
    return reply.status(404).send({ message: error.message })

  return reply.status(500).send({ message: 'Internal server error' })
}
