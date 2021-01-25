import { Context } from 'egg'

import { Jwt } from '../src'
import { initialClientOptions } from '../src/lib/config'

import { payload1, testRedirectURL } from './test.config'

// eslint-disable-next-line import/order
import assert = require('power-assert')


// eslint-disable-next-line @typescript-eslint/ban-types
export function createContext(props?: object): Context {
  const ctx = {
    throw: (status: number, message: string) => {
      throw new Error(`${status}:${message}`)
    },
    jwtState: {},
    app: {
      jwt: new Jwt(initialClientOptions),
    },
    ...props,
  } as unknown as Context

  ctx.redirect = (url: string) => {
    assert(url && url.includes(testRedirectURL))
  }

  return ctx
}

export function createNextCb(
  ctx: Context,
): () => Promise<void> {

  return () => {
    return new Promise((done) => {
      assert(ctx)
      done()
    })
  }
}
