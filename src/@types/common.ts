import { ReactNode, CSSProperties } from 'react'

export interface CommonProps {
    className?: string
    children?: ReactNode
    style?: CSSProperties
}

export type TableQueries = {
    total?: number
    page?: number
    limit?: number
    key?: string
    sortBy?: string
    populate?: string
}

export type SetSubmitting = (isSubmitting: boolean) => void
