import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetChat,
    apipostMessage
} from '@/services/AdditionalServices'
import {
  apiCampaignResolveTicket
} from '@/services/CampaignRewardTrackingService'
import type { TableQueries } from '@/@types/common'
import type { CampaignRewardTrackingData } from '@/@types/CampaignRewardTracking'

export const SLICE_NAME = 'TrackingDetails'

export type RewardTrackingDetailState = {
    loading: boolean
    refresh: number
    message?: ChatMessage[]
}
export type postCampaignResolveRequest = {
    id? : String ,
    report_status : String
}

type postCampaignResolveResponse = {
    data:{}
}

export const postCampaignResolve = createAsyncThunk<
  postCampaignResolveResponse, 
  postCampaignResolveRequest,  
  { rejectValue: { message: string } } 
>(
  SLICE_NAME + "/postCampaignResolve",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiCampaignResolveTicket<
        postCampaignResolveResponse,
        postCampaignResolveRequest
      >(data);
      
      return response.data; // This is sent to `fulfilled`
    } catch (error: any) {
      console.error("API Error:", error);
      return rejectWithValue({
        message: error?.response?.data?.message || "Something went wrong",
      });
    }
  }
);

//--------------------Chat handlers

export type PostChatRequest = {
  ticket_id: number;
  msg: String;
  type: number;
};

export type PostChatResponse = {
  status: number;
  message: string;
};

type GetChatMessageRequest = {
  ticket_id?: number;
  type: number;
};

export type ChatMessage = {
  actor: number;
  msg: string;
  created_at: string;
};

type TextMessage = ChatMessage & { type: "text" };
type MediaMessage = ChatMessage & { type: "media" };

export type GetChatMessageResponse = {
  data: (TextMessage | MediaMessage)[];
};

export const getMessageDetails = createAsyncThunk(
    SLICE_NAME + '/getChat',
    async (data: GetChatMessageRequest) => {
        const response = await apiGetChat<
            GetChatMessageResponse,
            GetChatMessageRequest
        >(data)
        return response.data
    },
)

export const postMessage = createAsyncThunk(
  SLICE_NAME + '/postMessage',
  async (data: PostChatRequest) => {
      const response = await apipostMessage<
          PostChatResponse,
          PostChatRequest
      >(data)
      return response.data
  },
)

//-----------------

const initialState: RewardTrackingDetailState = {
    loading:false,
    refresh:0,
    message:undefined,
}

const campaignDetailSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
      resetState: (state) => {
        state.loading = true;
        state.refresh = 0;
        state.message = undefined; 
      },
    },
    extraReducers: (builder) => {
        builder
            .addCase(postCampaignResolve.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(postCampaignResolve.pending, (state) => {
                state.loading = true;
            })
            .addCase(postCampaignResolve.rejected, (state, action) => {
                console.error("API Request Failed:", action.error.message);
                state.loading = false;
            })
            .addCase(getMessageDetails.fulfilled, (state, action) => {
              state.message = action.payload.data
              state.loading = false;
            })
            .addCase(getMessageDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMessageDetails.rejected, (state, action) => {
                console.error("API Request Failed:", action.error.message);
                state.loading = false;
            });
    },
})

export const {
   resetState
} = campaignDetailSlice.actions

export default campaignDetailSlice.reducer