import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetRewardTrackingDetails
} from '@/services/CampaignRewardTrackingService'
import type { TableQueries } from '@/@types/common'
import type { CampaignRewardTrackingData } from '@/@types/CampaignRewardTracking'

type GetCampaignRewardResponse = {
    data:  CampaignRewardTrackingData[]
}

type FilterQueries = {
    //filter data
}

export type RewardTrackingState = {
    loading: boolean
    refresh: number
    tableData: TableQueries
    filterData: FilterQueries
    TrackingList: CampaignRewardTrackingData[]
}

type GetCampaignRewardRequest = TableQueries & { filterData?: FilterQueries }

export const SLICE_NAME = 'rewardTracking'

export const getCampaignRewardtDetails = createAsyncThunk(
    SLICE_NAME + '/path',
    async (params: GetCampaignRewardRequest) => {
        const response = await apiGetRewardTrackingDetails<
            GetCampaignRewardResponse,
            GetCampaignRewardRequest
        >(params)
        return response.data
    },
)


export const initialTableData: TableQueries = {
    page: 1,
    limit: 10,
    keyword: '',
}

const initialState: RewardTrackingState = {
    loading: false,
    refresh: 0,
    TrackingList:[],
    tableData: initialTableData,
    filterData: {
        //initial filterData
    },
}

const campaignSlice = createSlice({
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
            .addCase(getCampaignRewardtDetails.fulfilled, (state, action) => {
                        state.TrackingList = action.payload.data || [];
                        state.loading = false;
                    })
                    .addCase(getCampaignRewardtDetails.pending, (state) => {
                        state.loading = true;
                    })
                    .addCase(getCampaignRewardtDetails.rejected, (state, action) => {
                        state.loading = false;
                    });
    },
})

export const {
    setTableData,
    setRefresh
   //reducer func's
} = campaignSlice.actions

export default campaignSlice.reducer
