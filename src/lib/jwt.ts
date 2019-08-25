/* eslint-disable @typescript-eslint/no-explicit-any */
import * as jwt from 'jsonwebtoken'

import {
  JwtOptions,
  DecodeOpts,
  DecodeRet,
  JwtPayload,
  JwtToken,
  JwtTokenDecoded,
  SignSecret,
  SignOpts,
  VerifySecret,
  VerifyOpts,
  DecodeComplete,
} from './model'
import {
  validateSignSecret,
  validateVerifySecret,
  validateTokenString,
  validatePayload,
} from './util'


export class Jwt {

  private readonly config: JwtOptions

  constructor(config: JwtOptions) {
    this.config = { ...config }
  }


  /**
   * @description using app.config.jwt.secret if secretOrPrivateKey is undefined or false
   */
  public sign(
    payload: JwtPayload,
    secretOrPrivateKey?: SignSecret | false,
    options?: SignOpts,
  ): JwtToken {

    if (! this) { throw new TypeError('Should call with class name, such as jwt.foo()') }

    const opts: SignOpts = options
      ? { ...this.config.signOpts, ...options }
      : { ...this.config.signOpts }

    const secret = typeof secretOrPrivateKey === 'undefined' || secretOrPrivateKey === false
      ? this.config.secret
      : secretOrPrivateKey

    validatePayload(payload)
    validateSignSecret(secret)

    const ret = jwt.sign(payload, secret, opts)
    return ret
  }


  /**
   * @description using app.config.jwt.secret if secretOrPrivateKey is undefined or false
   */
  public verify(
    token: JwtToken,
    secretOrPrivateKey?: VerifySecret | false,
    options?: VerifyOpts,
  ): JwtTokenDecoded {

    if (! this) { throw new TypeError('Should call with class name, such as jwt.foo()') }

    const opts: VerifyOpts = options
      ? { ...this.config.verifyOpts, ...options }
      : { ...this.config.verifyOpts }

    const secret = typeof secretOrPrivateKey === 'undefined' || secretOrPrivateKey === false
      ? this.config.secret as VerifySecret
      : secretOrPrivateKey

    validateTokenString(token)
    validateVerifySecret(secret)

    const ret = jwt.verify(token, secret, opts)
    return ret
  }

  /**
   * Decode token
   * @param options if specified then value of complete always be TRUE
   */
  public decode<T extends DecodeOpts | undefined>(
    token: JwtToken,
    options?: T,
  ): undefined extends T ? DecodeRet : DecodeComplete {

    if (! this) { throw new TypeError('Should call with class name, such as jwt.foo()') }

    let opts: DecodeOpts | undefined

    /* istanbul ignore else */
    if (this.config.decodeOpts && Object.keys(this.config.decodeOpts).length) {
      opts = { ...this.config.decodeOpts }
    }
    /* istanbul ignore else */
    if (typeof options === 'object' && options) {
      opts = { ...options }
    }
    /* istanbul ignore else */
    if (opts) {
      opts.complete = true
    }

    const ret = jwt.decode(token, opts)
    return ret as void extends T ? DecodeRet : DecodeComplete
  }

}

