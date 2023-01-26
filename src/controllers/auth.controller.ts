import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { verifyJwt } from "../utils/jwt.utils";
import { CreateSessionInput } from "../schema/auth.schema";
import { findSessionById, signAccessToken, signRefreshToken } from "../services/auth.service";
import { findUserByEmail, findUserById } from "../services/user.service";
import { HttpException } from "../utils/http-exception";
import { HttpResponse } from "../utils/http-response";

export async function createSessionHandler(req: Request<{}, {}, CreateSessionInput>, res: Response, next: NextFunction) {
    const message = "Invalid email or password";

    const { email, password } = req.body;
    const user = await findUserByEmail(email);

    if (!user) {
        next(new HttpException(400, message));
    }

    if (!user?.verified) {
        return next(new HttpException(400, "please verify your account"));
    }

    const isValid = await user.validatePassword(password);

    if (!isValid) {
        return next(new HttpException(400, message));
    }

    // sign an access token
    const accessToken = signAccessToken(user);

    // sign a refresh token
    const refreshToken = await signRefreshToken({ userId: user._id });

    // send tokens
    return res.json(new HttpResponse(200, 'success', {
        accessToken,
        refreshToken
    }));

}

export async function refreshAccessTokenHandler(req: Request, res: Response, next: NextFunction) {
    const refreshToken = get(req, 'headers.x-refresh');
    const decoded = verifyJwt<{ session: string }>(refreshToken, 'refreshTokenPublickey');
    if (!decoded) {
        return next(new HttpException(401, "could not refresh token"));
    }

    const session = await findSessionById(decoded.session);

    if (!session || !session.valid) {
        return next(new HttpException(401, "could not refresh token"));
    }

    const user = await findUserById(String(session.user));

    if (!user) {
        return next(new HttpException(401, "could not refresh token"));
    }

    const accessToken = signAccessToken(user);
    res.status(200).json(new HttpResponse(200, 'success', { accessToken }));
}