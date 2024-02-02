import { createUserService } from './services/users'
import { createUsersRepository } from './repository/prisma/users'
import { prisma } from './repository/prisma'
import { createAuthService } from './services/auth'
import { createServer } from './server'

const userRepository = createUsersRepository(prisma)
const userService = createUserService({ userRepository })
const authService = createAuthService({ userRepository })

const server = createServer({ userService, authService })
server.start()
