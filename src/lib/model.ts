import { JsonType } from '@waiting/shared-types'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Context } from 'egg'


export interface JwtConfig {
  /**
   * The position of config.appMiddleware[] to add.
   * Default: -1 (last)
   */
  appMiddlewareIndex?: number
  /**
   * Switch for app works, Default: true.
   */
  appWork?: boolean
  /**
   * Switch for agent, Default: false.
   */
  agent?: boolean
  client: JwtOptions
  /** Switch of middleware works for egg.js, Default: false */
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
  debug?: boolean
}


export type MiddlewarePathPattern = string | RegExp | PathPatternFunc | (string | RegExp | PathPatternFunc)[]
export type PathPatternFunc = (ctx: Context) => boolean
export type RedirectURL = string
export type passthroughCallback = (ctx: Context) => Promise<boolean | RedirectURL>

export type EggMiddleware = (ctx: Context, next: () => Promise<void>) => Promise<void>

/** Bind on egg.Context.jwtState */
export interface JwtState {
  jwtOriginalError: Error
  /** Result */
  user: JsonType
}

