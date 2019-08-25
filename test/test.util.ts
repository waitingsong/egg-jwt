import * as assert from 'power-assert'
import { Context } from 'egg'

import { Jwt } from '../src'
import { initialJwtOptions } from '../src/lib/config'

import {
  payload1,
} from './test.config'


export function createContext(props?: object): Context {
  const ctx = {
    throw: (status: number, message: string) => {
      throw new Error(`${status}:${message}`)
    },
    state: {},
    app: {
      jwt: new Jwt(initialJwtOptions),
    },
    ...props,
  } as Context

  return ctx
}

export function createNextCb(ctx: Context): () => Promise<void> {
  return () => {
    return new Promise((done) => {
      assert.deepStrictEqual(ctx.state && ctx.state.user, payload1)
      done()
    })
  }
}
