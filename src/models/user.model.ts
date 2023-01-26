import { prop, getModelForClass, modelOptions, Severity, pre, index } from "@typegoose/typegoose"
import bcrypt from 'bcrypt'
import { Timestamp } from "mongodb";
import logger from '../utils/logger'
import { createVerificationCode, randomNumber } from "../utils/micro.utils"

export const privateFields = [
    "password",
    "__v",
    "verificationCode",
    "passwordResetCode",
    "verified"
];

@pre<User>("save", async function () {
    if (!this.isModified("password")) {
        return
    }
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
})
@index({ email: 1 })
@modelOptions({
    options: {
        allowMixed: Severity.ALLOW
    },
    schemaOptions: {
        timestamps: true
    }
})
export class User {
    @prop({ lowercase: true, required: true, unique: true })
    email: string;

    @prop({ required: true })
    firstName: string;

    @prop({ required: true })
    lastName: string;

    @prop({ required: true })
    phoneNumber: string;

    @prop({ required: true })
    password: string;

    @prop({ required: true, default: () => createVerificationCode() })
    verificationCode: {
        code: string | null,
        expiresAt: Timestamp | null
    };

    @prop()
    passwordResetCode: {
        code: string | null,
        expiresAt: Timestamp | null
    }

    @prop({ default: false })
    verified: boolean

    async validatePassword(this: User, candidatePassword: string) {
        try {
            return await bcrypt.compare(candidatePassword, this.password)
        } catch (e) {
            logger.error(e, "Password validation excpetion")
            return false;
        }
    }
}

const UserModel = getModelForClass(User);

export default UserModel;