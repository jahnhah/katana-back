import { isValidObjectId } from "mongoose";
import { HttpException } from "../utils/http-exception";
import UserModel, { User } from "../models/user.model";

export function createUser(input: Partial<User>) {
    return UserModel.create(input);
}

export function findUserById(id: string) {
    if (!isValidObjectId(id)) {
        throw new HttpException(400, 'id mal-formatted');
    }
    return UserModel.findById(id);
}

export function findUserByEmail(email: string) {
    return UserModel.findOne({ email: email });
}