
export const secret = '123456abc'

export const payload1 = { foo: 'bar', iat: 1566629919 }
export const signature1 = 'PZkACzct30IcrymoodYlW0LW0Fc1r6Hs1l8yOZSeNpk'
export const token1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.'
  + 'eyJmb28iOiJiYXIiLCJpYXQiOjE1NjY2Mjk5MTl9.'
  + signature1

export const payload2 = { foo: 'bar' }
export const tokenHeader2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'

export const testRedirectURL = Math.random().toString()

