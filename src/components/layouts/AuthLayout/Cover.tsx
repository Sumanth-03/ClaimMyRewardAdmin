import { cloneElement } from 'react'
import Logo from '@/components/template/Logo'
import { APP_NAME } from '@/constants/app.constant'
import type { CommonProps } from '@/@types/common'
import type { ReactNode, ReactElement } from 'react'

interface CoverProps extends CommonProps {
    content?: ReactNode
}

const Cover = ({ children, content, ...rest }: CoverProps) => {
    return (
        <div className="grid lg:grid-cols-3 h-full">
            <div className="col-span-2 bg-no-repeat bg-cover py-6 px-16 flex-col justify-between bg-primary dark:bg-gray-800 hidden lg:flex">
                <Logo mode="dark" />
                <img
                    src="/img/others/auth-cover-bg.png"
                    alt={`${APP_NAME} cover`}
                    className="max-w-3xl"
                />
            </div>
            <div className="flex flex-col justify-center items-center bg-white dark:bg-gray-800">
                <div className="xl:min-w-[450px] px-8">
                    <div className="mb-8">{content}</div>
                    {children
                        ? cloneElement(children as ReactElement, { ...rest })
                        : null}
                </div>
            </div>
        </div>
    )
}

export default Cover
