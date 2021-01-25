import assert from 'assert'

import {
  initialEggConfig,
  initialClientOptions,
} from './config'
import {
  JwtEggConfig,
  ClientOptions,
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
export function parseOptions(client?: ClientOptions): ClientOptions {
  const opts = {} as ClientOptions

  if (client) {
    opts.debug = !! client.debug
  }
  else {
    opts.debug = initialClientOptions.debug
  }

  assert(opts)
  return opts
}

