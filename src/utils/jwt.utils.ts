import jwt from "jsonwebtoken"
import config from "config"
export function signJwt(
    object: Object,
    keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivatekey',
    options?: jwt.SignOptions) {
        const tokenFromEnv:string=process.env[config.get<string>(keyName)]??'';
        const signinKey = Buffer.from(tokenFromEnv,"base64").toString("ascii");
        return jwt.sign(object, signinKey, {
            ...(options && options),
            algorithm: 'RS256'
        });
}

export function verifyJwt<T>(
    token:string,
    keyName: 'accessTokenPublicKey' | 'refreshTokenPublickey') :T|null{
    const tokenFromEnv:string=process.env[config.get<string>(keyName)]??'';
    const publicKey=Buffer.from(tokenFromEnv,'base64').toString('ascii');

    try{
        const decoded=jwt.verify(token,publicKey) as T;
        return decoded;
    }
    catch(e){
        return null;
    }
}