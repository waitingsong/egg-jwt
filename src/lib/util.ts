import assert from 'assert'

import {
  initialEggConfig,
  initialJwtOptions,
} from './config'
import {
  JwtEggConfig,
  JwtOptions,
} from './types'


/** Generate jwtConfig with input and default value */
export function parseConfig(input: JwtEggConfig): JwtEggConfig {
  const config = {
    agent: initialEggConfig.agent,
    client: parseOptions(input.client),
    enable: initialEggConfig.enable,
  } as JwtEggConfig

  /* istanbul ignore else */
  if (typeof input.agent === 'boolean') {
    config.agent = input.agent
  }

  /* istanbul ignore else */
  if (typeof input.enable === 'boolean') {
    config.enable = input.enable
  }

  /* istanbul ignore else */
  if (typeof input.ignore !== 'undefined') {
    config.ignore = input.ignore
  }

  /* istanbul ignore else */
  if (typeof input.match !== 'undefined') {
    config.match = input.match
  }

  config.appWork = typeof input.appWork === 'boolean'
    ? input.appWork
    : initialEggConfig.appWork

  config.appMiddlewareIndex = typeof input.appMiddlewareIndex === 'number'
    ? input.appMiddlewareIndex
    : initialEggConfig.appMiddlewareIndex

  return config
}

/** Generate jwtOptions with input and default value */
export function parseOptions(client?: JwtOptions): JwtOptions {
  const opts = {} as JwtOptions

  if (client) {
    opts.debug = !! client.debug
  }
  else {
    opts.debug = initialJwtOptions.debug
  }

  assert(opts)
  return opts
}

