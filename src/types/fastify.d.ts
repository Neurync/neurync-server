import type { FastifyInstance } from 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: string; email: string; password: string }
    user: { id: string; email: string; password: string }
  }
}
