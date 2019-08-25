import * as assert from 'assert'

// eslint-disable-next-line import/no-extraneous-dependencies
import { Agent, Application } from 'egg'

import { pluginName, middlewareName } from './config'
import { Jwt } from './jwt'
import { JwtOptions } from './model'
import { parseOptions } from './util'


export function bindJwtOnAppOrAgent(app: Application | Agent): void {
  app.addSingleton(pluginName, createOneClient)
}

function createOneClient(options: JwtOptions, app: Application | Agent): Jwt {
  const opts: JwtOptions = parseOptions(options)
  assert(opts && Object.keys(opts).length, `[egg-${pluginName}] config empty`)

  const client = new Jwt(opts)
  app.coreLogger.info(`[egg-${pluginName}] instance status OK`)

  return client
}

export function registerMiddleware(app: Application) {
  const { config } = app

  assert.equal(
    (config.appMiddleware as unknown[]).includes(middlewareName),
    false,
    `Duplication of middleware name found: ${middlewareName}. Rename your middleware other than "${middlewareName}".`,
  )

  config.appMiddleware.unshift(middlewareName)
}


declare module 'egg' {
  interface Application {
    jwt: Jwt
  }
  interface Agent {
    jwt: Jwt
  }
}
