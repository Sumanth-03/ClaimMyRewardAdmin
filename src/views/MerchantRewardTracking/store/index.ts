import { combineReducers } from '@reduxjs/toolkit'
import reducers, {
    SLICE_NAME,
    MerchantRewardTrackingState,
} from './MerchantRewardSlice'
import { useSelector } from 'react-redux'

import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'

const reducer = combineReducers({
    data: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            data: MerchantRewardTrackingState
        }
    }
> = useSelector

export * from './MerchantRewardSlice'
export { useAppDispatch } from '@/store'
export default reducer
