import { JwtConfig, JwtOptions } from './model'


export const pluginName = 'jwt'
export const middlewareName = 'jwt'

export const initialJwtOptions: Readonly<JwtOptions> = {
  debug: false,
}

export const initialConfig: Readonly<JwtConfig> = {
  appMiddlewareIndex: -1,
  appWork: true,
  agent: false,
  client: { debug: false },
  enable: false,
}

export const schemePrefix = 'Bearer'

export enum JwtMsg {
  AuthFailed = 'Authentication Failed',
}

