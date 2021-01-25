import assert from 'assert'

// eslint-disable-next-line import/no-extraneous-dependencies
import { Agent, Application } from 'egg'

import { pluginName, middlewareName } from './config'
import { Jwt } from './jwt'
import { ClientOptions } from './types'
import { parseOptions } from './util'


export function bindJwtOnAppOrAgent(app: Application | Agent): void {
  app.addSingleton(pluginName, createOneClient)
}

function createOneClient(options: ClientOptions, app: Application | Agent): Jwt {
  const opts: ClientOptions = parseOptions(options)
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  assert(opts && Object.keys(opts).length, `[egg-${pluginName}] config empty`)

  const client = new Jwt(opts)
  app.coreLogger.info(`[egg-${pluginName}] instance status OK`)

  return client
}

export function registerMiddleware(app: Application): void {
  const { config } = app
  const { appMiddlewareIndex } = config.jwt

  assert(typeof appMiddlewareIndex === 'number')
  assert.strictEqual(
    (config.appMiddleware as unknown[]).includes(middlewareName),
    false,
    `Duplication of middleware name found: ${middlewareName}. Rename your middleware other than "${middlewareName}".`,
  )

  assert(Array.isArray(config.appMiddleware))
  if (appMiddlewareIndex >= 0) {
    config.appMiddleware.splice(appMiddlewareIndex, 0, middlewareName)
  }
  else {
    config.appMiddleware.push(middlewareName)
  }
}

