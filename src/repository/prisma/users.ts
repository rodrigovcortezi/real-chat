import type { PrismaClient } from '@prisma/client'
import type { CreateUserDTO, UserRepository, UpdateUserDTO } from '../users'

export const createUsersRepository = (
  prismaClient: PrismaClient,
): UserRepository => {
  const createUser = (userData: CreateUserDTO) => {
    return prismaClient.user.create({ data: userData })
  }

  const updateUser = (id: string, userData: UpdateUserDTO) => {
    return prismaClient.user.update({ where: { id }, data: userData })
  }

  const findUserByEmail = (email: string) => {
    return prismaClient.user.findUnique({ where: { email } })
  }

  return {
    createUser,
    updateUser,
    findUserByEmail,
  }
}
