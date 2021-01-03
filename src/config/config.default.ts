import { initialConfig } from '../lib/config'
import { JwtConfig } from '../lib/model'


/* istanbul ignore next */
/**
 * egg-jwt default config
 * @member Config#jwt
 */
export const jwt: JwtConfig = {
  ...initialConfig,
}
