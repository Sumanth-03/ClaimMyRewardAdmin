import {
    DashboardSvg,
    CampaignSvg,
    ReportSvg,
    CustomerSvg,
    CouponSvg,
} from '../assets/svg'
import { HiOutlineCog } from 'react-icons/hi'
import { MdOutlineLocalOffer } from 'react-icons/md'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    dashboard: <DashboardSvg />,
    campaigns: <CampaignSvg />,
    groupedCampaigns: <CampaignSvg />,
    coupons: <MdOutlineLocalOffer />,
    customers: <CustomerSvg />,
    reports: <ReportSvg />,
    settings: <HiOutlineCog />,
}

export default navigationIcon
