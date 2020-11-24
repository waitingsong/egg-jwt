# [egg-jwt](https://waitingsong.github.io/egg-jwt/)

[jwt](https://www.npmjs.com/package/@waiting/egg-jwt) 签名、校验、认证，用于 midway/egg 框架 .


[![Version](https://img.shields.io/npm/v/@waiting/egg-jwt.svg)](https://www.npmjs.com/package/@waiting/egg-jwt)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![](https://img.shields.io/badge/lang-TypeScript-blue.svg)
[![Build Status](https://travis-ci.org/waitingsong/egg-jwt.svg?branch=master)](https://travis-ci.org/waitingsong/egg-jwt)
[![Build status](https://ci.appveyor.com/api/projects/status/drantuhjovv52yms/branch/master?svg=true)](https://ci.appveyor.com/project/waitingsong/egg-jwt/branch/master)
[![Coverage Status](https://coveralls.io/repos/github/waitingsong/egg-jwt/badge.svg?branch=master)](https://coveralls.io/github/waitingsong/egg-jwt?branch=master)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)


## 安装
```sh
npm install @waiting/egg-jwt
```


## 配置

### 开启插件

Edit `${app_root}/src/config/plugin.ts`:

```ts
import { EggPlugin } from 'midway'

export const jwt = {
  enable: true,
  package: '@waiting/egg-jwt',
}

// OR
export default {
  jwt: {
    enable: true,
    package: '@waiting/egg-jwt',
  },
} as EggPlugin
```

### Add Configurations

```ts
/* location: ${app_root}/src/config/config.${env}.ts */

import { JwtConfig } from '@waiting/egg-jwt'

export const jwt: JwtConfig = {
  agent: false,
  enable: true, // enable middleware
  client: {
    debug: false,
    secret: '123456abc',
  },
  ignore: ['/signup', '/login'],
}
```


## 使用

```ts
import { provide, plugin } from 'midway'
import { Jwt } from '@waiting/egg-jwt'
import * as assert from 'assert'

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
    ctx.body = `\nPayload: ${ctx.jwtState && ctx.jwtState.data.user ? JSON.stringify(ctx.jwtState.data.user) : 'Not found'}`
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
