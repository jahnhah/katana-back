import { Request, Response, NextFunction } from "express"
import { CreateUserInput, PasswordRecoveryInput, PasswordResetInput, VerifyUserInput } from "schema/user.schema"
import { sendPasswordRecoveryMail, sendVerificationMail } from "../utils/mailer"
import { createUser, findUserByEmail, findUserById } from '../services/user.service'
import logger from '../utils/logger'
import { createVerificationCode, getNowAsTimestamp } from "../utils/micro.utils"
import { HttpException } from "../utils/http-exception"
import { HttpResponse } from "../utils/http-response"
import { sendVerificationSms } from "../utils/sms-utils"
export const createUserHandler = async (req: Request<{}, {}, CreateUserInput>, res: Response, next: NextFunction) => {

    const body = req.body;
    try {
        const user = await createUser(body);
        await sendVerificationMail(user);
        await sendVerificationSms(user);
        return res.status(201).json(new HttpResponse(201, 'user has been created', user));
    }
    catch (e: any) {
        console.log(e);
        if (e.code === 11000) {
            return next(new HttpException(409, 'User already exists'));
        }
        return next(new HttpException(500, 'Something went wrong'));
    }
}

export const verifyUserHandler = async (req: Request<{}, {}, {}, VerifyUserInput>, res: Response, next: NextFunction) => {
    const id = req.query.id;
    const providedCode = req.query.verificationCode;
    let user;
    // find the user by id
    try {
        user = await findUserById(id);
    } catch (e: any) {
        return next(new HttpException(500, e.message));
    }


    if (!user) {
        return next(new HttpException(404, 'Could not find user'));
    }

    // verify if user is already verified
    if (user.verified) {
        return next(new HttpException(401, 'User already verified'));
    }

    // verify if the code provided is valid
    const { code, expiresAt } = user.verificationCode;
    if (expiresAt && expiresAt?.gt(getNowAsTimestamp()) && code == providedCode) {
        user.verified = true;
        user.verificationCode = { code: null, expiresAt: null };
        await user.save();
        return res.status(200).json(new HttpResponse(200, 'User verified', null));
    }
    return next(new HttpException(400, 'could not verify user'));
}


export const passwordRecoveryHandler = async (req: Request<{}, {}, PasswordRecoveryInput>, res: Response, next: NextFunction) => {
    const email: string = req.body.email;
    let user;
    try {

        user = await findUserByEmail(email);
        const message = `Verification code sent to :${email}`;
        if (!user) {
            logger.info(`User with email :${email} does not exist`);
            // to fool them to not distinct the registered user
            return res.status(200).json(new HttpResponse(200, message, null));
        }
        if (!user.verified) {
            return next(new HttpException(403, 'User not verified yet'));
        }
        // email if user exist we set the passwordResetCode
        user.passwordResetCode = createVerificationCode();
        user.save();

        await sendPasswordRecoveryMail(user);
        logger.info(`Password reset sent to ${user.email}`);
        return res.status(200).json(new HttpResponse(200, message, null));
    } catch (e: any) {
        return next(new HttpException(500, 'Something went wrong'));
    }
}

export const passwordResetHandler = async (req: Request<PasswordResetInput['params'], {}, PasswordResetInput['body']>, res: Response, next: NextFunction) => {
    const { id, passwordResetCode } = req.params;
    const password = req.body.password;
    try {
        const user = await findUserById(id);
        if (!user || passwordResetCode != user.passwordResetCode.code || user.passwordResetCode.expiresAt?.lessThan(getNowAsTimestamp())) {
            return next(new HttpException(400, 'could not reset user password'));
        }
        user.passwordResetCode = { code: null, expiresAt: null };
        user.password = password;
        user.save();
        return res.status(204).json(new HttpResponse(204, 'user password successfully reset', null));
    } catch (e: any) {
        return next(e);

    }
}

export async function getCurrentUserHandler(req: Request, res: Response, next: NextFunction) {
    if (res.locals.user) {
        return res.json(new HttpResponse(200, '', res.locals.user));
    } else {
        return next(new HttpException(404, 'user not found'));
    }
}