import { createApplication } from '~/lib/application'
import type { AuthService } from '~/services/auth'
import type { UserService } from '~/services/users'
import { errorHandler } from './middlewares/error'
import { bodyParser } from './middlewares/bodyParser'
import { createRouter } from './routes'

interface ServerParams {
  userService: UserService
  authService: AuthService
}

interface Server {
  start(): void
}

export const createServer = ({
  userService,
  authService,
}: ServerParams): Server => {
  const app = createApplication()

  app.use(errorHandler)
  app.use(bodyParser)

  const mainRouter = createRouter({ userService, authService })

  app.use(mainRouter.dispatch)

  const hostname = '0.0.0.0'
  const port = 3000

  const start = () => {
    app.listen(port, hostname, () => {
      console.log(`Server listening at http://${hostname}:${port}`)
    })
  }

  return { start }
}
