import { Timestamp } from "mongodb";
import { now } from "mongoose";


export function randomNumber(digits: number = 6) {
    return Math.floor(Math.random() * Math.pow(10, digits));
}

export function createVerificationCode() {
    const verificationCode = {
        code: randomNumber().toString(),
        expiresAt: Timestamp.fromNumber((Math.round((new Date().getTime() + 1 * 24 * 60 * 60 * 1000) / 1000)))
    }
    return verificationCode;
}

export function getNowAsTimestamp() {
    return Math.round((new Date().getTime()) / 1000);
}