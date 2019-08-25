// eslint-disable-next-line import/no-extraneous-dependencies
import { Context } from 'egg'

import {
  AuthenticateOpts,
  EggMiddleware,
  JwtConfig,
  JwtToken,
  JwtTokenDecoded,
  JwtOptions,
  SignSecret,
  VerifySecret,
} from '../../lib/model'
import {
  resolveFromAuthorizationHeader,
  resolveFromCookies,
} from '../../lib/resolvers'
import { JwtMsg } from '../../lib/config'
import { Jwt } from '../../lib/jwt'
import { parseOptions } from '../../lib/util'


/** jwt Middleware Factory */
export default (config: JwtConfig): EggMiddleware => {
  const opts = parseOptions(config.client) // defined out of jwtmw!
  const jwtmw = (ctx: Context, next: () => Promise<void>) => {
    return authenticate(ctx, next, opts)
  }
  return jwtmw
}

async function authenticate(
  ctx: Context,
  next: () => Promise<void>,
  options: JwtOptions,
): Promise<void> {

  const { debug } = options
  const { key, passthrough } = options.authOpts as AuthenticateOpts

  try {
    const token = retrieveToken(ctx, options.authOpts)

    if (! token) {
      ctx.throw(401, JwtMsg.TokenNotFound)
    }

    const secretSet: Set<VerifySecret> = genVerifySecretSet(
      options.secret,
      options.verifySecret,
      ctx.state.secret,
    )

    const decoded = validateToken(ctx.app.jwt, token, secretSet, options)
    ctx.state[key] = decoded
  }
  catch (ex) {
    if (await parseByPassthrough(ctx, passthrough) === true) {
      // lets downstream middlewares handle JWT exceptions
      ctx.state.jwtOriginalError = ex
    }
    else {
      const msg = debug === true ? ex.message : JwtMsg.AuthFailed
      ctx.throw(401, msg, { originalError: ex })
    }
  }

  return next()
}


function retrieveToken(ctx: Context, options?: AuthenticateOpts): JwtToken {
  let token = resolveFromCookies(ctx.cookies, options ? options.cookie : false)

  if (! token) {
    const authorization = ctx.header && ctx.header.authorization
      ? ctx.header.authorization
      : ''
    token = resolveFromAuthorizationHeader(authorization)
  }

  return token
}

/**
 * Generate secrets for verify,
 * Note: use ctxSecret only if available
 */
function genVerifySecretSet(
  signSecret: SignSecret,
  verifySecret?: JwtOptions['verifySecret'],
  ctxSecret?: unknown,
): Set<VerifySecret> {

  if ((typeof ctxSecret === 'string' || Buffer.isBuffer(ctxSecret)) && ctxSecret) {
    return new Set([ctxSecret])
  }

  const signSet = parseSecret(signSecret)
  const verifySet = parseSecret(verifySecret)
  const ret = new Set([...verifySet, ...signSet])

  return ret
}

function parseSecret(input?: JwtOptions['secret'] | JwtOptions['verifySecret']): Set<VerifySecret> {
  const ret: Set<VerifySecret> = new Set()

  if (typeof input === 'string') {
    ret.add(input)
  }
  else if (Buffer.isBuffer(input)) {
    ret.add(input)
  }
  else if (Array.isArray(input)) {
    input.forEach((secret) => {
      ret.add(secret)
    })
  }

  return ret
}


function validateToken(
  jwtImpl: Jwt,
  token: JwtToken,
  secretSet: Set<VerifySecret>,
  config: JwtOptions,
): JwtTokenDecoded {

  if (! secretSet.size) {
    throw new Error(JwtMsg.VSceretInvalid)
  }

  // eslint-disable-next-line @typescript-eslint/unbound-method
  if (typeof jwtImpl.verify !== 'function') {
    throw new TypeError(JwtMsg.VerifyNotFunc)
  }

  let ret: JwtTokenDecoded | null = null
  const msgs: string[] = []
  Array.from(secretSet).some((secret) => {
    try {
      const decoded = jwtImpl.verify(token, secret, config.verifyOpts)
      ret = decoded
      return true
    }
    catch (ex) {
      const ss = typeof secret === 'string' ? secret : secret.toString()
      const start = ss.slice(0, 2)
      const end = ss.length > 5 ? ss.slice(-2) : '**'
      const msg = ex.message ? ex.message.toString() : ''
      msgs.push(`${msg}: with secret "${start}****${end}"`)
    }
  })

  if (ret === null) {
    throw new Error(JwtMsg.TokenValidFailed + ':\n' + msgs.join('\n'))
  }
  return ret
}


/** Compute passthrough state */
async function parseByPassthrough(
  ctx: Context,
  passthrough: AuthenticateOpts['passthrough'],
): Promise<boolean> {

  if (passthrough === true) {
    return true
  }
  else if (typeof passthrough === 'function') {
    return passthrough(ctx)
  }
  else {
    return false
  }
}

// only for npm run cov
declare module 'egg' {
  interface Application {
    jwt: Jwt
  }
}

