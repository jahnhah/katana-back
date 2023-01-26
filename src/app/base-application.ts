import express from "express";
import { RouteInterface } from "./route.interface";

export abstract class BaseApp {
    protected readonly app!: express.Application;
    constructor() {
        this.app = express();
    }
    abstract configureExternalMiddleware(): void;
    abstract configureMiddleware(): void
    abstract setup(): void;
    abstract configureRoute(routes: RouteInterface[]): void;
}