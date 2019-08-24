// eslint-disable-next-line import/no-extraneous-dependencies
import { Application } from 'egg'

import { bindJwtOnAppOrAgent, registerMiddleware } from './lib/bind'


export default (app: Application) => {
  bindJwtOnAppOrAgent(app)
  registerMiddleware(app)
}
