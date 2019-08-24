import { basename } from '@waiting/shared-core'
import * as assert from 'power-assert'

import { Jwt, initialJwtOptions, JwtOptions, DecodeComplete, DecodeRet } from '../src/index'

import {
  secret,
  payload1,
  signature1,
  token1,
} from './test.config'


const filename = basename(__filename)

describe(filename, () => {

  describe('Should Jwt:decode() works', () => {
    it('normal', () => {
      const opts: JwtOptions = {
        ...initialJwtOptions,
      }
      const jwt = new Jwt(opts)
      const token = jwt.sign(payload1, secret)
      const ret: DecodeRet = jwt.decode(token)
      assert.deepStrictEqual(ret, payload1)
    })

    it('pass secret', () => {
      const opts: JwtOptions = {
        ...initialJwtOptions,
      }
      const jwt = new Jwt(opts)
      const token = jwt.sign(payload1, secret)
      const ret: DecodeComplete = jwt.decode(token, { complete: true })
      const { header, payload, signature } = ret

      assert(header && header.alg === 'HS256')
      assert(header.typ === 'JWT')
      assert(signature === signature1)
      assert.deepStrictEqual(payload, payload1)
    })

    it('with invalid scope', () => {
      const opts: JwtOptions = {
        ...initialJwtOptions,
        secret,
      }
      const jwt = new Jwt(opts)
      const { decode } = jwt

      try {
        decode(token1)
      }
      catch (ex) {
        return assert(ex instanceof TypeError)
      }
      assert(false, 'Should throw error but NOT.')
    })
  })
})
