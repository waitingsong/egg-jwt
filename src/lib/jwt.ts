/* eslint-disable @typescript-eslint/no-explicit-any */
import assert from 'assert'

import { JwtOptions } from './types'
import { parseOptions } from './util'


export class Jwt {

  private readonly config: JwtOptions

  constructor(config: JwtOptions) {
    this.config = parseOptions(config)
  }

  foo(input: string): string {
    /* istanbul ignore next */
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (! this) { throw new TypeError('Should call with class name, such as jwt.foo()') }

    assert(this.config)

    const ret = input + 'ok'
    return ret
  }

}

