import Button from '@/components/ui/Button'
import { HiPlusCircle } from 'react-icons/hi'
import CampaignTableSearch from './RewardTrackingTableSearch'
import CampaignFilter from './RewardTrackingFilter'
import { Link } from 'react-router-dom'

const CampaignTableTools = () => {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center">
            <CampaignTableSearch />
            <CampaignFilter />
        </div>
    )
}

export default CampaignTableTools
