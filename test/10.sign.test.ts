import { basename } from '@waiting/shared-core'

import { Jwt, initialClientOptions, ClientOptions } from '../src/index'

import {
  secret,
  payload1, token1, payload2, tokenHeader2,
} from './test.config'

// eslint-disable-next-line import/order
import assert = require('power-assert')


const filename = basename(__filename)

describe(filename, () => {

  describe('Should Jwt:sign() works', () => {
    it('initializ secret', () => {
      const opts: ClientOptions = {
        ...initialClientOptions,
        secret,
      }
      const jwt = new Jwt(opts)
      const token = jwt.sign(payload1)

      assert(token === token1)
    })

    it('pass secret', () => {
      const opts: ClientOptions = {
        ...initialClientOptions,
      }
      const jwt = new Jwt(opts)
      const token = jwt.sign(payload1, secret)

      assert(token === token1)
    })

    it('both initializing and passing secret', () => {
      const opts: ClientOptions = {
        ...initialClientOptions,
        secret: 'notused',
      }
      const jwt = new Jwt(opts)
      const token = jwt.sign(payload1, secret)

      assert(token === token1)
    })

    it('without iat', () => {
      const opts: ClientOptions = {
        ...initialClientOptions,
        secret,
      }
      const jwt = new Jwt(opts)
      const token = jwt.sign(payload2)

      assert(token.indexOf(tokenHeader2) === 0)
    })

    it('with invalid scope', () => {
      const opts: ClientOptions = {
        ...initialClientOptions,
        secret,
      }
      const jwt = new Jwt(opts)
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const { sign } = jwt

      try {
        sign(payload2)
      }
      catch (ex) {
        return assert(ex instanceof TypeError)
      }
      assert(false, 'Should throw error but NOT.')
    })
  })
})
