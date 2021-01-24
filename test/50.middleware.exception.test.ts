/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { basename } from '@waiting/shared-core'

import { JwtEggConfig, jwtMiddlewareFactorey } from '../src'
import { initialEggConfig, JwtMsg, schemePrefix, initialJwtOptions } from '../src/lib/config'
import { parseConfig } from '../src/lib/util'

import { token1 } from './test.config'
import { createContext, createNextCb } from './test.util'

// eslint-disable-next-line import/order
import assert = require('power-assert')


const filename = basename(__filename)

describe(filename, () => {

  describe('Should middleware works with exception', () => {
    it('w/o token', async () => {
      const ctx = createContext()
      const next = createNextCb(ctx)
      const config: JwtEggConfig = parseConfig(initialEggConfig)
      const mw = jwtMiddlewareFactorey(config)

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
      const ctx = createContext()
      const next = createNextCb(ctx)
      const config: JwtEggConfig = parseConfig(initialEggConfig)
      config.client.debug = true
      const mw = jwtMiddlewareFactorey(config)

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
      const ctx = createContext()
      const next = createNextCb(ctx)
      const config: JwtEggConfig = parseConfig(initialEggConfig)
      const mw = jwtMiddlewareFactorey(config)

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
      const props = {
        header: {
          authorization: `${schemePrefix} ${token1}`,
        },
      }
      const ctx = createContext(props)
      const next = createNextCb(ctx)
      const config: JwtEggConfig = parseConfig(initialEggConfig)
      const mw = jwtMiddlewareFactorey(config)

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
      const props = {
        header: {
          authorization: `${schemePrefix} ${token1}`,
        },
      }
      const ctx = createContext(props)
      const next = createNextCb(ctx)
      const config: JwtEggConfig = parseConfig(initialEggConfig)
      config.client.debug = true
      const mw = jwtMiddlewareFactorey(config)

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

