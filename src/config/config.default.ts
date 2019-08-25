import { JwtConfig } from '../lib/model'
import { initialConfig } from '../lib/config'


/* istanbul ignore next */
/**
 * egg-jwt default config
 * @member Config#jwt
 */
export const jwt: JwtConfig = {
  ...initialConfig,
}
