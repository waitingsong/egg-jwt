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
