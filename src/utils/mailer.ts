import logger from "./logger"
import sgMail, { MailDataRequired } from '@sendgrid/mail'
import { User } from "../models/user.model";


export async function sendMail(payload: MailDataRequired) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? '');
    sgMail.send(payload).then(() => {
        logger.info("mail sent");
    }).catch((error) => {
        console.error(error)
    });
}

export async function sendVerificationMail(user: User): Promise<void> {
    await sendMail({
        to: {
            email: user.email,
            name: user.lastName
        },
        from: {
            email: process.env.MAIL_SENDER ?? '',
            name: 'WeRenov'
        },
        subject: 'Please verify your account',
        templateId: 'd-063cfef015d94f6897fb8c7f2c682dd4',
        dynamicTemplateData: {
            name: user.lastName,
            code: user.verificationCode.code
        }
    });
}

export async function sendPasswordRecoveryMail(user: User): Promise<void> {
    await sendMail({
        to: {
            email: user.email,
            name: user.lastName
        },
        from: {
            email: process.env.MAIL_SENDER ?? '',
            name: 'WeRenov'
        },
        subject: 'WeRenov password recovery code',
        templateId: 'd-063cfef015d94f6897fb8c7f2c682dd4',
        dynamicTemplateData: {
            name: user.lastName,
            code: user.passwordResetCode.code
        }
    });
}