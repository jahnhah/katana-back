import { User } from "models/user.model";
import twilio from "twilio";


export async function sendVerificationSms(user: User) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const SystemPhoneNumber = process.env.SYSTEM_PHONE_NUMBER;

    const client = twilio(accountSid, authToken);

    const response = await client.messages.create({
        body: 'Your WeRenov Code: ' + user.verificationCode.code,
        from: SystemPhoneNumber,
        to: user.phoneNumber
    });
    return response;
}