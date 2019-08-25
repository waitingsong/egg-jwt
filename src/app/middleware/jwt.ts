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
import { resolveFromAuthorizationHeader, resolveFromCookies } from '../../lib/resolvers'
import { initialJwtOptions } from '../../lib/config'
import { Jwt } from '../../lib/jwt'


export default (config: JwtConfig): EggMiddleware => {
  const jwtmw = (ctx: Context, next: () => Promise<void>) => {
    const opts: Required<JwtOptions> = {
      ...initialJwtOptions,
      ...config.client,
    }
    return authenticate(ctx, next, opts)
  }
  return jwtmw
}

async function authenticate(
  ctx: Context,
  next: () => Promise<void>,
  options: Required<JwtOptions>,
): Promise<void> {

  const { debug } = options
  const { key, passthrough } = options.authOpts

  try {
    const token = retrieveToken(ctx, options.authOpts)

    if (! token) {
      ctx.throw(401, debug ? 'Token not found' : 'Authentication Failed')
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
      const msg = debug === true ? ex.message : 'Authentication Failed'
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

  if (token) {
    return token
  }
  else {
    if (options && options.passthrough === true) {
      return ''
    }
    ctx.throw(401, 'Invalid Authorization header format. Format is "Authorization: Bearer <token>". token not found in Cookies or Header')
  }
  return ''
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
    throw new Error('VerifySecret not provided')
  }

  // eslint-disable-next-line @typescript-eslint/unbound-method
  if (typeof jwtImpl.verify !== 'function') {
    throw new TypeError('jwt.verify is not a function')
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
    throw new Error('Token validation failed:\n' + msgs.join('\n'))
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

