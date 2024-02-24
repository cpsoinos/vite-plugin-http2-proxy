import type { IncomingMessage } from 'http'
import proxy, { type http1WebOptions } from 'http2-proxy'
import type { Plugin, ProxyOptions } from 'vite'

interface Options {
  /**
   * Whether to suppress error logging.
   */
  quiet?: boolean
}

export const http2ProxyPlugin = (options: Options = {}): Plugin => {
  let routes: Record<string, string | ProxyOptions>

  return {
    name: 'vite-plugin-http2-proxy',

    config: (config) => {
      const { server } = config
      routes = server?.proxy ?? {}
      if (server) {
        server.proxy = undefined
      }
      return config
    },

    configureServer: ({ config: { logger }, middlewares }) => {
      Object.entries(routes).forEach(([route, target]) => {
        const url = typeof target === 'string' ? target : (target.target as string)
        const { protocol, hostname, port } = new URL(url)

        const proxyOptions: http1WebOptions = {
          protocol: protocol as 'http' | 'https',
          hostname,
          port: Number(port),
          proxyTimeout: 60000,
        }

        const rewrite: ((path: string) => string) | undefined =
          typeof target === 'string' ? undefined : target.rewrite

        middlewares.use(route, (req, res) => {
          const path = rewrite ? rewrite(req.originalUrl!) : req.originalUrl

          proxy.web(req as IncomingMessage, res, { ...proxyOptions, path }, (err) => {
            if (err && !options.quiet) {
              logger.error(`[http2-proxy] Error when proxying request on '${req.originalUrl}'`, {
                timestamp: true,
                error: err,
              })
            }
          })
        })
      })
    },
  }
}

export default http2ProxyPlugin
