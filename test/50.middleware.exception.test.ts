import { basename } from '@waiting/shared-core'
import * as assert from 'power-assert'

import { JwtConfig, jwtMiddlewareFactorey } from '../src'
import { initialConfig, JwtMsg, schemePrefix, initialJwtOptions } from '../src/lib/config'
import { parseConfig } from '../src/lib/util'

import { token1 } from './test.config'
import { createContext, createNextCb } from './test.util'


const filename = basename(__filename)

describe(filename, () => {

  describe('Should middleware works with exception', () => {
    it('w/o token', async () => {
      const config: JwtConfig = parseConfig(initialConfig)
      const mw = jwtMiddlewareFactorey(config)

      const ctx = createContext()
      const next = createNextCb(ctx)

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
      const next = createNextCb(ctx)

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
      const next = createNextCb(ctx)

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
      const next = createNextCb(ctx)

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
      const next = createNextCb(ctx)

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

