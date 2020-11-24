import { basename } from '@waiting/shared-core'
import * as assert from 'power-assert'

import { schemePrefix } from '../src'
import {
  resolveFromAuthorizationHeader,
  resolveFromCookies,
} from '../src/lib/resolvers'

import { token1 } from './test.config'


const filename = basename(__filename)

describe(filename, () => {

  describe('Should resolveFromAuthorizationHeader() works', () => {
    it('with valid input', () => {
      const arr = [
        `${schemePrefix} ${token1}`,
        `${schemePrefix}   ${token1}`,
      ]

      arr.forEach((val) => {
        const token = resolveFromAuthorizationHeader(val)
        assert(token && token === token1)
      })
    })

    it('with invalid type input', () => {
      const arr = [
        '',
        1,
        true,
        false,
        null,
        void 0,
      ]

      arr.forEach((val) => {
        // @ts-ignore
        const token = resolveFromAuthorizationHeader(val)
        assert(token === '')
      })
    })

    it('with invalid header input', () => {
      const arr = [
        ` ${schemePrefix}   ${token1}`,
        ` ${schemePrefix} ${token1}`,
        `${schemePrefix} ${token1}  `,
        `${schemePrefix} ${token1} `,
        `${schemePrefix} ${token1} fake`,
        `${schemePrefix}: ${token1}`,
        `${schemePrefix} `,
        `${token1}`,
        ` ${token1}`,
      ]

      arr.forEach((val) => {
        const token = resolveFromAuthorizationHeader(val)
        assert(token === '')
      })
    })
  })


  describe('Should resolveFromCookies() works', () => {
    it('with valid cookieKey', () => {
      const cookies = new Map<string, string>()
      cookies.set('user', token1)
      // @ts-ignore
      const ret = resolveFromCookies(cookies, 'user')
      assert(ret === token1)
    })

    it('with blank cookieKey', () => {
      const cookies = new Map<string, string>()
      cookies.set('user', token1)
      // @ts-ignore
      const ret = resolveFromCookies(cookies, '')
      assert(ret === '')
    })
  })
})

