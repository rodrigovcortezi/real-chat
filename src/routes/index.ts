import { Router } from '~/lib/router'
import { createUserRouter } from './users'
import type { UserService } from '~/services/users'

interface RouterParams {
  userService: UserService
}

const createRouter = ({ userService }: RouterParams) => {
  const mainRouter = Router()
  const usersRouter = createUserRouter({ userService: userService })
  mainRouter.use(usersRouter.routes())

  return mainRouter
}

export { createRouter }
