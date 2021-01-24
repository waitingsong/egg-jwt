// eslint-disable-next-line import/no-extraneous-dependencies
import { Application } from 'egg'

import { bindJwtOnAppOrAgent, registerMiddleware } from './lib/bind'
import { JwtEggConfig } from './lib/types'
import { parseConfig } from './lib/util'


/* istanbul ignore next */
export default (app: Application): void => {
  const config: JwtEggConfig = parseConfig(app.config.jwt)

  if (config.appWork) {
    // app.config.jwt = {
    //   ...config,
    // }
    bindJwtOnAppOrAgent(app)
    registerMiddleware(app)
  }
}

