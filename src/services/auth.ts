import bcrypt from 'bcrypt'
import type { UserRepository } from '~/repository/users'
import { ErrorCode, ServiceError } from './errors'

interface LogInDTO {
  email: string
  password: string
}

interface LogInResult {
  email: string
  token: string
}

export interface AuthService {
  logIn(logInData: LogInDTO): Promise<LogInResult>
}

interface AuthServiceParams {
  userRepository: UserRepository
}

export const createAuthService = ({
  userRepository,
}: AuthServiceParams): AuthService => {
  const logIn = async (logInData: LogInDTO) => {
    const user = await userRepository.findUserByEmail(logInData.email)
    if (!user) {
      throw new ServiceError(ErrorCode.INVALID_CREDENTIALS, 401)
    }

    if (!(await bcrypt.compare(logInData.password, user.password))) {
      throw new ServiceError(ErrorCode.INVALID_CREDENTIALS, 401)
    }

    return logInResult(user.email, 'faketoken')
  }

  return { logIn }
}

const logInResult = (email: string, token: string) => ({ email, token })
