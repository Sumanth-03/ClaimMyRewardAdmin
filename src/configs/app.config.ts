export type AppConfig = {
    apiPrefix: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
    tourPath: string
    locale: string
    enableMock: boolean
}

const appConfig: AppConfig = {
    apiPrefix: '/api',
    authenticatedEntryPath: '/rewardTracking',
    unAuthenticatedEntryPath: '/login',
    tourPath: '/',
    locale: 'en',
    enableMock: true,
}

export default appConfig
