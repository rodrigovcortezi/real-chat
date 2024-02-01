import { createApplication } from '~/lib/application'
import { errorHandler } from './middlewares/error'
import { bodyParser } from '~/middlewares/bodyParser'
import { createRouter } from '~/routes'
import { createUserService } from './services/users'
import { createUsersRepository } from './repository/prisma/users'
import { prisma } from './repository/prisma'

const app = createApplication()

app.use(errorHandler)
app.use(bodyParser)

const userRepository = createUsersRepository(prisma)
const userService = createUserService({ userRepository })
const mainRouter = createRouter({ userService })

app.use(mainRouter.dispatch)

const hostname = '0.0.0.0'
const port = 3000

app.listen(port, hostname, () => {
  console.log(`Server listening at http://${hostname}:${port}`)
})
