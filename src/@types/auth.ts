export type SignInCredential = {
    email: string
    password: string
}

export type SignInResponse = {
    tokens: {
        access: {
            token: string
            expires: string
        }
        refresh: {
            token: string
            expires: string
        }
    }
    user: {
        name: string
        roles: string[]
        email: string
        id: string
    }
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    userName: string
    email: string
    password: string
}

export type ForgotPassword = {
    email: string
}

export type ResetPassword = {
    password: string
}
