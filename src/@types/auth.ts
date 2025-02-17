export type SignInCredential = {
    user: string
    pass: string
}

export type SignInResponse = {
    data:{
        token: string
    }
    message:string
    status:number
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
