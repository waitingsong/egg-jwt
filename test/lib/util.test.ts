/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { basename } from '@waiting/shared-core'

import { parseConfig, initialEggConfig, JwtEggConfig as PluginConfig } from '../../src/index'

// eslint-disable-next-line import/order
import assert = require('power-assert')


const filename = basename(__filename)

describe(filename, () => {
  describe('Should util works', () => {
    it('normal', () => {
      const arr = [
        {
          agent: true,
          appWork: true,
          client: {
            debug: false,
          },
        },
        {
          agent: true,
          appWork: false,
          client: {
            debug: false,
          },
        },
        {
          appWork: true,
          client: {
            debug: false,
          },
        },
        {
          appWork: true,
        },
        {},
      ]

      // @ts-expect-error
      arr.forEach((pconfig: PluginConfig) => {
        const ret = parseConfig(pconfig)

        if (typeof pconfig.agent === 'undefined') {
          assert(ret.agent === initialEggConfig.agent)
        }
        else {
          assert(ret.agent === !! pconfig.agent)
        }

        if (typeof pconfig.appWork === 'undefined') {
          assert(ret.appWork === initialEggConfig.appWork)
        }
        else {
          assert(ret.appWork === !! pconfig.appWork)
        }

        if (! pconfig.client) {
          assert(ret.client.debug === initialEggConfig.client.debug)
        }
        else {
          assert(ret.client.debug === pconfig.client.debug)
        }
      })
    })
  })
})

