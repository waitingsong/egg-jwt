// eslint-disable-next-line node/no-unpublished-import
import { JwtConfig } from '../../../../dist/index'


export const keys = '123456'

// jwt配置
export const jwt: JwtConfig = {
  enable: true,
  client: {
    debug: false,
  },
  // rule https://github.com/eggjs/egg-path-matching
  ignore: ['/ping', '/swagger-u*'],
}

