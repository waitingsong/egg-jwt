import type { Jwt } from './jwt'
import { JwtConfig, JwtState } from './model'


export * from './config'
export * from './jwt'
export * from './model'
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
    jwt: JwtConfig
  }
}

