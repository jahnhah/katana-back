import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
    body: object({
        firstName: string({
            required_error: "First name is required"
        }),
        lastName: string({
            required_error: "Last name is required"
        }),
        password: string({
            required_error: "Password is required"
        }).min(6, "Password is too short"),
        passwordConfirmation: string({
            required_error: "Passord confirmation is required"
        }),
        email: string({
            required_error: "Email is required",
        }).email("Not a valid email")
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: "Passwords do not match",
        path: ["passwordConfirmation"],
    })
})

export const verifyUserSchema = object({
    query: object({
        id: string({
            required_error: 'user id is required'
        }),
        verificationCode: string({
            required_error: 'verificationCode is required'
        })
    })
});

export const passwordRecoverySchema = object({
    body: object({
        email: string({
            required_error: "email is required"
        }).email({
            message: 'email is invalid'
        })
    })
})

export const passwordResetSchema = object({
    params: object({
        id: string(),
        passwordResetCode: string()
    }),
    body: object({
        password: string({
            required_error: "Password is required"
        }).min(6, "Password is too short"),
        passwordConfirmation: string({
            required_error: "Passord confirmation is required"
        }),
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: "Passwords do not match",
        path: ["passwordConfirmation"],
    })
})

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"]
export type VerifyUserInput = TypeOf<typeof verifyUserSchema>["query"]
export type PasswordRecoveryInput = TypeOf<typeof passwordRecoverySchema>['body']
export type PasswordResetInput = TypeOf<typeof passwordResetSchema>;