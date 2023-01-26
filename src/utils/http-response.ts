export class HttpResponse {
    public readonly status: number;
    public readonly message: string;
    public readonly data: any;
    constructor(status: number, message: string, data: any) {
        this.status = status ?? 500;
        this.message = message ?? "";
        this.data = data;
    }
}
