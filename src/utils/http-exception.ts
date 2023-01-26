export class HttpException extends Error {
    public readonly status: number;
    public readonly message: string;
    constructor(status?: number, message?: string) {
        super(message);
        this.status = status ?? 500;
        this.message = message ?? "something went wrong";
    }
}

export const createHttpException = (status: number, message: string) => {
    const err: Error = new HttpException(status, message)
    return err
}