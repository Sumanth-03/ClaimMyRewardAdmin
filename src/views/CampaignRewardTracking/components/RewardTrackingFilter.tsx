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
    { label: 'null', value: 'null' }
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
                                label="filter"
                                invalid={
                                    (errors && touched) as boolean
                                }
                                errorMessage={''}
                            >
                                <Field name="type">
                                    {({ field, form }: FieldProps) => (
                                        <Select
                                            isSearchable={false}
                                            placeholder="Select"
                                            field={field}
                                            form={form}
                                            options={typeOptions}
                                            value={typeOptions?.filter(
                                                (option) =>
                                                    option.value ===
                                                    values,
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
        (state) => state.rewardTracking.data.tableData
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
