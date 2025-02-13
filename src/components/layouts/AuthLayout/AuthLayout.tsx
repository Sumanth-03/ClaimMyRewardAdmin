import Cover from './Cover'
import View from '@/views'

const AuthLayout = () => {
    return (
        <div className="app-layout-blank flex flex-auto flex-col h-[100vh]">
            <Cover>
                <View />
            </Cover>
        </div>
    )
}

export default AuthLayout
