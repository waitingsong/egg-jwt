import { JsonObject } from '@waiting/shared-types'


export const secret = '123456abc'

/** Type with index signature */
export interface PayloadSig1 {
  foo: string
  iat: number
  [index: string]: string | number
}
/** Type extends from JsonType */
export interface PayloadExt1 extends JsonObject {
  foo: string
  iat: number
}


export const payload1 = { foo: 'bar', iat: 1566629919 }
export const signature1 = 'PZkACzct30IcrymoodYlW0LW0Fc1r6Hs1l8yOZSeNpk'
export const token1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.'
  + 'eyJmb28iOiJiYXIiLCJpYXQiOjE1NjY2Mjk5MTl9.'
  + signature1

export const payload2 = { foo: 'bar' }
export const tokenHeader2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'

export const testRedirectURL = Math.random().toString()

