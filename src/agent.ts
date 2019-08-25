// eslint-disable-next-line import/no-extraneous-dependencies
import { Agent } from 'egg'

import { bindJwtOnAppOrAgent } from './lib/bind'
import { JwtConfig } from './lib/model'


/* istanbul ignore next */
export default (agent: Agent) => {
  const jwtConfig: JwtConfig = agent.config.jwt

  jwtConfig.agent && bindJwtOnAppOrAgent(agent)
}
