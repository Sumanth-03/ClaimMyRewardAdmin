import ApiService from './ApiService'

export async function apiGetRewardTrackingDetails<
    T,
    U extends Record<string, unknown>,
>(params: U) {
    return ApiService.fetchData<T>({
        url: '/getDashClaimRewards',
        method: 'get',
        params,
    })
}

export async function apiCampaignResolveTicket<
    T,
    U extends Record<string, unknown>,
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/postCRTicketStatus',
        method: 'post',
        data,
    })
}

export async function apiGetRewardTrackingDetailsKeyword<
    T,
    U extends Record<string, unknown>,
>(params: U) {
    return ApiService.fetchData<T>({
        url: '/getDashClaimRewardsKeyword',
        method: 'get',
        params,
    })
}
