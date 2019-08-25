import { AuthenticateOpts, JwtConfig, JwtOptions } from './model'


export const pluginName = 'jwt'
export const middlewareName = 'jwt'

export const initialAuthOpts: AuthenticateOpts = {
  cookie: false,
  key: 'user',
  passthrough: false,
}
export const initialJwtOptions: Required<JwtOptions> = {
  authOpts: { ...initialAuthOpts },
  debug: false,
  secret: '',
  decodeOpts: {},
  signOpts: {},
  verifySecret: '',
  verifyOpts: {},
}

export const initialConfig: JwtConfig = {
  agent: false,
  client: { ...initialJwtOptions },
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

