import { basename } from '@waiting/shared-core'
import * as assert from 'power-assert'
import { Context } from 'egg'

import { JwtConfig, jwtMiddlewareFactorey, RedirectURL } from '../src'
import { initialConfig, JwtMsg, schemePrefix, initialJwtOptions } from '../src/lib/config'
import { parseConfig } from '../src/lib/util'

import { token1, testRedirectURL } from './test.config'
import { createContext, createNextCb } from './test.util'


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


  describe('Should middleware works with passthrough:redirectURL', () => {
    it('string', async () => {
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
        passthrough: testRedirectURL,
      }
      const mw = jwtMiddlewareFactorey(config)

      // assert in fake ctx.redirect()
      await mw(ctx, next)
    })

    it('Promise<string>', async () => {
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
        passthrough: passthroughCbURL,
      }
      const mw = jwtMiddlewareFactorey(config)

      // assert in fake ctx.redirect()
      await mw(ctx, next)
    })

    it('should throw error with blank string', async () => {
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
        passthrough: '',
      }
      const mw = jwtMiddlewareFactorey(config)

      try {
        await mw(ctx, next)
      }
      catch (ex) {
        const msg: string = ex.message
        return assert(msg && msg.includes(JwtMsg.AuthFailed))
      }
      assert(false, 'Should throw error but NOT.')
    })
    it('should throw error with blank string debug', async () => {
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
        passthrough: '',
      }
      config.client.debug = true
      const mw = jwtMiddlewareFactorey(config)

      try {
        await mw(ctx, next)
      }
      catch (ex) {
        const msg: string = ex.message
        return assert(msg && msg.includes(JwtMsg.TokenValidFailed))
      }
      assert(false, 'Should throw error but NOT.')
    })

    it('should throw error with blank string', async () => {
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
        passthrough: passthroughCbBlank,
      }
      const mw = jwtMiddlewareFactorey(config)

      try {
        await mw(ctx, next)
      }
      catch (ex) {
        const msg: string = ex.message
        return assert(msg && msg.includes(JwtMsg.AuthFailed))
      }
      assert(false, 'Should throw error but NOT.')
    })
    it('should throw error with blank string debug', async () => {
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
        passthrough: passthroughCbBlank,
      }
      config.client.debug = true
      const mw = jwtMiddlewareFactorey(config)

      try {
        await mw(ctx, next)
      }
      catch (ex) {
        const msg: string = ex.message
        return assert(msg && msg.includes(JwtMsg.TokenValidFailed))
      }
      assert(false, 'Should throw error but NOT.')
    })
  })
})


async function passthroughCbTrue(_ctx: Context): Promise<boolean> {
  return true
}

async function passthroughCbURL(_ctx: Context): Promise<RedirectURL> {
  return testRedirectURL
}

async function passthroughCbBlank(_ctx: Context): Promise<RedirectURL> {
  return ''
}
