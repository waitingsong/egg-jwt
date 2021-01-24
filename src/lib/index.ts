import type { Jwt } from './jwt'
import { JwtEggConfig, JwtState } from './types'


export * from './config'
export * from './jwt'
export * from './types'
export * from './util'

declare module 'egg' {
  interface Application {
    jwt: Jwt
  }

  interface Agent {
    jwt: Jwt
  }

  interface Context {
    jwtState?: JwtState
  }

  interface EggAppConfig {
    jwt: JwtEggConfig
  }
}

