import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE,
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
    {
        key: 'rewardTracking',
        path: '/rewardTracking',
        title: 'CampaignRewardTracking',
        unresolved:'40',
        translateKey: 'Campaign Tracking',
        icon: 'campaigns',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'merchantRewardTracking',
        path: '/merchantRewardTracking',
        title: 'MerchantRewardTracking',
        unresolved:'16',
        translateKey: 'Merchant Tracking',
        icon: 'campaigns',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
]

export default navigationConfig
