import ApiService from './ApiService'

export async function apiGetRewardTrackingDetails<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchData<T>({
        url: '/getDashMissingPoints',
        method: 'get',
        params,
    })
}

export async function apiMerchantResolveTicket<T, U extends Record<string, unknown>>(
    data: U,
) {
    return ApiService.fetchData<T>({
        url: '/postMPTicketStatus',
        method: 'post',
        data,
    })
}
