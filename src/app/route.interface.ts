import express from 'express'
export interface RouteInterface {
    url: string,
    route: express.Router
}