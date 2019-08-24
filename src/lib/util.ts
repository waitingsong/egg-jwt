import * as assert from 'assert'

import { JwtToken, JwtPayload, JwtOptions } from './model'


export function validateTokenString(input: JwtToken): void {
  if (typeof input === 'string') {
    assert(input.length > 0)
  }
  else {
    throw new TypeError('Value of input token invalid.')
  }
}


export function validatePayload(input: JwtPayload): void {
  if (typeof input === 'string') {
    assert(input.length > 0, 'Value of secret is blank string.')
    return
  }
  else if (Buffer.isBuffer(input)) {
    assert(input.length > 0, 'Value of secrect is empty Buffer.')
  }
  else if (typeof input === 'object') {
    assert(Object.keys(input).length > 0)
  }
  else {
    throw new TypeError('Value of sign secret is invalid.')
  }

}


export function validateSignSecret(input: JwtOptions['secret']): void {
  if (typeof input === 'string') {
    // throw new Error('Blank value')
    assert(input.length > 0, 'Value of secret is blank string.')
    return
  }
  else if (Buffer.isBuffer(input)) {
    assert(input.length > 0, 'Value of secrect is empty Buffer.')
  }
  else if (typeof input === 'object' && input) {
    assert(Object.keys(input).length > 0)
    assert(typeof input.key === 'string' && input.key.length > 0)
    assert(typeof input.passphrase === 'string')
  }
  else {
    throw new TypeError('Value of sign secret is invalid.')
  }
}


export function validateVerifySecret(input: JwtOptions['verifySecret']): void {
  if (input === false) {
    return
  }
  else if (typeof input === 'string') {
    assert(input.length > 0, 'Value of secret is blank string.')
  }
  else if (Buffer.isBuffer(input)) {
    assert(input.length > 0, 'Value of secrect is empty Buffer.')
  }
  // else if (typeof input === 'function') { // promise callback
  //   return
  // }
  else {
    throw new TypeError('Value of sign secret is invalid.')
  }
}
