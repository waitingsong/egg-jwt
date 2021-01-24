// eslint-disable-next-line node/no-unpublished-import
import { JwtEggConfig } from '../../../../dist/index'


export const keys = '123456'

export const jwt: JwtEggConfig = {
  enable: true,
  client: {
    secret: '123456',
  },
  // rule https://github.com/eggjs/egg-path-matching
  ignore: ['/ping', '/swagger-u*'],
}

