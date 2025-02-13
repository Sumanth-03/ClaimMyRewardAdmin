import { useEffect, useMemo, useRef, useCallback, useState } from 'react'
import DataTable from '@/components/shared/DataTable'
import Switcher from '@/components/ui/Switcher'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import type { MerchantRewardTrackingData } from '@/@types/MerchantRewardTracking'
import { HiOutlineEye } from "react-icons/hi";
import {
    getMerchantRewardtDetails, 
    setTableData,
    useAppDispatch,
    useAppSelector,
} from '../store'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { useNavigate } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import dayjs from 'dayjs'
import type {
    DataTableResetHandle,
    OnSortParam,
    ColumnDef,
} from '@/components/shared/DataTable'

const ActionColumn = ({ row }: { row: MerchantRewardTrackingData }) => {
    const dispatch = useAppDispatch()
    const { textTheme } = useThemeClass()
    const navigate = useNavigate()
    const onView = () => {
        navigate(`/merchantRewardTracking/View/${row.Id}`)
    }

    return (
        <div className="flex justify-center text-lg">
            <span
                className="cursor-pointer p-2 hover:text-red-500"
                onClick={onView}
            >
                <HiOutlineEye size={20} />
            </span> 
        </div>
    )
}

const MerchantRewardTrackingTable = () => {
    // const [sortedData, setSortedData] = useState<MerchantRewardTrackingData[]>([]);

    const tableRef = useRef<DataTableResetHandle>(null)

    const dispatch = useAppDispatch()

    const { page, limit } = useAppSelector(
        (state) => state.merchantRewardTracking.data.tableData
    )
    const loading = useAppSelector((state) => state.merchantRewardTracking.data.loading)

    const refresh = useAppSelector((state) => state.merchantRewardTracking.data.refresh)

    const data = useAppSelector((state) => state.merchantRewardTracking.data.TrackingList)
    
    const sortedData = [...data].sort((a, b) => a.priority_level - b.priority_level);

    const filterData = useAppSelector(
        (state) => state.merchantRewardTracking.data.filterData,
    )

    const keyword = useAppSelector(
        (state) => state.merchantRewardTracking.data.tableData.keyword
    )

    const priorityConfig = {
      1: { label: "Critical Issue", bgColor: "bg-red-600" },
      2: { label: "High Priority", bgColor: "bg-orange-500" },
      3: { label: "Moderate Priority", bgColor: "bg-yellow-400" },
      4: { label: "Low Priority", bgColor: "bg-green-500" },
      5: { label: "Very Low Priority", bgColor: "bg-blue-400" },
    };

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit, refresh])

    const tableData = useMemo(
        () => ({ page, limit}),
        [page, limit],
    )
    const fetchData = () => {
        dispatch(
          getMerchantRewardtDetails({
                page,
                count : limit,
                // sortBy,
                // keyword,
                // ...filterData,
            }),
        )
    }

    const columns: ColumnDef<MerchantRewardTrackingData>[] = useMemo(
        () => [
          {
            header: 'Priority',
            accessorKey: 'priority',
            enableSorting: false,
            cell: (props) => {
                const { priority_level} = props.row.original;
                return <p className={`${priorityConfig[priority_level]?.bgColor} px-5 py-2 rounded-lg text-white`}>{priorityConfig[priority_level]?.label}</p>;
            },
          },
          {
            header: '',
            id: 'actions',
            cell: (props) => <ActionColumn row={props.row.original} />,
          },
          {
            header: 'Name',
            accessorKey: 'user_name',
            enableSorting: false,
            cell: (props) => {
              const { user_name } = props.row.original;
              return <p>{user_name}</p>;
            },
          },
          {
            header: 'Customer Id',
            accessorKey: 'id_user',
            enableSorting: false,
            cell: (props) => {
              const { id_user } = props.row.original;
              return <p>{id_user}</p>;
            },
          },
          {
            header: 'Store Name',
            accessorKey: 'retailer',
            enableSorting: false,
            cell: (props) => {
              const { retailer } = props.row.original;
              return <p>{retailer}</p>;
            },
          },
          {
            header: 'Order Date',
            accessorKey: 'purchase_date',
            enableSorting: true,
            cell: (props) => {
              const { purchase_date } = props.row.original;
              return <p>{purchase_date ? new Date (purchase_date).toLocaleDateString(): 'N/A'}</p>;
            },
          },
          {
            header: 'Order ID',
            accessorKey: 'orderId',
            enableSorting: false,
            cell: (props) => {
              const { order_id } = props.row.original;
              return <p>{order_id}</p>;
            },
          },
          {
            header: 'Order Amount',
            accessorKey: 'orderAmount',
            enableSorting: true,
            cell: (props) => {
              const { order_amt } = props.row.original;
              return <p>{order_amt ? ` ₹ ${order_amt}` : 'N/A'}</p>;
            },
          },
          {
            header: 'Reward Amount',
            accessorKey: 'rewardAmount',
            enableSorting: true,
            cell: (props) => {
              const { reward_amt } = props.row.original;
              return <p>{reward_amt ? ` ₹ ${reward_amt}` : 'N/A'}</p>;
            },
          },
          {
            header: 'Total Commission Amount',
            accessorKey: 'totalCommissionAmount',
            enableSorting: false,
            cell: (props) => {
              const { totalCommissionAmount } = props.row.original;
              return <p>{totalCommissionAmount ? ` ₹ ${totalCommissionAmount}` : 'N/A'}</p>;
            },
          },
          {
            header: 'Phone Number',
            accessorKey: 'phone',
            enableSorting: false,
            cell: (props) => {
              const { user_name } = props.row.original;
              return <p>{user_name}</p>;
            },
          },
          {
            header: 'Email',
            accessorKey: 'email',
            enableSorting: false,
            cell: (props) => {
              const { user_email } = props.row.original;
              return <p>{user_email}</p>;
            },
          },
        ],
        [data]
    );
      
    const onPaginationChange = (page: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.page = page
        dispatch(setTableData(newTableData))
    }

    const onSelectChange = (value: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.limit = value
        newTableData.page = 1
        dispatch(setTableData(newTableData))
    }

    return (
        <>
            <DataTable
                ref={tableRef}
                columns={columns}
                data={sortedData}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ className: 'rounded-md' }}
                loading={loading}
                pagingData={{
                    pageIndex: tableData.page as number,
                    pageSize: tableData.limit as number,
                }}
                onPaginationChange={onPaginationChange}
                onSelectChange={onSelectChange}
                fixedColumns={['priority', 'actions']}
            />
        </>
    )
}

export default MerchantRewardTrackingTable
