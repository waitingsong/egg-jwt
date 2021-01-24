// eslint-disable-next-line node/no-unpublished-import
import { JwtEggConfig } from '../../../../dist/index'


export const keys = '123456'

export const jwt: JwtEggConfig = {
  enable: false,
  client: {
    secret: '123456', // 默认密钥，生产环境一定要更改
  },
  // rule https://github.com/eggjs/egg-path-matching
  ignore: [],
}

