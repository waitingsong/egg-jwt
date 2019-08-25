import { basename } from '@waiting/shared-core'
import * as assert from 'power-assert'
import { Context } from 'egg'

import { JwtConfig, jwtMiddlewareFactorey } from '../src'
import { initialConfig, JwtMsg } from '../src/lib/config'

import {
  secret,
  payload1, token1,
} from './test.config'


const filename = basename(__filename)

describe(filename, () => {

  describe('Should middleware works', () => {
    it('w/o token', async () => {
      const config: JwtConfig = { ...initialConfig }
      const mw = jwtMiddlewareFactorey(config)
      const ctx = createCtx()
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
      const configDebug: JwtConfig = { ...initialConfig }
      configDebug.client.debug = true
      const mw = jwtMiddlewareFactorey(configDebug)
      const ctx = createCtx()
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

  })
})


function createCtx(): Context {
  const ctx = {
    throw: (status: number, message: string) => {
      throw new Error(`${status}:${message}`)
    },
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
