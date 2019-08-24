// eslint-disable-next-line import/no-extraneous-dependencies
import { Context } from 'egg'

import { JwtToken, AuthenticateOpts } from './model'
import { schemePrefix } from './config'


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
): JwtToken {

  const token = cookieKey && cookieKey.length > 0
    ? cookies.get(cookieKey)
    : ''
  return token
}
