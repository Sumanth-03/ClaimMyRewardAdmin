import ApiService from './ApiService'

export async function apiUploadImage<T, U extends Record<string, unknown>>(
    data: U,
) {
    return ApiService.fetchData<T>({
        url: '/v1/uploads/image',
        method: 'post',
        data,
    })
}

export async function apiUploadFile<T, U extends Record<string, unknown>>(
    data: U,
) {
    return ApiService.fetchData<T>({
        url: '/v1/uploads/file',
        method: 'post',
        data,
    })
}
