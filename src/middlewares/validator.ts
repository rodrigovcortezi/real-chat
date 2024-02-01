import { ZodError, type ZodType } from 'zod'
import type { Context, NextFunction } from '~/lib/application'

export const validator = (schema: ZodType) => {
  return async (ctx: Context, next: NextFunction) => {
    try {
      schema.parse(ctx.request.body)
      await next()
    } catch (err) {
      if (!(err instanceof ZodError)) {
        throw err
      }

      ctx.res.statusCode = 400
      ctx.res.setHeader('Content-Type', 'application/json')
      ctx.res.end(JSON.stringify(err.issues))
    }
  }
}
