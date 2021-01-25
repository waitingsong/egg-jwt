/* eslint-disable @typescript-eslint/no-explicit-any */
import { JsonType } from '@waiting/shared-types'
import * as jwt from 'jsonwebtoken'

import {
  ClientOptions,
  DecodeOpts,
  JwtPayload,
  JwtToken,
  JwtDecodedPayload,
  SignSecret,
  SignOpts,
  VerifySecret,
  VerifyOpts,
  JwtComplete,
} from './types'
import {
  parseOptions,
  validateSignSecret,
  validateVerifySecret,
  validateTokenString,
  validatePayload,
} from './util'


export class Jwt {

  private readonly config: ClientOptions

  constructor(config: ClientOptions) {
    this.config = parseOptions(config)
  }


  /**
   * @description using app.config.jwt.secret if secretOrPrivateKey is undefined or false
   */
  public sign(
    payload: JwtPayload,
    secretOrPrivateKey?: SignSecret | false,
    options?: SignOpts,
  ): JwtToken {

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
  public verify<T extends string | JsonType = JsonType>(
    token: JwtToken,
    secretOrPrivateKey?: VerifySecret | false,
    options?: VerifyOpts,
  ): JwtDecodedPayload<T> {

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
    return ret as JwtDecodedPayload<T>
  }

  /**
   * Decode token,
   * Warning: This will not verify whether the signature is valid.
   * You should not use this for untrusted messages. You most likely want to use jwt.verify instead
   *
   * @param options value of complete always be TRUE
   */
  public decode<T extends string | JsonType = JsonType>(
    token: JwtToken,
  ): JwtComplete<T> {

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (! this) { throw new TypeError('Should call with class name, such as jwt.foo()') }

    let opts: DecodeOpts = { complete: true }

    /* istanbul ignore else */
    if (this.config.decodeOpts && Object.keys(this.config.decodeOpts).length) {
      opts = { ...this.config.decodeOpts }
    }

    const ret = jwt.decode(token, opts)
    return ret as JwtComplete<T>
  }

}

