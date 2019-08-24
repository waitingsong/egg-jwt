import { JwtConfig } from '../lib/model'
import { initialConfig } from '../lib/config'


/**
 * egg-jwt default config
 * @member Config#jwt
 */
export const jwt: JwtConfig = {
  ...initialConfig,
}
