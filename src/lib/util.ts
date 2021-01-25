import assert from 'assert'

import {
  initialAuthOpts,
  initialEggConfig,
  initialClientOptions,
  JwtMsg,
} from './config'
import {
  JwtEggConfig,
  ClientOptions,
  JwtPayload,
  JwtToken,
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
    const {
      debug,
      secret,
      authOpts,
      decodeOpts,
      signOpts,
      verifyOpts,
      verifySecret,
    } = client

    opts.debug = !! debug
    opts.secret = typeof secret === 'undefined' ? '' : secret
    opts.authOpts = authOpts
      ? { ...initialAuthOpts, ...authOpts }
      : { ...initialAuthOpts }
    opts.decodeOpts = decodeOpts ? { ...decodeOpts } : void 0
    opts.signOpts = signOpts ? { ...signOpts } : void 0
    opts.verifyOpts = verifyOpts ? { ...verifyOpts } : void 0
    opts.verifySecret = typeof verifySecret === 'undefined' ? void 0 : verifySecret
  }
  else {
    opts.debug = initialClientOptions.debug
    opts.secret = initialClientOptions.secret
    opts.authOpts = { ...initialAuthOpts }
  }

  return opts
}


export function validateTokenString(input: JwtToken): void {
  if (typeof input === 'string') {
    assert(input.length > 0)
  }
  else {
    throw new TypeError(JwtMsg.InvalidInput)
  }
}


export function validatePayload(input: JwtPayload): void {
  if (typeof input === 'string') {
    assert(input.length > 0, JwtMsg.InvalidInputString)
    return
  }
  else if (Buffer.isBuffer(input)) {
    assert(input.length > 0, JwtMsg.InvalidInputBuffer)
  }
  else if (typeof input === 'object') {
    assert(Object.keys(input).length > 0)
  }
  else {
    throw new TypeError(JwtMsg.InvalidInput)
  }

}


export function validateSignSecret(input: ClientOptions['secret']): void {
  if (typeof input === 'string') {
    assert(input.length > 0, JwtMsg.InvalidInputString)
    return
  }
  else if (Buffer.isBuffer(input)) {
    assert(input.length > 0, JwtMsg.InvalidInputBuffer)
  }
  else if (typeof input === 'object') {
    assert(Object.keys(input).length > 0)
    assert(typeof input.key === 'string' && input.key.length > 0)
    assert(typeof input.passphrase === 'string')
  }
  else {
    throw new TypeError(JwtMsg.InvalidInput)
  }
}


export function validateVerifySecret(input: ClientOptions['verifySecret']): void {
  if (input === false) {
    return
  }
  else if (typeof input === 'string') {
    assert(input.length > 0, JwtMsg.InvalidInputString)
  }
  else if (Buffer.isBuffer(input)) {
    assert(input.length > 0, JwtMsg.InvalidInputBuffer)
  }
  // else if (typeof input === 'function') { // promise callback
  //   return
  // }
  else {
    throw new TypeError(JwtMsg.InvalidInput)
  }
}
