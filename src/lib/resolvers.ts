/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Context } from 'egg'

import { schemePrefix } from './config'
import { JwtToken, AuthenticateOpts } from './types'


/**
 *
 * Note: trim trailing white space from cookies/header
 * according to node.js security since v10.19, v12.15
 * @link https://nodejs.org/en/blog/vulnerability/february-2020-security-releases/
 */
export function retrieveToken(ctx: Context, options?: AuthenticateOpts): JwtToken {
  let token = resolveFromCookies(ctx.cookies, options ? options.cookie : false)

  if (token) {
    token = token.trimEnd()
  }

  /* istanbul ignore else */
  if (! token) {
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    let authorization: string = ctx.header && ctx.header.authorization
      ? ctx.header.authorization
      : ''
    if (authorization) {
      authorization = authorization.trimEnd()
      token = resolveFromAuthorizationHeader(authorization)
    }
    else {
      token = ''
    }
  }

  return token ? token : ''
}


/**
 * Attempts to parse the token from the Authorization header,
 * This function checks the Authorization header for a `Bearer <token>` pattern and return the token section
 *
 * @param authorization from ctx.header.authorization
 */
export function resolveFromAuthorizationHeader(authorization: string): JwtToken {
  if (typeof authorization !== 'string' || ! authorization) {
    return ''
  }

  const parts = authorization.split(/ +/u)

  if (parts.length === 2) {
    const [scheme, credentials] = parts

    if (scheme && scheme === schemePrefix) {
      return credentials
    }
  }

  return ''
}


/**
 * Attempts to retrieve the token from a cookie,
 * This function uses the opts.cookie option to retrieve the token
 */
export function resolveFromCookies(
  cookies: Context['cookies'],
  cookieKey?: AuthenticateOpts['cookie'],
): JwtToken | undefined {

  const token = cookieKey && cookieKey.length > 0
    ? cookies.get(cookieKey)
    : ''
  return token
}
