import { basename } from '@waiting/shared-core'

import { JwtEggConfig, jwtMiddlewareFactorey } from '../src'
import { initialConfig, schemePrefix } from '../src/lib/config'
import { parseConfig } from '../src/lib/util'

import { token1 } from './test.config'
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
      const config: JwtEggConfig = parseConfig(initialConfig)
      const mw = jwtMiddlewareFactorey(config)

      assert(config.client.debug !== true)
      await mw(ctx, next)
    })
  })

})

