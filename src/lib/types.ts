import { JsonType } from '@waiting/shared-types'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Context } from 'egg'


export interface JwtEggConfig {
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
  client: ClientOptions
  /**
   * Switch middleware works for egg.js, if afforded.
   * Default: false
   */
  enable: boolean
  /**
   * Match and ignore are exclusive exists, for egg.js.
   * Default: undefined for matching all routings
   * Caution: '/' will match all, /^\/$/ matches only root !
   * @see https://github.com/eggjs/egg-path-matching
   */
  match?: MiddlewarePathPattern
  /**
   * Match and ignore are exclusive exists, for egg.js.
   * Caution: '/' will match all, /^\/$/ matches only root !
   */
  ignore?: MiddlewarePathPattern
}

export interface ClientOptions {
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

