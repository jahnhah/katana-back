import { Request, Response, NextFunction } from "express"
import { HttpException } from "../utils/http-exception"

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    let errorStatus = 500;
    const errorMessage = err.message
    if (err instanceof HttpException) {
        errorStatus = err.status
    }
    return res.status(errorStatus).json({
        status: errorStatus,
        data: null,
        message: errorMessage,
        stacktrace: process.env.NODE_ENV == 'development' ? err.stack : ''
    })

}