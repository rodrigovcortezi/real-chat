import { ErrorCode, errorMessages } from './messages'

export class ServiceError extends Error {
  public code: ErrorCode
  public statusCode: number

  constructor(code: ErrorCode, statusCode: number = 422) {
    const message = errorMessages.get(code)
    if (!message) {
      throw new Error(
        'Invalid code argument. Code should be a valid error code',
      )
    }

    super(message)
    this.name = this.constructor.name
    this.code = code
    this.statusCode = statusCode
  }
}

export { ErrorCode }
