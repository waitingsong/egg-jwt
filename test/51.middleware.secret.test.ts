import { basename } from '@waiting/shared-core'

import { JwtEggConfig, jwtMiddlewareFactorey } from '../src'
import { initialEggConfig, schemePrefix } from '../src/lib/config'
import { parseConfig } from '../src/lib/util'

import {
  secret,
  token1,
} from './test.config'
import { createContext, createNextCb } from './test.util'

// eslint-disable-next-line import/order
import assert = require('power-assert')


const filename = basename(__filename)

describe(filename, () => {

  describe('Should middleware works with secret', () => {
    it('string', async () => {
      const props = {
        header: {
          authorization: `${schemePrefix} ${token1}`,
        },
      }
      const ctx = createContext(props)
      const next = createNextCb(ctx)
      const config: JwtEggConfig = parseConfig(initialEggConfig)
      config.client.secret = secret
      const mw = jwtMiddlewareFactorey(config)

      assert(config.client.debug !== true)
      await mw(ctx, next)
    })

    it('string by ctx.state.secret', async () => {
      const props = {
        header: {
          authorization: `${schemePrefix} ${token1}`,
        },
        state: {
          secret,
        },
      }
      const ctx = createContext(props)
      const next = createNextCb(ctx)
      const config: JwtEggConfig = parseConfig(initialEggConfig)
      config.client.secret = secret
      const mw = jwtMiddlewareFactorey(config)

      await mw(ctx, next)
    })
  })
})

