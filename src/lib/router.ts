import type { IncomingMessage } from 'http'
import type { Context, Middleware, NextFunction } from './application'
import { compose } from './application'

type Path = string
type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface Route {
  path: Path
  pattern?: RegExp
  params?: string[]
  method: Method
  middleware: Middleware
}

interface MatchRoute {
  route: Route
  params?: { [key: string]: string }
}

interface Router {
  get: (path: Path, ...middlware: Middleware[]) => void
  post: (path: Path, ...middleware: Middleware[]) => void
  put: (path: Path, ...middleware: Middleware[]) => void
  patch: (path: Path, ...middleware: Middleware[]) => void
  delete: (path: Path, ...middlware: Middleware[]) => void
  dispatch: Middleware
  routes: () => Route[]
  use: (routes: Route[]) => void
}

const pathname = (req: IncomingMessage) => {
  const fullUrl = `http://${req.headers.host}${req.url}`
  const parsedUrl = new URL(fullUrl)
  return parsedUrl.pathname.replace(/\/$/, '') || '/'
}

const hasDynamicSegments = (path: Path) => {
  const matches = path.match(/:([a-zA-Z0-9]+)/g)
  return Boolean(matches?.length)
}

const extractParamNames = (path: Path) => {
  const paramNameRegex = /:([a-zA-Z0-9]+)/g
  const paramNames: string[] = []
  let match
  while ((match = paramNameRegex.exec(path)) !== null) {
    paramNames.push(match[1])
  }

  return paramNames
}

export const Router = (): Router => {
  const routeMap = new Map<Path, Map<Method, Route>>()
  const allRoutes: Route[] = []
  const dynamicRoutes: Route[] = []

  const setRoute = ({ path, method, middleware }: Route) => {
    allRoutes.push({ path, method, middleware })
    if (hasDynamicSegments(path)) {
      const params = extractParamNames(path)
      const pattern = new RegExp(
        `^${path.replace(/:([a-zA-Z0-9]+)/g, '([^\\/]+)')}$`,
      )
      dynamicRoutes.push({ path, pattern, params, method, middleware })
    } else {
      const m = routeMap.get(path) ?? new Map<Method, Route>()
      m.set(method, { path, method, middleware })
      routeMap.set(path, m)
    }
  }

  const get = (path: Path, ...middleware: Middleware[]) => {
    const method: Method = 'GET'
    const fn = compose(middleware)
    setRoute({ path, method, middleware: fn })
  }

  const post = (path: Path, ...middleware: Middleware[]) => {
    const method: Method = 'POST'
    const fn = compose(middleware)
    setRoute({ path, method, middleware: fn })
  }

  const put = (path: Path, ...middleware: Middleware[]) => {
    const method: Method = 'PUT'
    const fn = compose(middleware)
    setRoute({ path, method, middleware: fn })
  }

  const patch = (path: Path, ...middleware: Middleware[]) => {
    const method: Method = 'PATCH'
    const fn = compose(middleware)
    setRoute({ path, method, middleware: fn })
  }

  const del = (path: Path, ...middleware: Middleware[]) => {
    const method: Method = 'DELETE'
    const fn = compose(middleware)
    setRoute({ path, method, middleware: fn })
  }

  const dispatch: Middleware = async (ctx: Context, next: NextFunction) => {
    const { req } = ctx
    const staticMatch = matchStaticRoute(req)
    if (staticMatch) {
      const { route } = staticMatch
      return route.middleware(ctx, next)
    }

    const dynamicMatch = matchDynamicRoute(req)
    if (dynamicMatch) {
      const { route, params } = dynamicMatch
      ctx.request.params = params
      return route.middleware(ctx, next)
    }

    ctx.res.statusCode = 404
    ctx.res.end('Not Found\n')
  }

  const routes = () => {
    return allRoutes.slice()
  }

  const use = (routes: Route[]) => {
    routes.forEach((route) => {
      setRoute(route)
    })
  }

  const matchStaticRoute = (req: IncomingMessage): MatchRoute | undefined => {
    const method = req.method as Method
    const route = routeMap.get(pathname(req))?.get(method)
    return route ? { route } : undefined
  }

  const matchDynamicRoute = (req: IncomingMessage) => {
    const method = req.method as Method
    const path = pathname(req)
    for (const route of dynamicRoutes) {
      if (route.method !== method) {
        continue
      }

      const match = path.match(route.pattern as RegExp)
      if (match) {
        const params: { [key: string]: string } = {}
        const paramNames = route.params as string[]
        const paramValues = match.slice(1)
        for (let i = 0; i < paramNames.length; i++) {
          params[paramNames[i]] = paramValues[i]
        }
        return { route, params }
      }
    }
  }

  return { get, post, put, patch, delete: del, dispatch, routes, use }
}
