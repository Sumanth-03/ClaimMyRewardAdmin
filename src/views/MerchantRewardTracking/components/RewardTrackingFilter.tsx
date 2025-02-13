import { useState, useRef, forwardRef } from 'react'
import { HiOutlineFilter } from 'react-icons/hi'
import {
    useAppDispatch,
    useAppSelector,
} from '../store'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import { Field, Form, Formik, FormikProps, FieldProps } from 'formik'
import type { MouseEvent } from 'react'
import omit from 'lodash/omit'

const initialFilterData = {
    status: '',
    type: '',
    rewardType: '',
}

type Option = {
    value: string
    label: string
}

const statusOptions: Option[] = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
]

const typeOptions: Option[] = [
    { label: 'Milestone', value: 'milestone' },
    { label: 'Referral', value: 'referral' },
    { label: 'Scratch Card', value: 'scratchcard' },
    { label: 'Spin', value: 'spin' },
    { label: 'Quiz', value: 'quiz' },
]

const rewardTypeOptions: Option[] = [
    { label: 'Points', value: 'points' },
    { label: 'Coupons', value: 'coupons' },
    { label: 'Gift Card', value: 'giftCard' },
    { label: 'Spin', value: 'spin' },
]

type FormModel = {
    status?: string
    type?: string
    rewardType?: string
}

type FilterFormProps = {
    onSubmitComplete?: () => void
}

type DrawerFooterProps = {
    onSaveClick: (event: MouseEvent<HTMLButtonElement>) => void
    onCancel: (event: MouseEvent<HTMLButtonElement>) => void
    onReset: (event: MouseEvent<HTMLButtonElement>) => void
}

const FilterForm = forwardRef<FormikProps<FormModel>, FilterFormProps>(
    ({ onSubmitComplete }, ref) => {
        const dispatch = useAppDispatch()

        const filterData = useAppSelector(
            (state) => state.rewardTracking.data.filterData,
        )
        
        const tableData = useAppSelector(
            (state) => state.rewardTracking.data.tableData,
        )

        const handleSubmit = (values: FormModel) => {
            onSubmitComplete?.()
            // dispatch(setFilterData(values))
            const updatedTableData = omit(tableData, 'total')
            // dispatch(getCampaigns({ ...values, ...updatedTableData }))
        }

        return (
            <Formik
                enableReinitialize
                innerRef={ref}
                initialValues={filterData}
                onSubmit={(values, { resetForm }) => {
                    handleSubmit(values)
                    setTimeout(() => {
                        resetForm()
                    }, 400)
                }}
            >
                {({ values, touched, errors }) => (
                    <Form>
                        <FormContainer>
                            <FormItem
                                label="Campaign Type"
                                invalid={
                                    (errors.type && touched.type) as boolean
                                }
                                errorMessage={errors.type}
                            >
                                <Field name="type">
                                    {({ field, form }: FieldProps) => (
                                        <Select
                                            isSearchable={false}
                                            placeholder="Select Campaign Type"
                                            field={field}
                                            form={form}
                                            options={typeOptions}
                                            value={typeOptions?.filter(
                                                (option) =>
                                                    option.value ===
                                                    values.type,
                                            )}
                                            onChange={(option) => {
                                                form.setFieldValue(
                                                    field.name,
                                                    option?.value,
                                                )
                                            }}
                                        />
                                    )}
                                </Field>
                            </FormItem>
                            <FormItem
                                label="Reward Type"
                                invalid={
                                    (errors.rewardType &&
                                        touched.rewardType) as boolean
                                }
                                errorMessage={errors.rewardType}
                            >
                                <Field name="rewardType">
                                    {({ field, form }: FieldProps) => (
                                        <Select
                                            isSearchable={false}
                                            placeholder="Select Reward Type"
                                            field={field}
                                            form={form}
                                            options={rewardTypeOptions}
                                            value={rewardTypeOptions?.filter(
                                                (option) =>
                                                    option.value ===
                                                    values.rewardType,
                                            )}
                                            onChange={(option) => {
                                                form.setFieldValue(
                                                    field.name,
                                                    option?.value,
                                                )
                                            }}
                                        />
                                    )}
                                </Field>
                            </FormItem>
                            <FormItem label="Status">
                                <Field name="status">
                                    {({
                                        field,
                                        form,
                                    }: FieldProps<FormModel>) => (
                                        <Select
                                            placeholder="Select Status"
                                            field={field}
                                            form={form}
                                            options={statusOptions}
                                            value={statusOptions.filter(
                                                (option) =>
                                                    option.value ===
                                                    values.status,
                                            )}
                                            onChange={(option) =>
                                                form.setFieldValue(
                                                    field.name,
                                                    option?.value,
                                                )
                                            }
                                        />
                                    )}
                                </Field>
                            </FormItem>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        )
    },
)

const DrawerFooter = ({
    onSaveClick,
    onCancel,
    onReset,
}: DrawerFooterProps) => {
    return (
        <>
            <div className="text-left w-full">
                <Button size="sm" variant="solid" onClick={onReset}>
                    Reset
                </Button>
            </div>
            <div className="text-right w-full">
                <Button size="sm" className="mr-2" onClick={onCancel}>
                    Cancel
                </Button>
                <Button size="sm" variant="solid" onClick={onSaveClick}>
                    Apply
                </Button>
            </div>
        </>
    )
}

const CampaignFilter = () => {
    const dispatch = useAppDispatch()

    const formikRef = useRef<FormikProps<FormModel>>(null)

    const [isOpen, setIsOpen] = useState(false)

    const openDrawer = () => {
        setIsOpen(true)
    }

    const onDrawerClose = () => {
        setIsOpen(false)
    }

    const formSubmit = () => {
        formikRef.current?.submitForm()
    }

    const tableData = useAppSelector(
        (state) => state.merchantRewardTracking.data.tableData
    )

    const resetForm = () => {
        // dispatch(setFilterData(initialFilterData))
        //const updatedTableData = omit(initialTableData, 'total')
        // dispatch(getCampaigns({ ...initialFilterData, ...tableData }))
        formikRef.current?.resetForm()
    }

    return (
        <>
            <Button
                size="sm"
                className="block md:inline-block ltr:md:ml-2 rtl:md:mr-2 md:mb-0 mb-4"
                icon={<HiOutlineFilter />}
                onClick={() => openDrawer()}
            >
                Filter By
            </Button>
            <Drawer
                title="Filter"
                isOpen={isOpen}
                footer={
                    <DrawerFooter
                        onReset={resetForm}
                        onCancel={onDrawerClose}
                        onSaveClick={formSubmit}
                    />
                }
                onClose={onDrawerClose}
                onRequestClose={onDrawerClose}
            >
                <FilterForm ref={formikRef} onSubmitComplete={onDrawerClose} />
            </Drawer>
        </>
    )
}

FilterForm.displayName = 'FilterForm'

export default CampaignFilter
