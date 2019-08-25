import { basename } from '@waiting/shared-core'
import * as assert from 'power-assert'

import { JwtConfig, jwtMiddlewareFactorey } from '../src'
import { initialConfig, schemePrefix } from '../src/lib/config'
import { parseConfig } from '../src/lib/util'

import {
  secret,
  token1,
} from './test.config'
import { createContext, createNextCb } from './test.util'


const filename = basename(__filename)

describe(filename, () => {

  describe('Should middleware works with secret', () => {
    it('string', async () => {
      const config: JwtConfig = parseConfig(initialConfig)
      config.client.secret = secret
      const mw = jwtMiddlewareFactorey(config)

      const props = {
        header: {
          authorization: `${schemePrefix} ${token1}`,
        },
      }
      const ctx = createContext(props)
      const next = createNextCb(ctx)

      assert(config.client.debug !== true)

      await mw(ctx, next)
    })
  })
})

