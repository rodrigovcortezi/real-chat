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

const validatePassword = (password: string) => {
  // Check if the password meets all the following criteria:
  // 1. At least 8 characters long: `.{8,}`
  // 2. At least one letter: `(?=.*[a-zA-Z])`
  // 3. At least one number: `(?=.*\d)`
  // 4. At least one special character: `(?=.*[!@#$%^&*(),.?":{}|<>])`
  const isValid =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(password)

  return isValid
}

export const createUserService = ({
  userRepository,
}: UserServiceParams): UserService => {
  const registerUser = async (userData: RegisterUserDTO) => {
    const userExists = await userRepository.findUserByEmail(userData.email)
    if (userExists) {
      throw new ServiceError(ErrorCode.EMAIL_ALREADY_REGISTERED)
    }

    if (!validatePassword(userData.password)) {
      throw new ServiceError(ErrorCode.INVALID_PASSWORD)
    }

    const password = await bcrypt.hash(userData.password, 10)
    const user = await userRepository.createUser({ ...userData, password })
    return user
  }

  return { registerUser }
}
