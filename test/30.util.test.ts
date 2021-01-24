import { basename } from '@waiting/shared-core'

import { schemePrefix } from '../src'
import {
  validateTokenString,
  validatePayload,
  validateSignSecret,
  validateVerifySecret,
} from '../src/lib/util'

import { token1 } from './test.config'

// eslint-disable-next-line import/order
import assert = require('power-assert')


const filename = basename(__filename)

describe(filename, () => {

  describe('Should validateTokenString() works', () => {
    it('with invalid input', () => {
      const arr = [true, false, null, void 0, '']

      arr.forEach((val) => {
        try {
          // @ts-ignore
          validateTokenString(val)
        }
        catch (ex) {
          return assert(true)
        }
        assert(false, 'Should throw error but NOT.')
      })
    })
  })


  describe('Should validatePayload() works', () => {
    it('with valid input', () => {
      const arr = [
        'abc', '\n', token1,
        Buffer.from('foo'),
        { foo: 'bar' },
      ]

      arr.forEach(validatePayload)
    })

    it('with invalid input', () => {
      const arr = [
        '', Buffer.alloc(0), {},
        true, false, null, void 0, Symbol('foo'),
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {},
      ]

      arr.forEach((val) => {
        try {
          // @ts-ignore
          validatePayload(val)
        }
        catch (ex) {
          return assert(true)
        }
        assert(false, 'Should throw error but NOT.')
      })
    })
  })


  describe('Should validateSignSecret() works', () => {
    it('with valid input', () => {
      const arr = [
        'abc', '\n', token1,
        { key: 'foo', passphrase: 'bar' },
        Buffer.from('foo'),
      ]

      arr.forEach(validateSignSecret)
    })

    it('with invalid input', () => {
      const arr = [
        '', Buffer.alloc(0),
        {}, { foo: 'bar' },
        { key: 123 },
        { passphrase: 123 },
        true, false, null, void 0, Symbol('foo'),
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {},
      ]

      arr.forEach((val) => {
        try {
          // @ts-ignore
          validateSignSecret(val)
        }
        catch (ex) {
          return assert(true)
        }
        assert(false, 'Should throw error but NOT.')
      })
    })
  })


  describe('Should validateVerifySecret() works', () => {
    it('with valid input', () => {
      const arr = [
        'abc', '\n', token1,
        Buffer.from('foo'),
        false,
      ] as const

      arr.forEach(validateVerifySecret)
    })

    it('with invalid input', () => {
      const arr = [
        '', Buffer.alloc(0), {},
        true, null, void 0, Symbol('foo'),
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => { },
      ]

      arr.forEach((val) => {
        try {
          // @ts-ignore
          validateVerifySecret(val)
        }
        catch (ex) {
          return assert(true)
        }
        assert(false, 'Should throw error but NOT.')
      })
    })
  })

})

