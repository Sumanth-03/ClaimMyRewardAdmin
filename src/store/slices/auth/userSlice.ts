import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'

export type UserState = {
    id?: string
    name?: string
    email?: string
    role?: string
}

const initialState: UserState = {
    id: '',
    name: '',
    email: '',
    role: '',
}

const userSlice = createSlice({
    name: `${SLICE_BASE_NAME}/user`,
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            state.id = action.payload?.id
            state.name = action.payload?.name
            state.email = action.payload?.email
            state.role = action.payload?.role
        },
    },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
