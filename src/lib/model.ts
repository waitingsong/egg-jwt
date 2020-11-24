// eslint-disable-next-line import/no-extraneous-dependencies
import { Context } from 'egg'
import {
  DecodeOptions as DecodeOpts,
  JwtHeader,
  SignOptions as SignOpts,
  Secret as SignSecret,
  VerifyOptions,
} from 'jsonwebtoken'
import { JsonType } from '@waiting/shared-types'


export {
  JsonType,
  DecodeOpts,
  JwtHeader,
  SignOpts,
  SignSecret,
}

export interface JwtConfig {
  /**
   * Enable for agent, Default: false.
   * Always available for app workers.
   */
  agent?: boolean
  client: JwtOptions
  /** Enable for middleware authentication, Default: false */
  enable: boolean
  /**
   * match and ignore are exclusive exists
   * Default: undefined for matching all routings
   * Caution: '/' will match all, /^\/$/ matches only root !
   * @see https://github.com/eggjs/egg-path-matching
   */
  match?: MiddlewarePathPattern
  /**
   * match and ignore are exclusive exists
   * Caution: '/' will match all, /^\/$/ matches only root !
   */
  ignore?: MiddlewarePathPattern
}

export interface JwtOptions {
  /** Authentication options for middleware */
  authOpts?: AuthenticateOpts
  /** Ignored if authOpts.passthrought true */
  debug?: boolean
  decodeOpts?: DecodeOpts
  /**
   * For signing and verifying if without passing secret param,
   * Note: the type of VerifySecret without object
   */
  secret: SignSecret
  signOpts?: SignOpts
  verifySecret?: VerifySecret | VerifySecret[] | false
  verifyOpts?: VerifyOpts
}

/** Authentication options for middleware */
export interface AuthenticateOpts {
  /**
   * Retrieving the token from the name of cookie, instead of from HTTP header (Authorization),
   * Default: false
   */
  cookie: string | false
  /**
   * This lets downstream middleware make decisions based on whether ctx.state.user is set.
   * You can still handle errors using ctx.state.jwtOriginalError.
   * Default: user
   */
  // key: 'user' | string
  /**
   * - false (Default): throw error
   * - true: always yield next, even if no valid Authorization header was found,
   *    and ignore value of JwtOptions.debug
   * - <RedirectURL>: redirect and without yield next
   */
  passthrough: boolean | RedirectURL | passthroughCallback
}

export type JwtToken = string
export type JwtPayload = string | Buffer | object
export type JwtDecodedPayload<T extends string | JsonType = JsonType> = T
export interface JwtComplete<T extends string | JsonType = JsonType> {
  header: JwtHeader
  payload: JwtDecodedPayload<T>
  signature: string
}

export type VerifySecret = string | Buffer
export type VerifyOpts = Omit<VerifyOptions, 'maxAge'>

export type MiddlewarePathPattern = string | RegExp | PathPatternFunc | (string | RegExp | PathPatternFunc)[]
export type PathPatternFunc = (ctx: Context) => boolean
export type RedirectURL = string
export type passthroughCallback = (ctx: Context) => Promise<boolean | RedirectURL>

export type EggMiddleware = (ctx: Context, next: () => Promise<void>) => Promise<void>

/** Bind on egg.Context.jwtState */
export interface JwtState {
  jwtOriginalError: Error
  secret: unknown
  /** Result */
  user: JsonType
}

declare module 'egg' {
  interface Context {
    jwtState?: JwtState
  }
}

