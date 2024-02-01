import type { User } from '~/model/user'
import type { UserRepository } from '~/repository/users'
import bcrypt from 'bcrypt'
import { ServiceError, ErrorCode } from './errors'

interface RegisterUserDTO {
  email: string
  password: string
}

export interface UserService {
  registerUser(userData: RegisterUserDTO): Promise<User>
}

interface UserServiceParams {
  userRepository: UserRepository
}

export const createUserService = ({
  userRepository,
}: UserServiceParams): UserService => {
  const registerUser = async (userData: RegisterUserDTO) => {
    const userExists = await userRepository.findUserByEmail(userData.email)
    if (userExists) {
      throw new ServiceError(ErrorCode.EMAIL_ALREADY_REGISTERED)
    }

    const password = await bcrypt.hash(userData.password, 10)
    const user = await userRepository.createUser({ ...userData, password })
    return user
  }

  return { registerUser }
}
