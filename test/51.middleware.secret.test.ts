import { basename } from '@waiting/shared-core'
import * as assert from 'power-assert'

import { JwtConfig, jwtMiddlewareFactorey } from '../src'
import { initialConfig, schemePrefix } from '../src/lib/config'
import { parseConfig } from '../src/lib/util'

import { token1 } from './test.config'
import { createContext, createNextCb } from './test.util'


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
      const config: JwtConfig = parseConfig(initialConfig)
      const mw = jwtMiddlewareFactorey(config)

      assert(config.client.debug !== true)
      await mw(ctx, next)
    })
  })

})

