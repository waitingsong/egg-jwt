import { basename } from '@waiting/shared-core'

import { Jwt, initialClientOptions, ClientOptions } from '../src/index'

import {
  secret,
  payload1,
  token1,
} from './test.config'

// eslint-disable-next-line import/order
import assert = require('power-assert')


const filename = basename(__filename)

describe(filename, () => {

  describe('Should Jwt:verify() works', () => {
    it('initializ secret', () => {
      const opts: ClientOptions = {
        ...initialClientOptions,
        secret,
      }
      const jwt = new Jwt(opts)
      const token = jwt.sign(payload1)
      const ret = jwt.verify(token)

      assert.deepStrictEqual(ret, payload1)
    })

    it('without secret', () => {
      const opts: ClientOptions = {
        ...initialClientOptions,
      }
      const jwt = new Jwt(opts)
      const token = jwt.sign(payload1, secret)

      try {
        jwt.verify(token)
      }
      catch (ex) {
        return assert(true)
      }
      assert(false, 'Should throw error but NOT.')
    })

    it('pass secret', () => {
      const opts: ClientOptions = {
        ...initialClientOptions,
      }
      const jwt = new Jwt(opts)
      const token = jwt.sign(payload1, secret)
      const ret = jwt.verify(token, secret)

      assert.deepStrictEqual(ret, payload1)
    })

    it('only initializing secret', () => {
      const opts: ClientOptions = {
        ...initialClientOptions,
        secret: 'notused',
      }
      const jwt = new Jwt(opts)
      const token = jwt.sign(payload1, secret)
      try {
        jwt.verify(token)
      }
      catch (ex) {
        return assert(true)
      }
      assert(false, 'Should throw error but NOT.')
    })

    it('both initializing and passing secret', () => {
      const opts: ClientOptions = {
        ...initialClientOptions,
        secret: 'notused',
      }
      const jwt = new Jwt(opts)
      const token = jwt.sign(payload1, secret)
      const ret = jwt.verify(token, secret)

      assert.deepStrictEqual(ret, payload1)
    })

    it('with invalid scope', () => {
      const opts: ClientOptions = {
        ...initialClientOptions,
        secret,
      }
      const jwt = new Jwt(opts)
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const { verify } = jwt

      try {
        verify(token1)
      }
      catch (ex) {
        return assert(ex instanceof TypeError)
      }
      assert(false, 'Should throw error but NOT.')
    })
  })
})
