import type { Context } from '~/lib/application'
import type { CreateUserSchema } from '~/server/validation/users'
import { Router } from '~/lib/router'
import { validator } from '~/server/middlewares/validator'
import { createUserSchema } from '~/server/validation/users'
import type { UserService } from '~/services/users'

type CreateUserRequest = CreateUserSchema

const createUserController = (userService: UserService) => {
  return async (ctx: Context) => {
    const body = ctx.request.body as CreateUserRequest
    const user = await userService.registerUser(body)
    ctx.res.statusCode = 200
    ctx.res.setHeader('Content-Type', 'application/json')
    ctx.res.end(JSON.stringify(user))
  }
}

interface UserRouterParams {
  userService: UserService
}

const createUserRouter = ({ userService }: UserRouterParams) => {
  const usersRouter = Router()
  usersRouter.post(
    '/users',
    validator(createUserSchema),
    createUserController(userService),
  )

  return usersRouter
}

export { createUserRouter }
