/* eslint-disable import/no-extraneous-dependencies */
import * as assert from 'assert'

import { Context } from 'egg'

import { JwtMsg } from '../../lib/config'
import {
  EggMiddleware,
  JwtConfig,
  JwtOptions,
} from '../../lib/model'
import { parseOptions } from '../../lib/util'


export default middlewareFactory

function middlewareFactory(config: JwtConfig): EggMiddleware {
  const opts = parseOptions(config.client) // defined out of mw()!
  const jwtmw = (
    ctx: Context,
    next: () => Promise<void>,
  ) => foo(ctx, next, opts)

  return jwtmw
}

async function foo(
  ctx: Context,
  next: () => Promise<void>,
  options: JwtOptions,
): Promise<void> {

  assert(ctx)
  assert(options, JwtMsg.AuthFailed)

  return next()
}

