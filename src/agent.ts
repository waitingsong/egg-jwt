// eslint-disable-next-line import/no-extraneous-dependencies
import { Agent } from 'egg'

import { bindJwtOnAppOrAgent } from './lib/bind'
import { pluginName } from './lib/config'
import { JwtEggConfig } from './lib/types'
import { parseConfig } from './lib/util'


/* istanbul ignore next */
export default (agent: Agent): void => {
  const config: JwtEggConfig = parseConfig(agent.config[pluginName])

  agent.config[pluginName].agent = !! config.agent

  if (config.agent) {
    bindJwtOnAppOrAgent(agent)
  }
}

