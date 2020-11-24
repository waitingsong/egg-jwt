// eslint-disable-next-line import/no-extraneous-dependencies
import { Application } from 'egg'

import { bindJwtOnAppOrAgent, registerMiddleware } from './lib/bind'


/* istanbul ignore next */
export default (app: Application): void => {
  bindJwtOnAppOrAgent(app)
  registerMiddleware(app)
}
