# [egg-jwt](https://waitingsong.github.io/egg-jwt/)

[jwt](https://www.npmjs.com/package/@waiting/egg-jwt) siging,
verifying and authentication for midway/egg framework.


[![Version](https://img.shields.io/npm/v/@waiting/egg-jwt.svg)](https://www.npmjs.com/package/@waiting/egg-jwt)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![](https://img.shields.io/badge/lang-TypeScript-blue.svg)
[![ci](https://github.com/waitingsong/egg-jwt/workflows/ci/badge.svg)](https://github.com/waitingsong/egg-jwt/actions?query=workflow%3A%22ci%22)
[![codecov](https://codecov.io/gh/waitingsong/egg-jwt/branch/master/graph/badge.svg?token=oe8oDJp6Ol)](https://codecov.io/gh/waitingsong/egg-jwt)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)


## Installation
```sh
npm install @waiting/egg-jwt
```


## Configuration

### Enable Plugin

Edit `${app_root}/src/config/plugin.ts`:

```ts
export const jwt = {
  enable: true,
  package: '@waiting/egg-jwt',
}
```

### Add Configurations

```ts
/* location: ${app_root}/src/config/config.${env}.ts */

import { JwtEggConfig } from '@waiting/egg-jwt'

export const jwt: JwtEggConfig = {
  agent: false,
  enable: true, // enable middleware
  client: {
    debug: false,
    secret: '123456abc',
  },
  // https://github.com/eggjs/egg-path-matching 
  ignore: ['/signup', '/login'],
}
```


## Usage

```ts
import { Provide, Plugin } from '@midwayjs/decorator'
import { Jwt } from '@waiting/egg-jwt'
import assert from 'assert'

@provide()
export class UserService {

  constructor(
    @plugin() private readonly jwt: Jwt,
  ) { }

  @get('/siginup')
  public signup(ctx: Context) {
    const payload = { foo: 'bar', iat: 1566629919 }
    const token = this.jwt.sign(payload)
    const valid = this.jwt.verify(token)
    assert.deepStrictEqual(valid, payload)
    ctx.body = `\nToken: ${token}`
  }

  @get('/')
  public index(ctx: Context): void {
    ctx.body = `\nPayload: ${ctx.jwtState && ctx.jwtState.user ? JSON.stringify(ctx.jwtState.user) : 'Not found'}`
  }

}
```

Then:
```sh
curl -I 127.0.0.1:7001
// response HTTP/1.1 401 Unauthorized

curl 127.0.0.1:7001/signup
// response ends with signature 'PZkACzct30IcrymoodYlW0LW0Fc1r6Hs1l8yOZSeNpk'

curl 127.0.0.1:7001/ \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIiLCJpYXQiOjE1NjY2Mjk5MTl9.PZkACzct30IcrymoodYlW0LW0Fc1r6Hs1l8yOZSeNpk"
// response payload: {"foo":"bar","iat":1566629919}
```


## License
[MIT](LICENSE)


### Languages
- [English](README.md)
- [中文](README.zh-CN.md)
