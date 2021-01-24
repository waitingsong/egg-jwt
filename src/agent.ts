// eslint-disable-next-line import/no-extraneous-dependencies
import { Agent } from 'egg'

import { bindJwtOnAppOrAgent } from './lib/bind'
import { JwtEggConfig } from './lib/types'
import { parseConfig } from './lib/util'


/* istanbul ignore next */
export default (agent: Agent): void => {
  const config: JwtEggConfig = parseConfig(agent.config.jwt)

  if (config.agent) {
    // agent.config.jwt = {
    //   ...config,
    // }
    bindJwtOnAppOrAgent(agent)
  }
}

