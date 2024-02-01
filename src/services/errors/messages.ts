export enum ErrorCode {
  EMAIL_ALREADY_REGISTERED = 'EMAIL_ALREADY_REGISTERED',
}

export const errorMessages = new Map<ErrorCode, string>([
  [ErrorCode.EMAIL_ALREADY_REGISTERED, 'Email already in use'],
])
