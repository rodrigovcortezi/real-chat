export enum ErrorCode {
  EMAIL_ALREADY_REGISTERED = 'EMAIL_ALREADY_REGISTERED',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
}

export const errorMessages = new Map<ErrorCode, string>([
  [ErrorCode.EMAIL_ALREADY_REGISTERED, 'Email already in use'],
  [ErrorCode.INVALID_PASSWORD, 'Invalid password'],
  [ErrorCode.INVALID_CREDENTIALS, 'Incorrect email or password'],
])
