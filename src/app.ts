// eslint-disable-next-line import/no-extraneous-dependencies
import { Application } from 'egg'

import { bindJwtOnAppOrAgent, registerMiddleware } from './lib/bind'
import { JwtConfig } from './lib/model'
import { parseConfig } from './lib/util'


/* istanbul ignore next */
export default (app: Application): void => {
  const config: JwtConfig = parseConfig(app.config.jwt)

  if (config.appWork) {
    app.config.jwt = {
      ...config,
    }
    bindJwtOnAppOrAgent(app)
    registerMiddleware(app)
  }
}

