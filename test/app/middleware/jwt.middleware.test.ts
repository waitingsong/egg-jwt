/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { basename } from '@waiting/shared-core'
import { Context } from 'egg'
import * as mm from 'egg-mock'
import * as request from 'supertest'

import { JwtMsg, JwtEggConfig } from '../../../src/index'
import { jwt as jwtConfig } from '../../fixtures/test-1/config/config.default'

// eslint-disable-next-line import/order
import assert = require('power-assert')


const filename = basename(__filename)

describe(filename, () => {
  let app
  let agent

  before(() => {
    // @ts-expect-error
    app = mm.app({
      baseDir: 'test-1',
    })
    return app.ready()
  })
  beforeEach(() => {
    agent = request.agent(app.callback())
  })
  // @ts-expect-error
  afterEach(mm.restore)
  after(() => app.close())


  it('should config correct', () => {
    assert(app.config && app.config.jwt)
    const config = app.config.jwt as JwtEggConfig
    assert(! config.agent === ! jwtConfig.agent)
    assert(! config.enable === ! jwtConfig.enable)
  })

  it('should get a ctx', () => {
    const ctx = app.mockContext()
    assert(ctx.method === 'GET')
    assert(ctx.url === '/')
  })


  it('should GET / ', async () => {
    const resp = await app.httpRequest()
      .get('/')
      .expect(401)
  })


  it('should GET /ping', async () => {
    const resp = await app.httpRequest()
      .get('/ping')
      .expect(200)
      .expect('hi, jwt')

    assert(resp)
  })

})

