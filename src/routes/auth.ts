import type { Context } from '~/lib/application'
import { Router } from '~/lib/router'
import { validator } from '~/middlewares/validator'
import type { AuthService } from '~/services/auth'
import type { LogInSchema } from '~/validation/auth'
import { logInSchema } from '~/validation/auth'

type LogInRequest = LogInSchema

interface AuthRouterParams {
  authService: AuthService
}

const createAuthController = (authService: AuthService) => {
  return async (ctx: Context) => {
    const body = ctx.request.body as LogInRequest
    const user = await authService.logIn(body)
    ctx.res.statusCode = 200
    ctx.res.setHeader('Content-Type', 'application/json')
    ctx.res.end(JSON.stringify(user))
  }
}

export const createAuthRouter = ({ authService }: AuthRouterParams) => {
  const authRouter = Router()
  authRouter.post(
    '/login',
    validator(logInSchema),
    createAuthController(authService),
  )

  return authRouter
}
