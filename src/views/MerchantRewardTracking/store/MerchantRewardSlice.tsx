import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetRewardTrackingDetails,
    apiGetRewardTrackingDetailsKeyword
} from '@/services/MerchantRewardTrackingService'
import type { TableQueries } from '@/@types/common'
import type { MerchantRewardTrackingData } from '@/@types/MerchantRewardTracking'

type GetMerchantRewardResponse = {
    data?: MerchantRewardTrackingData[]
    // data: {
    //     trackingDetails?: MerchantRewardTrackingData[]
    //     page?: number
    //     limit?: number
    //     totalPages?: number
    //     totalDocs?: number
    // }
}

type FilterQueries = {
    //filter data
}

export type MerchantRewardTrackingState = {
    loading: boolean
    refresh: number
    tableData: TableQueries
    filterData: FilterQueries
    TrackingList: MerchantRewardTrackingData[]
}

type GetMerchantRewardRequest = TableQueries & { filterData?: FilterQueries }

export const SLICE_NAME = 'merchantRewardTracking'

export const getMerchantRewardtDetails = createAsyncThunk(
    SLICE_NAME + '/getMerchantRewardtDetails',
    async (params: GetMerchantRewardRequest) => {
        const response = await apiGetRewardTrackingDetails<
            GetMerchantRewardResponse,
            GetMerchantRewardRequest
        >(params)
        return response.data
    },
)

export const getMerchantRewardtDetailsKeyword = createAsyncThunk(
    SLICE_NAME + '/getMerchantRewardtDetailsKeyword',
    async (params: GetMerchantRewardRequest) => {
        const response = await apiGetRewardTrackingDetailsKeyword<
            GetMerchantRewardResponse,
            GetMerchantRewardRequest
        >(params)
        return response.data
    },
)

export const initialTableData: TableQueries = {
    total: 0,
    page: 1,
    limit: 10,
    key: '',
    sortBy: 'createdAt:desc',
}

const initialState: MerchantRewardTrackingState = {
    loading: false,
    refresh: 0,
    TrackingList: [],
    tableData: initialTableData,
    filterData: {
        //initial filterData
    },
}

const merchantSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        setRefresh: (state, action) => {
            state.refresh = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(getMerchantRewardtDetails.fulfilled, (state, action) => {
            state.TrackingList = action.payload.data || [];
            state.loading = false;
        })
        .addCase(getMerchantRewardtDetails.pending, (state) => {
            state.loading = true;
        })
        .addCase(getMerchantRewardtDetails.rejected, (state, action) => {
            console.error("API Request Failed:", action.error.message);
            state.loading = false;
        })
        .addCase(getMerchantRewardtDetailsKeyword.fulfilled, (state, action) => {
            state.TrackingList = action.payload.data || [];
            state.loading = false;
        })
        .addCase(getMerchantRewardtDetailsKeyword.pending, (state) => {
            state.loading = true;
        })
        .addCase(getMerchantRewardtDetailsKeyword.rejected, (state, action) => {
            console.error("API Request Failed:", action.error.message);
            state.loading = false;
        });

    },
})

export const {
    setTableData,
    setRefresh
} = merchantSlice.actions

export default merchantSlice.reducer
