import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Alert from '@/components/ui/Alert'
import PasswordInput from '@/components/shared/PasswordInput'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import useAuth from '@/utils/hooks/useAuth'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'

interface LoginFormProps extends CommonProps {
    disableSubmit?: boolean
    forgotPasswordUrl?: string
    signUpUrl?: string
}

type LoginFormSchema = {
    email: string
    password: string
}

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Please enter a valid email')
        .required('Please enter your email'),
    password: Yup.string().required('Please enter your password')
})

const LoginForm = (props: LoginFormProps) => {
    const {
        disableSubmit = false,
        className,
        forgotPasswordUrl = '/forgot-password',
        signUpUrl = '/sign-up'
    } = props

    const [message, setMessage] = useTimeOutMessage()

    const { signIn } = useAuth()

    const onSignIn = async (
        values: LoginFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { email, password } = values
        setSubmitting(true)

        const result = await signIn({ email, password })

        if (result?.status === 'failed') {
            setMessage(result.message)
        }

        setSubmitting(false)
    }

    return (
        <div className={className}>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <>{message}</>
                </Alert>
            )}
            <Formik
                initialValues={{
                    email: '',
                    password: ''
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        onSignIn(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <FormItem
                                label="Email"
                                invalid={
                                    (errors.email && touched.email) as boolean
                                }
                                errorMessage={errors.email}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="email"
                                    placeholder="john@gmail.com"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Password"
                                invalid={
                                    (errors.password &&
                                        touched.password) as boolean
                                }
                                errorMessage={errors.password}
                            >
                                <Field
                                    autoComplete="off"
                                    name="password"
                                    placeholder="Password"
                                    component={PasswordInput}
                                />
                            </FormItem>
                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                            >
                                {isSubmitting ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default LoginForm
