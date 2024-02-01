import type { IncomingMessage, ServerResponse } from 'node:http'
import http from 'node:http'

interface RequestContext {
  body: unknown
  params?: { [key: string]: string }
}

export interface Context {
  req: IncomingMessage
  res: ServerResponse
  request: RequestContext
}

export interface NextFunction {
  (): Promise<void>
}

export type Middleware =
  | ((ctx: Context, next?: NextFunction) => Promise<void>)
  | ((ctx: Context, next: NextFunction) => Promise<void>)

interface Application {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listen(...args: any[]): http.Server
  use(fn: Middleware): void
}

export const compose = (stack: Middleware[]) => {
  const cp = (ctx: Context, next?: NextFunction) => {
    let index = -1
    const dispatch = (i: number): Promise<void> => {
      if (i <= index)
        return Promise.reject(new Error('next() called multiple times'))
      index = i
      const fn = i === stack.length ? next : stack[i]
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)))
      } catch (err) {
        return Promise.reject(err)
      }
    }
    return dispatch(0)
  }
  return cp
}

export const createApplication = (): Application => {
  const middlewares: Middleware[] = []

  const callback = () => {
    const fn = compose(middlewares)
    const handleRequest = (req: IncomingMessage, res: ServerResponse) => {
      fn({ req, res, request: { body: null } })
    }

    return handleRequest
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listen = (...args: any[]) => {
    const server = http.createServer(callback())
    return server.listen(...args)
  }

  const use = (fn: Middleware) => {
    middlewares.push(fn)
  }

  return { listen, use }
}
