import { apiSignIn } from '@/services/AuthService'
import {
    setUser,
    signInSuccess,
    signOutSuccess,
    useAppSelector,
    useAppDispatch
} from '@/store'
import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useNavigate } from 'react-router-dom'
import useQuery from './useQuery'
import type { SignInCredential } from '@/@types/auth'

type Status = 'success' | 'failed'

function useAuth() {
    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const query = useQuery()

    const { token, signedIn } = useAppSelector((state) => state.auth.session)

    const signIn = async (
        values: SignInCredential
    ): Promise<
        | {
              status: Status
              message: string
          }
        | undefined
    > => {
        try {
            const resp = await apiSignIn(values)
            if (resp.data) {
                const {
                    tokens: { access },
                    user
                } = resp.data
                dispatch(signInSuccess(access?.token))
                if (user) {
                    dispatch(setUser(user))
                }
                const redirectUrl = query.get(REDIRECT_URL_KEY)
                navigate(
                    redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
                )
                return {
                    status: 'success',
                    message: ''
                }
            }
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString()
            }
        }
    }

    const handleSignOut = () => {
        dispatch(signOutSuccess())
        dispatch(
            setUser({
                id: '',
                name: '',
                email: '',
                role: ''
            })
        )
        navigate(appConfig.unAuthenticatedEntryPath)
    }

    const signOut = async () => {
        handleSignOut()
    }

    return {
        authenticated: token && signedIn,
        signIn,
        signOut
    }
}

export default useAuth
