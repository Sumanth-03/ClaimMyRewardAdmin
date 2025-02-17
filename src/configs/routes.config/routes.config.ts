import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [
    {
        key: 'rewardTracking',
        path: '/rewardTracking',
        component: lazy(() => import('@/views/CampaignRewardTracking')),
        authority: [],
        meta: {
            header: '',
        },
    },
    {
        key: 'merchantRewardTracking',
        path: '/merchantRewardTracking',
        component: lazy(() => import('@/views/MerchantRewardTracking')),
        authority: [],
        meta: {
            header: '',
        },
    },
    {
        key: 'viewDetails',
        path: '/rewardTracking/view/:Id',
        component: lazy(
            () => import('@/views/CampaignRewardTrackingDetailsPage'),
        ),
        authority: [],
        meta: {
            header: '',
        },
    },
    {
        key: 'viewDetailsMerchant',
        path: '/merchantRewardTracking/view/:Id',
        component: lazy(
            () => import('@/views/MerchantRewardTrackingDetailsPage'),
        ),
        authority: [],
        meta: {
            header: '',
        },
    },
]
