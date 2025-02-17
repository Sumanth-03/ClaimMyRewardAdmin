import ApiService from './ApiService'

export async function apiGetChat<T, U extends Record<string, unknown>>(
    data: U,
) {
    return ApiService.fetchData<T>({
        url: '/getChat',
        method: 'post',
        data,
    })
}

export async function apipostMessage<T, U extends Record<string, unknown>>(
    data: U,
) {
    return ApiService.fetchData<T>({
        url: '/postDashMessage',
        method: 'post',
        data,
    })
}
