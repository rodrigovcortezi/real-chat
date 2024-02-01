import bcrypt from 'bcrypt'
import type { UserRepository } from '~/repository/users'
import { ErrorCode, ServiceError } from './errors'
import jwt from 'jsonwebtoken'

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

    const { email, password } = user
    if (!(await bcrypt.compare(logInData.password, password))) {
      throw new ServiceError(ErrorCode.INVALID_CREDENTIALS, 401)
    }

    const token = jwt.sign(
      { email },
      process.env['ACCESS_TOKEN_SECRET'] as string,
      {
        expiresIn: '30d',
      },
    )

    return logInResult(email, token)
  }

  return { logIn }
}

const logInResult = (email: string, token: string) => ({ email, token })
