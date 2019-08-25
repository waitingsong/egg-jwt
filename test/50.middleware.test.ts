import { basename } from '@waiting/shared-core'
import * as assert from 'power-assert'
import { Context } from 'egg'

import { JwtConfig, jwtMiddlewareFactorey, Jwt } from '../src'
import { initialConfig, JwtMsg, schemePrefix, initialJwtOptions } from '../src/lib/config'
import { parseConfig } from '../src/lib/util'

import {
  secret,
  payload1, token1,
} from './test.config'


const filename = basename(__filename)

describe(filename, () => {

  describe('Should middleware works', () => {
    it('w/o token', async () => {
      const config: JwtConfig = parseConfig(initialConfig)
      const mw = jwtMiddlewareFactorey(config)

      const ctx = createContext()
      const next = createNextCb()

      try {
        await mw(ctx, next)
      }
      catch (ex) {
        const msg: string = ex.message
        return assert(msg.includes('401') && msg.includes(JwtMsg.AuthFailed))
      }
      assert(false, 'Should throw error but NOT')
    })
    it('w/o token debug', async () => {
      const config: JwtConfig = parseConfig(initialConfig)
      config.client.debug = true
      const mw = jwtMiddlewareFactorey(config)
      const ctx = createContext()
      const next = createNextCb()

      try {
        await mw(ctx, next)
      }
      catch (ex) {
        const msg: string = ex.message
        return assert(msg.includes('401') && msg.includes(JwtMsg.TokenNotFound))
      }
      assert(false, 'Should throw error but NOT')
    })
    it('w/o token again', async () => {
      const config: JwtConfig = parseConfig(initialConfig)
      const mw = jwtMiddlewareFactorey(config)

      const ctx = createContext()
      const next = createNextCb()

      assert(config.client.debug !== true)

      try {
        await mw(ctx, next)
      }
      catch (ex) {
        const msg: string = ex.message
        return assert(msg.includes('401') && msg.includes(JwtMsg.AuthFailed))
      }
      assert(false, 'Should throw error but NOT')
    })

    it('w/o secret', async () => {
      const config: JwtConfig = parseConfig(initialConfig)
      const mw = jwtMiddlewareFactorey(config)

      const props = {
        header: {
          authorization: `${schemePrefix} ${token1}`,
        },
      }
      const ctx = createContext(props)
      const next = createNextCb()

      assert(config.client.debug !== true)

      try {
        await mw(ctx, next)
      }
      catch (ex) {
        const msg: string = ex.message
        return assert(msg.includes('401') && msg.includes(JwtMsg.AuthFailed))
      }
      assert(false, 'Should throw error but NOT')
    })
    it('w/o secret debug', async () => {
      const config: JwtConfig = parseConfig(initialConfig)
      config.client.debug = true
      const mw = jwtMiddlewareFactorey(config)

      const props = {
        header: {
          authorization: `${schemePrefix} ${token1}`,
        },
      }
      const ctx = createContext(props)
      const next = createNextCb()

      try {
        await mw(ctx, next)
      }
      catch (ex) {
        const msg: string = ex.message
        return assert(msg.includes('401') && msg.includes(JwtMsg.TokenValidFailed))
      }
      assert(false, 'Should throw error but NOT')
    })


  })
})


function createContext(props?: object): Context {
  const ctx = {
    throw: (status: number, message: string) => {
      throw new Error(`${status}:${message}`)
    },
    state: {},
    app: {
      jwt: new Jwt(initialJwtOptions),
    },
    ...props,
  } as Context

  return ctx
}

function createNextCb(): () => Promise<void> {
  return () => {
    return new Promise((done) => {
      done()
    })
  }
}
