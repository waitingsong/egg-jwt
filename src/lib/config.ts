import { AuthenticateOpts, JwtConfig, JwtOptions } from './model'


export const pluginName = 'jwt'
export const middlewareName = 'jwt'

export const initialAuthOpts: Readonly<AuthenticateOpts> = {
  cookie: false,
  key: 'user',
  passthrough: false,
}
export const initialJwtOptions: Readonly<JwtOptions> = {
  // authOpts: { ...initialAuthOpts },
  debug: false,
  secret: '',
}

export const initialConfig: Readonly<JwtConfig> = {
  agent: false,
  client: { debug: false, secret: '' },
  enable: false,
}

export const schemePrefix = 'Bearer'

export enum JwtMsg {
  AuthFailed = 'Authentication Failed',

  InvalidInput = 'Value of input invalid',
  InvalidInputBuffer = 'Value of input is empty Buffer',
  InvalidInputObject = 'Value of input is invalid Object',
  InvalidInputString = 'Value of input is blank string',

  VerifyNotFunc = 'jwt.verify is not a function',
  TokenNotFound = 'Token not found. Header format is "Authorization: Bearer <token>"',
  TokenValidFailed = 'Token validation failed',
  VSceretInvalid = 'VerifySecret not provided',
}

