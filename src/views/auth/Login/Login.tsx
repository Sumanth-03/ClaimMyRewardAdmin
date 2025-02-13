import LoginForm from './LoginForm'

const Login = () => {
    return (
        <>
            <div className="mb-8">
                <h3 className="mb-1">Cheggout Rewards Portal 👋🏻</h3>
                <p>Please log in to your account</p>
            </div>
            <LoginForm disableSubmit={false} />
        </>
    )
}

export default Login
