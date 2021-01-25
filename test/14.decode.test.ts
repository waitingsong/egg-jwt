import { basename } from '@waiting/shared-core'

import { Jwt, initialClientOptions, ClientOptions } from '../src/index'

import {
  secret,
  payload1,
  signature1,
  token1,
  PayloadSig1,
  PayloadExt1,
} from './test.config'

// eslint-disable-next-line import/order
import assert = require('power-assert')


const filename = basename(__filename)

describe(filename, () => {

  describe('Should Jwt:foo() works', () => {
    it('normal string', () => {
      const opts: ClientOptions = {
        ...initialClientOptions,
      }
      const jwt = new Jwt(opts)
      const input = 'fooabc' + Math.random().toString()
      const ret = jwt.foo(input)

      assert(ret === input + 'ok')
    })

  })
})
