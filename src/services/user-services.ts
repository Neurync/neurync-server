import type { SignOptions, SignPayloadType } from '@fastify/jwt'
import { HttpBadRequestError } from '../errors/BadRequest'
import { HttpNotFoundError } from '../errors/NotFound'
import { HttpUnauthorizedError } from '../errors/Unauthorized'
import { hashPassword, verifyPassword } from '../libs/bcrypt'
import type IDangerRepository from '../repositories/interfaces/IDangerRepository'
import type IHelpRepository from '../repositories/interfaces/IHelpRepository'
import type IUserRepository from '../repositories/interfaces/IUserRepository'

export class UserServices {
  private userRepository: IUserRepository
  private helpsRepository: IHelpRepository
  private dangersRepository: IDangerRepository

  constructor(
    userRepository: IUserRepository,
    helpsRepository: IHelpRepository,
    dangersRepository: IDangerRepository
  ) {
    this.userRepository = userRepository
    this.helpsRepository = helpsRepository
    this.dangersRepository = dangersRepository
  }

  async getById(id: string) {
    const user = await this.userRepository.getUserByIdWithHelpsAndDangers(id)

    if (!user) throw new HttpNotFoundError(`User with id=${id} doesn't exist`)

    const {
      name,
      email,
      password,
      about,
      neurodivergence,
      Dangers: dangers,
      Helps: helps,
    } = user

    return {
      id,
      name,
      email,
      password,
      about,
      neurodivergence,
      dangers,
      helps,
    }
  }

  async getByIdSafeData(id: string) {
    const user = await this.userRepository.getUserByIdWithHelpsAndDangers(id)

    if (!user) throw new HttpNotFoundError(`User with id=${id} doesn't exist`)

    const {
      name,
      about,
      neurodivergence,
      Dangers: dangers,
      Helps: helps,
    } = user

    return { name, about, neurodivergence, dangers, helps }
  }

  async getByEmail(email: string) {
    const user = await this.userRepository.getUserByEmail(email)

    if (!user)
      throw new HttpNotFoundError(`User with email=${email} doesn't exist`)

    return user
  }

  async createUser(
    name: string,
    email: string,
    password: string,
    helps?: string[],
    dangers?: string[],
    about?: string,
    neurodivergence?: string
  ) {
    const userAlreadyExists = await this.userRepository.getUserByEmail(email)

    if (userAlreadyExists)
      throw new HttpBadRequestError('User with that email already exists')

    const hashedPassword = await hashPassword(password)
    const userId = await this.userRepository.createUser(
      name,
      email,
      hashedPassword,
      about,
      neurodivergence
    )

    if (helps) await this.helpsRepository.createHelps(userId, helps)

    if (dangers) await this.dangersRepository.createDangers(userId, dangers)
  }
  async getJwt(
    email: string,
    password: string,
    jwtCallback: (
      payload: SignPayloadType,
      options?: Partial<SignOptions>
    ) => string
  ) {
    const user = await this.userRepository.getUserByEmail(email)

    if (!user)
      throw new HttpNotFoundError(`User with email=${email} doesn't exist`)

    const isCorrectPassword = await verifyPassword(password, user.password)

    if (!isCorrectPassword)
      throw new HttpUnauthorizedError(
        `Incorrect password ('${password}') for the user with email=${email}`
      )

    return jwtCallback({
      id: user.id,
      email,
      password,
    })
  }

  async updateUser(
    id: string,
    name: string,
    about: string,
    email: string,
    password: string,
    neurodivergence: string
  ) {
    const user = this.userRepository.getUserById(id)

    if (!user) throw new HttpNotFoundError(`User with id=${id} doesn't exist`)

    await this.userRepository.updateUserById(
      id,
      name,
      about,
      email,
      password,
      neurodivergence
    )
  }

  async updateAbout(id: string, about: string) {
    const user = this.userRepository.getUserById(id)

    if (!user) throw new HttpNotFoundError(`User with id=${id} doesn't exist`)

    await this.userRepository.updateAbout(id, about)
  }

  async updateNeurodivergence(id: string, neurodivergence: string) {
    const user = this.userRepository.getUserById(id)

    if (!user) throw new HttpNotFoundError(`User with id=${id} doesn't exist`)

    await this.userRepository.updateNeurodivergence(id, neurodivergence)
  }

  async deleteUser(id: string) {
    const user = this.userRepository.getUserById(id)

    if (!user) throw new HttpNotFoundError(`User with id=${id} doesn't exist`)

    await this.userRepository.deleteUserById(id)
  }
}
