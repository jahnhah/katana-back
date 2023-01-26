import dotenv from 'dotenv'
import config from 'config'
import express from "express";
import connect from "../utils/connect"
import logger from '../utils/logger'
import { RouteInterface } from './route.interface';
import { BaseApp } from './base-application';
import { errorMiddleware } from '../middlewares/error.middleware';
import deserializeUser from '../middlewares/deserializeUser.middleware';

export class App extends BaseApp {
    constructor() {
        dotenv.config();
        super();
    }

    configureExternalMiddleware(): void {
        this.app.use(express.json());
        // add here the required middlewares
    }

    configureErrorMiddleware(): void {
        this.app.use(errorMiddleware);
    }

    configureMiddleware(): void {
        this.app.use(deserializeUser);
    }

    configureRoute(routers: RouteInterface[]): void {
        routers.forEach(({ url, route }: RouteInterface) => {
            this.app.use(url, route);
        });
    }

    setup(): void {
        const PORT = config.get<number>('port');
        const APP_URL = config.get<string>('appUrl');

        this.app.listen(PORT, async () => {
            logger.info(`App is running at ${APP_URL}:${PORT}`);
            await connect();
        });
    }

}