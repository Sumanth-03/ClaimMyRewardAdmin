import { useRef } from 'react'
import Input from '@/components/ui/Input'
import { HiOutlineSearch } from 'react-icons/hi'
import {
    useAppSelector,
    useAppDispatch,
} from '../store'
import debounce from 'lodash/debounce'
import cloneDeep from 'lodash/cloneDeep'
import type { TableQueries } from '@/@types/common'
import type { ChangeEvent } from 'react'

const CampaignTableSearch = () => {
    const dispatch = useAppDispatch()

    const searchInput = useRef(null)

    const tableData = useAppSelector((state) => state.merchantRewardTracking.data.tableData)

    const filterData = useAppSelector((state) => state.merchantRewardTracking.data.filterData)

    const debounceFn = debounce(handleDebounceFn, 500)

    function handleDebounceFn(val: string) {
        const newTableData = cloneDeep(tableData)
        newTableData.keyword = val
        newTableData.page = 1
        if (typeof val === 'string' && val.length >= 1) {
            fetchData(newTableData)
        }

        if (typeof val === 'string' && val.length === 0) {
            fetchData(newTableData)
        }
    }

    const fetchData = (data: TableQueries) => {
        // dispatch(setTableData(data))
        // dispatch(getCampaigns({...data, ...filterData}))
    }

    const onEdit = (e: ChangeEvent<HTMLInputElement>) => {
        debounceFn(e.target.value)
    }

    return (
        <Input
            ref={searchInput}
            className="max-w-md md:w-52 md:mb-0 mb-4"
            size="sm"
            placeholder="Search"
            prefix={<HiOutlineSearch className="text-lg" />}
            onChange={onEdit}
        />
    )
}

export default CampaignTableSearch
