import type { Context, NextFunction } from '~/lib/application'
import { ServiceError } from '~/services/errors'

export const errorHandler = async (ctx: Context, next: NextFunction) => {
  try {
    await next()
  } catch (err) {
    if (err instanceof ServiceError) {
      ctx.res.statusCode = err.statusCode
      ctx.res.end(err.message)
    } else {
      console.error(err)
      ctx.res.statusCode = 500
      ctx.res.end()
    }
  }
}
