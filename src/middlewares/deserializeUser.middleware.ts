import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../utils/jwt.utils";

const deserializeUser=async(req:Request,res:Response,next:NextFunction)=>{
    const accessToken=(req.headers.authorization||'').replace(/^Bearer\s/,'');
    if(!accessToken){
        return next();
    }

    const decoded=verifyJwt(accessToken,"accessTokenPublicKey");
    if(decoded){
        res.locals.user=decoded;
    }
    next()

}
export default deserializeUser;