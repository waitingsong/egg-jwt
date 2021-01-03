# [egg-plugin-base](https://waitingsong.github.io/egg-plugin-base/)


[![Version](https://img.shields.io/npm/v/@waiting/egg-plugin-base.svg)](https://www.npmjs.com/package/@waiting/egg-plugin-base)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![](https://img.shields.io/badge/lang-TypeScript-blue.svg)
[![Node CI](https://github.com/waitingsong/egg-plugin-base/workflows/ci/badge.svg)](https://github.com/waitingsong/egg-plugin-base/actions?query=workflow%3A%22ci%22)
[![codecov](https://codecov.io/gh/waitingsong/egg-plugin-base/branch/master/graph/badge.svg?token=9hyVmq1GwC)](https://codecov.io/gh/waitingsong/egg-plugin-base)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)


## Installation
```sh
npm install @waiting/egg-plugin-base
```


## Configuration

### Enable Plugin

Edit `${app_root}/src/config/plugin.ts`:

```ts
import { EggPlugin } from 'midway'

export const jwt = {
  enable: true,
  package: '@waiting/egg-plugin-base',
}
```

### Add Configurations

```ts
/* location: ${app_root}/src/config/config.${env}.ts */

import { JwtConfig } from '@waiting/egg-plugin-base'

export const jwt: JwtConfig = {
  agent: false,
  enable: true, // enable middleware
  client: {
    debug: false,
  },
}
```


## Usage

```ts
import { Provide, Plugin } from '@midwayjs/decorator'
import { Jwt } from '@waiting/egg-plugin-base'

@Provide()
export class UserService {

  @Plugin() 
  readonly jwt: Jwt

}
```

## License
[MIT](LICENSE)


### Languages
- [English](README.md)
- [中文](README.zh-CN.md)

