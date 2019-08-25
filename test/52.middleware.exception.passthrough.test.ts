import { basename } from '@waiting/shared-core'
import * as assert from 'power-assert'

import { JwtConfig, jwtMiddlewareFactorey } from '../src'
import { initialConfig, JwtMsg, schemePrefix, initialJwtOptions } from '../src/lib/config'
import { parseConfig } from '../src/lib/util'

import { token1 } from './test.config'
import { createContext, createNextCb } from './test.util'
import { Context } from 'egg';


const filename = basename(__filename)

describe(filename, () => {

  describe('Should middleware works with passthrough:true', () => {
    it('w/o token', async () => {
      const config: JwtConfig = parseConfig(initialConfig)
      config.client.authOpts = {
        cookie: false,
        key: 'user',
        passthrough: true,
      }
      const mw = jwtMiddlewareFactorey(config)

      const ctx = createContext()
      const next = createNextCb(ctx, JwtMsg.TokenNotFound)

      await mw(ctx, next)
    })
    it('w/o token debug', async () => {
      const config: JwtConfig = parseConfig(initialConfig)
      config.client.authOpts = {
        cookie: false,
        key: 'user',
        passthrough: true,
      }
      config.client.debug = true
      const mw = jwtMiddlewareFactorey(config)
      const ctx = createContext()
      const next = createNextCb(ctx, JwtMsg.TokenNotFound)

      await mw(ctx, next)
    })

    it('w/o secret', async () => {
      const config: JwtConfig = parseConfig(initialConfig)
      config.client.authOpts = {
        cookie: false,
        key: 'user',
        passthrough: true,
      }
      const mw = jwtMiddlewareFactorey(config)

      const props = {
        header: {
          authorization: `${schemePrefix} ${token1}`,
        },
      }
      const ctx = createContext(props)
      const next = createNextCb(ctx, JwtMsg.TokenValidFailed)

      await mw(ctx, next)
    })
    it('w/o secret debug', async () => {
      const config: JwtConfig = parseConfig(initialConfig)
      config.client.authOpts = {
        cookie: false,
        key: 'user',
        passthrough: true,
      }
      config.client.debug = true
      const mw = jwtMiddlewareFactorey(config)

      const props = {
        header: {
          authorization: `${schemePrefix} ${token1}`,
        },
      }
      const ctx = createContext(props)
      const next = createNextCb(ctx, JwtMsg.TokenValidFailed)

      await mw(ctx, next)
    })
  })


  describe('Should middleware works with passthrough:function->true', () => {
    it('w/o token', async () => {
      const ctx = createContext()
      const next = createNextCb(ctx, JwtMsg.TokenNotFound)
      const config: JwtConfig = parseConfig(initialConfig)
      config.client.authOpts = {
        cookie: false,
        key: 'user',
        passthrough: passthroughCbTrue,
      }
      const mw = jwtMiddlewareFactorey(config)

      await mw(ctx, next)
    })
    it('w/o token debug', async () => {
      const ctx = createContext()
      const next = createNextCb(ctx, JwtMsg.TokenNotFound)
      const config: JwtConfig = parseConfig(initialConfig)
      config.client.authOpts = {
        cookie: false,
        key: 'user',
        passthrough: passthroughCbTrue,
      }
      config.client.debug = true
      const mw = jwtMiddlewareFactorey(config)

      await mw(ctx, next)
    })

    it('w/o secret', async () => {
      const props = {
        header: {
          authorization: `${schemePrefix} ${token1}`,
        },
      }
      const ctx = createContext(props)
      const next = createNextCb(ctx, JwtMsg.TokenValidFailed)
      const config: JwtConfig = parseConfig(initialConfig)
      config.client.authOpts = {
        cookie: false,
        key: 'user',
        passthrough: passthroughCbTrue,
      }
      const mw = jwtMiddlewareFactorey(config)

      await mw(ctx, next)
    })
    it('w/o secret debug', async () => {
      const props = {
        header: {
          authorization: `${schemePrefix} ${token1}`,
        },
      }
      const ctx = createContext(props)
      const next = createNextCb(ctx, JwtMsg.TokenValidFailed)
      const config: JwtConfig = parseConfig(initialConfig)
      config.client.authOpts = {
        cookie: false,
        key: 'user',
        passthrough: passthroughCbTrue,
      }
      config.client.debug = true
      const mw = jwtMiddlewareFactorey(config)

      await mw(ctx, next)
    })
  })
})


async function passthroughCbTrue(_ctx: Context): Promise<boolean> {
  return true
}
