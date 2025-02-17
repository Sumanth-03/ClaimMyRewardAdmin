import { useEffect, useMemo, useRef, useCallback, useState } from 'react'
import DataTable from '@/components/shared/DataTable'
import Switcher from '@/components/ui/Switcher'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import type { CampaignRewardTrackingData } from '@/@types/CampaignRewardTracking'
import { HiOutlineEye } from "react-icons/hi";
import {
    getCampaignRewardtDetails,
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

const ActionColumn = ({ row }: { row: CampaignRewardTrackingData }) => {
    const dispatch = useAppDispatch()
    const { textTheme } = useThemeClass()
    const navigate = useNavigate()

    const onView = () => {
        navigate(`/rewardTracking/View/${row.Id}`)
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

const CampaignRewardTrackingTable = () => {
    const [sortedData, setSortedData] = useState<CampaignRewardTrackingData[]>([]);

    const tableRef = useRef<DataTableResetHandle>(null)

    const dispatch = useAppDispatch()

    const { page, limit } = useAppSelector(
        (state) => state.rewardTracking.data.tableData,
    )

    const loading = useAppSelector((state) => state.rewardTracking.data.loading)

    const refresh = useAppSelector((state) => state.rewardTracking.data.refresh)

    const data = useAppSelector((state) => state.rewardTracking.data.TrackingList)

    // useEffect(() => {
    //     const sorted = [...data].sort((a, b) => {
    //       const [dayA, monthA, yearA] = (a.dateOfParticipation ?? '00-00-0000').split('-').map(Number);
    //       const [dayB, monthB, yearB] = (b.dateOfParticipation ?? '00-00-0000').split('-').map(Number);
    
    //       return yearA - yearB || monthA - monthB || dayA - dayB;
    //     });
    
    //     setSortedData(sorted);
    // }, []);    



    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit, refresh])

    const tableData = useMemo(
        () => ({ page, limit }),
        [page, limit],
    )

    const fetchData = () => {
        dispatch(
            getCampaignRewardtDetails({
                page,
                count : limit,
            }),
        )
    }

    const columns: ColumnDef<CampaignRewardTrackingData>[] = useMemo(
        () => [
            {
                header: '',
                id: 'actions',
                cell: (props) => <ActionColumn row={props.row.original} />,
            },
            {
                header: 'Name',
                accessorKey: 'user_name',
                enableSorting: false,
            },
            {
                header: 'Customer Id',
                accessorKey: 'customerId',
                enableSorting: false,
                cell: (props) => {
                  const { id_user } = props.row.original;
                  return <p>{id_user}</p>;
                },
            },
            {
                header: 'Campaign Name',
                accessorKey: 'CampaignName',
                enableSorting: false,
                cell: (props) => {
                  const { store } = props.row.original;
                  return <p>{store}</p>;
                },
            },
            {
                header: 'Date of Participation',
                accessorKey: 'dateOfParticipation',
                enableSorting: true,
                cell: (props) => {
                  const { date_of_participation } = props.row.original;
                  return <p>{date_of_participation ? new Date (date_of_participation).toLocaleDateString() : 'N/A'}</p>;
                },
            },
            {
                header: 'Advertiser Name',
                accessorKey: 'advertiserName',
                enableSorting: false,
                cell: (props) => {
                  const { retailer } = props.row.original;
                  return <p>{retailer}</p>;
                },
            },
            {
                header: 'Reward Amount',
                accessorKey: 'rewardAmount',
                enableSorting: false,
                cell: (props) => {
                  const { reward_amt } = props.row.original;
                  return <p>{reward_amt ? ` ₹ ${reward_amt}` : 'N/A'}</p>;
                },
            },
            {
                header: 'Phone Number',
                accessorKey: 'phoneNumber',
                enableSorting: false,
                cell: (props) => {
                  const { user_phone } = props.row.original;
                  return <p>{user_phone}</p>;
                },
            },
            {
                header: 'Notes',
                accessorKey: 'notes',
                enableSorting: false,
                cell: (props) => {
                  const { notes } = props.row.original;
                  return <p>{notes || 'No notes'}</p>;
                },
            },
            {
                header: 'Proof',
                accessorKey: 'proof',
                enableSorting: false,
                cell: (props) => {
                  const { img_url } = props.row.original;
                  return <p>{img_url ? 'Uploaded' : 'Not Provided'}</p>;
                },
            },
        ],
        [],
    )

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

    // const onSort = (sort: OnSortParam) => {
    //     if (!sort.key && !sort.order) {
    //         sort.key = 'createdAt'
    //         sort.order = 'desc'
    //     }
    //     const newTableData = cloneDeep(tableData)
    //     newTableData.sortBy = `${sort.key}:${sort.order}`
    //     // dispatch(setTableData(newTableData))
    // }
    // useEffect(()=>{
    //     toast.push(
    //         <Notification title='test'>test</Notification>
    //     )
    // },[])

    return (
        <>
            <DataTable
                ref={tableRef}
                columns={columns}
                data={data}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ className: 'rounded-md' }}
                loading={loading}
                pagingData={{
                    pageIndex: tableData.page as number,
                    pageSize: tableData.limit as number,
                }}
                onPaginationChange={onPaginationChange}
                onSelectChange={onSelectChange}
                fixedColumns={['actions']}
            />
        </>
    )
}

export default CampaignRewardTrackingTable
