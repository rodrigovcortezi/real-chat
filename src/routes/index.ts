import { Router } from '~/lib/router'
import { createUserRouter } from './users'
import type { UserService } from '~/services/users'
import { createAuthRouter } from './auth'
import type { AuthService } from '~/services/auth'

interface RouterParams {
  userService: UserService
  authService: AuthService
}

const createRouter = ({ userService, authService }: RouterParams) => {
  const usersRouter = createUserRouter({ userService })
  const authRouter = createAuthRouter({ authService })

  const mainRouter = Router()
  mainRouter.use(usersRouter.routes())
  mainRouter.use(authRouter.routes())

  return mainRouter
}

export { createRouter }
