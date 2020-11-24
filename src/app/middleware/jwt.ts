// eslint-disable-next-line import/no-extraneous-dependencies
import { Context } from 'egg'

import {
  AuthenticateOpts,
  EggMiddleware,
  JwtConfig,
  JwtToken,
  JwtDecodedPayload,
  JwtOptions,
  SignSecret,
  VerifySecret,
  RedirectURL,
  JwtState,
} from '../../lib/model'
import { retrieveToken } from '../../lib/resolvers'
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
  const { passthrough } = options.authOpts as AuthenticateOpts

  if (! ctx.jwtState) {
    ctx.jwtState = { } as JwtState
  }
  if (! ctx.state) {
    ctx.state = { }
  }

  try {
    const token = retrieveToken(ctx, options.authOpts)

    /* istanbul ignore else */
    if (! token) {
      ctx.throw(401, JwtMsg.TokenNotFound)
    }

    const secretSet: Set<VerifySecret> = genVerifySecretSet(
      options.secret,
      options.verifySecret,
      ctx.state ? ctx.state.secret : void 0,
    )

    const decoded = validateToken(ctx.app.jwt, token, secretSet, options)
    ctx.jwtState.user = decoded
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    ctx.state.user = decoded
  }
  catch (ex) {
    const pass = await parseByPassthrough(ctx, passthrough)
    if (pass === true) {
      // lets downstream middlewares handle JWT exceptions
      ctx.state.jwtOriginalError = ex
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      ctx.state.jwtOriginalError = ex as Error
    }
    else if (typeof pass === 'string' && pass.length > 0) {
      ctx.redirect(pass)
      return
    }
    else {
      const msg = debug === true ? ex.message : JwtMsg.AuthFailed
      ctx.throw(401, msg, { originalError: ex })
    }
  }

  return next()
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

  /* istanbul ignore else */
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

  /* istanbul ignore else */
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
): JwtDecodedPayload {

  /* istanbul ignore next */
  if (! secretSet.size) {
    throw new Error(JwtMsg.VSceretInvalid)
  }

  /* istanbul ignore next */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  if (typeof jwtImpl.verify !== 'function') {
    throw new TypeError(JwtMsg.VerifyNotFunc)
  }

  let ret: JwtDecodedPayload | null = null
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

  /* istanbul ignore else */
  if (ret === null) {
    throw new Error(JwtMsg.TokenValidFailed + ':\n' + msgs.join('\n'))
  }
  return ret as JwtDecodedPayload
}


/** Compute passthrough state */
async function parseByPassthrough(
  ctx: Context,
  input: AuthenticateOpts['passthrough'],
): Promise<boolean | RedirectURL> {

  switch (typeof input) {
    case 'boolean':
      return input

    case 'string':
      return input

    case 'function':
      return input(ctx)

    default:
      return false
  }
}

// only for npm run cov
declare module 'egg' {
  interface Application {
    jwt: Jwt
  }
}

