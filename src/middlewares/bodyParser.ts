import type { Context, NextFunction } from '~/lib/application'

export const bodyParser = async (ctx: Context, next: NextFunction) => {
  const { req } = ctx
  // Only JSON content type supported.
  if (
    req.headers['content-length'] &&
    req.headers['content-type'] !== 'application/json'
  ) {
    throw new Error(`Content type ${req.headers['content-type']} not supported`)
  }
  const body = await new Promise<unknown>((resolve, reject) => {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk.toString()
    })

    req.on('end', () => {
      if (!body) {
        resolve(null)
        return
      }
      try {
        resolve(JSON.parse(body))
      } catch (err) {
        reject(err)
      }
    })
  })
  ctx.request.body = body
  await next()
}
