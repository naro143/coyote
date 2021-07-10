import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'

type errorData = {
  [key: string]: any
}

class HttpException extends Error {
  statusCode?: number
  message: string
  data: errorData
  constructor(statusCode: number, message: string, data?: errorData) {
    super(message)
    this.statusCode = statusCode || 500
    this.message = message
    this.data = data ? { ...data } : {}
  }
}

export const badRequestException =
  (message = '400 Bad Request', data?: errorData): HttpException => {
    return new HttpException(400, message, data)
};

export const forbiddenException =
  (message = '403 Forbidden', data?: errorData): HttpException => {
    return new HttpException(403, message, data)
};

// Error Handler Middleware
const errorHandler: ErrorRequestHandler = (
  err: HttpException,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // 直接 メッセージだけを入れられないので error {} 内にメッセージ・データを格納する
  res.status(err.statusCode || 500).json({
    message: err.message,
    error: {
      ...err.data
    }
  })
}
export default errorHandler
