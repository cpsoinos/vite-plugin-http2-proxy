# vite-plugin-http2-proxy

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![license][license-src]][license-href]

Run an HTTP2 proxy in development mode with Vite. Works great when paired with [vite-plugin-mkcert](https://github.com/liuweiGL/vite-plugin-mkcert).

## Why would I use this?

When using Vite's built-in proxy and `https: true`, all requests are downgraded to HTTP1.1. See [this issue](https://github.com/vitejs/vite/issues/4184) for discussion. This plugin is useful when you need to proxy requests to an external API in development mode and you want to use https and/or HTTP2.

Use this with [vite-plugin-mkcert](https://github.com/liuweiGL/vite-plugin-mkcert) for seamless SSL certificate generation and use of https with proxy usage in development.

## Install

### Using `npm`

```zsh
npm install @cpsoinos/vite-plugin-http2-proxy --save-dev
```

### Using `yarn`

```zsh
yarn add @cpsoinos/vite-plugin-http2-proxy -D
```

### Using `pnpm`

```zsh
pnpm add @cpsoinos/vite-plugin-http2-proxy -D
```

## Usage

```ts
// vite.config.ts

import { defineConfig } from 'vite'
import http2Proxy from '@cpsoinos/vite-plugin-http2-proxy'
import mkcert from 'vite-plugin-mkcert' // optional - use to generate SSL certificates and use https in development

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      // ... other plugins
      mkcert(), // optional
      http2Proxy({ quiet: true }), // optional -- suppress error logging
    ],
    server: {
      // optional - only in development mode
      ...(mode === 'development' && {
        proxy: {
          '/api': {
            target: 'https://api.example.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''), // optional - remove `/api` from request path
          },
        },
      }),
    },
  }
})
```

## Accreditations

Adapted from a [gist](https://gist.github.com/xfournet/068592b3d1ddd488427b874b23f707bf) shared by @xfournet in [this issue comment](https://github.com/vitejs/vite/issues/4184#issuecomment-1824133940).

This plugin uses `http2-proxy` under the hood. See the [http2-proxy](https://www.npmjs.com/package/http2-proxy) package for more information.

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2024 [Corey Psoinos](https://github.com/cpsoinos).

This project is [MIT](https://github.com/cpsoinos/nuxt-svgo/blob/main/LICENSE) licensed.

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@cpsoinos/vite-plugin-http2-proxy/latest.svg?style=flat-square
[npm-version-href]: https://npmjs.com/package/@cpsoinos/vite-plugin-http2-proxy
[npm-downloads-src]: https://img.shields.io/npm/dt/@cpsoinos/vite-plugin-http2-proxy.svg?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/@cpsoinos/vite-plugin-http2-proxy
[license-src]: https://img.shields.io/npm/l/@cpsoinos/vite-plugin-http2-proxy.svg?style=flat-square
[license-href]: https://github.com/cpsoinos/vite-plugin-http2-proxy/blob/main/LICENSE
