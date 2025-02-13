import reducer from './store'
import { injectReducer } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import CampaignTable from './components/RewardTrackingTable'
import CampaignTableTools from './components/RewardTrackingTableTools'
import cloneDeep from 'lodash/cloneDeep'
import { HiRefresh } from 'react-icons/hi'
import {
    useAppDispatch,
    useAppSelector,
    setTableData,
    setRefresh
} from './store'

injectReducer('merchantRewardTracking', reducer)

const MerchantRewards = () => {
    const dispatch = useAppDispatch()
    
    const tableData = useAppSelector((state) => state.merchantRewardTracking.data.tableData)
    const data = useAppSelector((state) => state.merchantRewardTracking.data.TrackingList)
    const refresh = useAppSelector((state) => state.merchantRewardTracking.data.refresh)

    const handleRefresh = () => {
        const newTableData = cloneDeep(tableData)
        newTableData.page = 1
        dispatch(setTableData(newTableData))
        dispatch(setRefresh(refresh + 1))
    }

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <div className="lg:flex items-center">
                    <h3 className="mb-4 lg:mb-0">Merchant Reward Tracking</h3>
                    <HiRefresh
                        className="mx-2 text-2xl text-indigo-900 cursor-pointer"
                        onClick={handleRefresh}
                    />
                </div>
                <CampaignTableTools/>
            </div>
            <CampaignTable />
        </AdaptableCard>
    )
}

export default MerchantRewards
