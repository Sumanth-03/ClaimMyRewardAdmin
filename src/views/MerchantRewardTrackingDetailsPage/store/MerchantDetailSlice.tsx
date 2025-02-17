import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiMerchantResolveTicket } from '@/services/MerchantRewardTrackingService'
import { apiGetChat } from '@/services/AdditionalServices'
import type { TableQueries } from '@/@types/common'
import { MerchantRewardTrackingData } from '@/@types/MerchantRewardTracking'

import type { ChatMessage } from '../../CampaignRewardTrackingDetailsPage/store/campaignDetailSlice'

export const SLICE_NAME = 'merchantRewardTrackingDetails'

export type RewardTrackingDetailState = {
    loading: boolean
    refresh: number
    message?: ChatMessage[]
}
export type postMerchantResolveRequest = {
    id?: String
    report_status: String
}

type postMerchantResolveResponse = {
    data: {}
}

export const postMerchantResolve = createAsyncThunk<
    postMerchantResolveResponse,
    postMerchantResolveRequest,
    { rejectValue: { message: string } }
>(SLICE_NAME + '/postCampaignResolve', async (params, { rejectWithValue }) => {
    try {
        const response = await apiMerchantResolveTicket<
            postMerchantResolveResponse,
            postMerchantResolveRequest
        >(params)

        return response.data // This is sent to `fulfilled`
    } catch (error: any) {
        console.error('API Error:', error)
        return rejectWithValue({
            message: error?.response?.data?.message || 'Something went wrong',
        })
    }
})

type GetChatMessageRequest = {
    ticket_id?: number
    type: number
}

type TextMessage = ChatMessage & { type: 'text' }
type MediaMessage = ChatMessage & { type: 'media' }

export type GetChatMessageResponse = {
    data: (TextMessage | MediaMessage)[]
}

export const getMessageDetails = createAsyncThunk(
    SLICE_NAME + '/getChat',
    async (data: GetChatMessageRequest) => {
        console.log('calling')
        const response = await apiGetChat<
            GetChatMessageResponse,
            GetChatMessageRequest
        >(data)
        console.log(response.data)
        return response.data
    },
)

const initialState: RewardTrackingDetailState = {
    loading: false,
    refresh: 0,
    message: undefined,
}

const merchantDetailSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        //reducers
    },
    extraReducers: (builder) => {
        builder
            .addCase(postMerchantResolve.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(postMerchantResolve.pending, (state) => {
                state.loading = true
            })
            .addCase(postMerchantResolve.rejected, (state, action) => {
                console.error('API Request Failed:', action.error.message)
                state.loading = false
            })
            .addCase(getMessageDetails.fulfilled, (state, action) => {
                console.log('fullfilled')
                state.message = action.payload.data
                state.loading = false
            })
            .addCase(getMessageDetails.pending, (state) => {
                state.loading = true
            })
            .addCase(getMessageDetails.rejected, (state, action) => {
                console.error('API Request Failed:', action.error.message)
                state.loading = false
            })
    },
})

export const {
    //reducer func's
} = merchantDetailSlice.actions

export default merchantDetailSlice.reducer
