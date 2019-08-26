// eslint-disable-next-line import/no-extraneous-dependencies
import { Context } from 'egg'
import {
  DecodeOptions as DecodeOpts,
  JwtHeader,
  SignOptions as SignOpts,
  Secret as SignSecret,
  VerifyOptions,
} from 'jsonwebtoken'


export {
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
  key: 'user' | string
  /**
   * TRUE: always yield next, even if no valid Authorization header was found,
   * And ignore value of JwtOptions.debug
   */
  passthrough: boolean | passthroughCallback
}

export type JwtToken = string
export type JwtTokenDecoded = string | object
export type JwtPayload = string | Buffer | object

export type VerifySecret = string | Buffer
export type VerifyOpts = Omit<VerifyOptions, 'maxAge'>
export type DecodeRet = null | string | JsonType
export interface DecodeComplete {
  header: JwtHeader
  payload: JwtPayload
  signature: JwtToken
}

export type MiddlewarePathPattern = string | RegExp | PathPatternFunc | (string | RegExp | PathPatternFunc)[]
export type PathPatternFunc = (ctx: Context) => boolean
export type passthroughCallback = (ctx: Context) => Promise<boolean>


/** Value of key-value pairs object */
export type PlainJsonValueType = boolean | number | string | null | undefined
/**
 * Typeof JSON object parsed from Response data
 * simple key-value pairs object.
 */
export interface JsonType {
  [key: string]: PlainJsonValueType | PlainJsonValueType[] | JsonType | JsonType[]
}

export type EggMiddleware = (ctx: Context, next: () => Promise<void>) => Promise<void>
