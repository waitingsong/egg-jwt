import { initialConfig } from '../lib/config'
import { JwtEggConfig } from '../lib/types'


/* istanbul ignore next */
/**
 * egg-jwt default config
 * @member Config#jwt
 */
export const jwt: JwtEggConfig = {
  ...initialConfig,
}
