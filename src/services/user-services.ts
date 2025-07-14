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
    return await this.userRepository.getUserById(id)
  }

  async getByEmail(email: string) {
    return await this.userRepository.getUserByEmail(email)
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

    if (userAlreadyExists) {
      throw new Error('User with that email already exists')
    }

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

  async findUserToCreateJWT(email: string, password: string) {
    const user = await this.userRepository.getUserByEmail(email)

    if (!user) {
      return
    }

    const isCorrectPassword = await verifyPassword(password, user.password)

    if (!isCorrectPassword) {
      return
    }

    return user.id
  }

  async updateUser(
    id: string,
    name: string,
    about: string,
    email: string,
    password: string,
    neurodivergence: string
  ) {
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
    await this.userRepository.updateAbout(id, about)
  }

  async updateNeurodivergence(id: string, neurodivergence: string) {
    await this.userRepository.updateNeurodivergence(id, neurodivergence)
  }

  async deleteUser(id: string) {
    await this.userRepository.deleteUserById(id)
  }
}
