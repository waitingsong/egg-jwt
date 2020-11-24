import { Context } from 'egg'
import * as assert from 'power-assert'

import { Jwt } from '../src'
import { initialJwtOptions } from '../src/lib/config'

import { payload1, testRedirectURL } from './test.config'


// eslint-disable-next-line @typescript-eslint/ban-types
export function createContext(props?: object): Context {
  const ctx = {
    throw: (status: number, message: string) => {
      throw new Error(`${status}:${message}`)
    },
    jwtState: {},
    app: {
      jwt: new Jwt(initialJwtOptions),
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
  expectExceptionMsg?: string,
): () => Promise<void> {

  return () => {
    return new Promise((done) => {
      if (ctx.jwtState && ctx.jwtState.jwtOriginalError) {
        assert(ctx.jwtState.jwtOriginalError instanceof Error)
        const msg: string = ctx.jwtState.jwtOriginalError.message
        assert(expectExceptionMsg, 'Should pass expectExceptionMsg')
        assert(msg && msg.includes(expectExceptionMsg as string))
      }
      else {
        assert.deepStrictEqual(ctx.jwtState && ctx.jwtState.user, payload1)
      }

      done()
    })
  }
}
