import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useGetProjectQuery } from "../../../../store/api/projectsApiSlice";
import { useEffectStoreData } from "../../../hooks/useEffectStoreData";
import { useComponentPreparation } from "../../../hooks/useComponentPreparation";
import { useAllComponentParamsReset } from "../../../hooks/useComponentDataReset";
import useTimeoutManager from "../../../hooks/useTimeoutManager";
import { useFieldValueChange } from "../../../hooks/useFieldValueChange";
import { IFieldParams, ITextareaTypes } from "../../../../store/componentsData/fieldsParamsSlice";
import BtnBlock from "../../../blocks/BtnBlock";
import ButtonMain from "../../../UI/buttons/ButtonMain";
import LoadingView from "../../../loading/LoadingView";
import ContentBlock from "../../../blocks/ContentBlock";
import BlockSelect from "../../../UI/fields/BlockSelect";
import { deleteChangedComponentData, IInputValue, ISelectValue, ITextareaValue, setInputData } from "../../../../store/componentsData/componentsDataSlice";
import { setModalProps } from "../../../../store/modalData/modalsPropsDataSlice";
import { setModalOpen } from "../../../../store/modalData/modalsSlice";
import { funcConvertToFieldDataType } from "../../../functions/funcConvertToFieldDataType";
import BlockInput from "../../../UI/fields/BlockInput";
import { deleteComponentsAPIUpdate } from "../../../../store/componentsData/componentsAPIUpdateSlice";
import { setLoadingStatus } from "../../../../store/componentsData/loadingProcessSlice";
import BlockTextarea from "../../../UI/fields/BlockTextarea";
import { useGetVendorQuery } from "../../../../store/api/vendorApiSlice";
import { useGetVendorEmployeesQuery } from "../../../../store/api/vendorEmployeeApiSlice";
import { useGetVendorManufacturiesQuery } from "../../../../store/api/vendorManufacturiesApiSlice";
import { changeComponentReadOnly } from "../../../../store/componentsData/componentsReadOnlySlice";
import { deleteFieldInvalid } from "../../../../store/componentsData/fieldsInvalidSlice";


interface IProjectVendorInfo {
    selectedID: number
}

const ProjectVendorInfo = ({
    selectedID,
}: IProjectVendorInfo) => {

    const componentName = 'ProjectVendorInfo'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const {loadingProcess, fieldParams, componentData, componentReadOnly, componentInvalidFields, savingProcess, componentsAPIUpdate } = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: projectData, isFetching: isFetchingProjectData, error: errorProjectData, refetch: refetchProjectData} = useGetProjectQuery({id: selectedID});
    const { data: vendorData, isFetching: isFetchingVendorData, error: errorVendorData, refetch: refetchVendorData } = useGetVendorQuery(
        { id: componentData?.objInputAndChangedData['vendor'] as number },
        {
            skip: !componentData?.objInputAndChangedData['vendor'],
            selectFromResult: ({ data, ...other }) => ({
                data: componentData?.objInputAndChangedData['vendor'] ? data : [],
                ...other
            })
        }
    )
    const { data: vendorEmployeesData, isFetching: isFetchingVendorEmployeesData, error: errorVendorEmployeesData, refetch: refetchVendorEmployeesData } = useGetVendorEmployeesQuery(
        { vendor: componentData?.objInputAndChangedData['vendor'] as number },
        {
            skip: !componentData?.objInputAndChangedData['vendor'],
            selectFromResult: ({ data, ...other }) => ({
                data: componentData?.objInputAndChangedData['vendor'] ? data : [],
                ...other
            })
        }
    )
    const {data: vendorManufacturiesData, isFetching: isFetchingVendorManufacturiesData, error: errorVendorManufacturiesData, refetch: refetchVendorManufacturiesData} = useGetVendorManufacturiesQuery(
        { vendor: componentData?.objInputAndChangedData['vendor'] as number},
        { 
            skip: !componentData?.objInputAndChangedData['vendor'],
            selectFromResult: ({ data, ...other }) => ({
                data: componentData?.objInputAndChangedData['vendor'] ? data : [],
                ...other
            })        
        }
    )

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    useEffect(() => {
        if (componentsAPIUpdate.includes('projectData')) {
            updateAPIData('projectData', refetchProjectData)
        } else if (componentsAPIUpdate.includes('vendorData')) {
            updateAPIData('vendorData', refetchVendorData)
        } else if (componentsAPIUpdate.includes('vendorEmployeesData')) {
            updateAPIData('vendorEmployeesData', refetchVendorEmployeesData)
        } else if (componentsAPIUpdate.includes('vendorManufacturiesData')) {
            updateAPIData('vendorManufacturiesData', refetchVendorManufacturiesData)
        }
    }, [componentsAPIUpdate]);

    function updateAPIData (name: string, refetchFunc: () => void) {
        try {
            refetchFunc();
        } catch (error) {} finally {
            dispatch(deleteComponentsAPIUpdate([name])) 
        } 
    }
    
    const initFieldParams: IFieldParams = {
        'vendor_employee': {isRequired: false, type: 'number'},
        'vendor_communication': {isRequired: false, type: 'text'},
        'vendor': {isRequired: false, type: 'text'},
        'vendor_manufacture_country': {isRequired: false, type: 'number'},
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: Object.keys(initFieldParams)}}))
        if (isComponentPrepared) {
            if (!isFetchingProjectData) {
                if (!errorProjectData && projectData) {
                    const myData = funcConvertToFieldDataType(projectData[0])
                    dispatch(setInputData({componentName, data: myData}))
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: Object.keys(initFieldParams)}}))
                    }, 1000)  
                } else {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: Object.keys(initFieldParams)}}))
                    }, 1000)
                }
            }
        }
    }, [selectedID, isComponentPrepared, projectData, isFetchingProjectData]); 

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['vendor']}}))
        if (isComponentPrepared && !isFetchingVendorData && !isFetchingProjectData && !errorProjectData) {
            if (!errorVendorData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['vendor']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['vendor']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingVendorData, isFetchingProjectData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['vendor_manufacture_country']}}))
        if (isComponentPrepared && !isFetchingVendorManufacturiesData && !isFetchingProjectData && !errorProjectData) {
            if (!errorVendorManufacturiesData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['vendor_manufacture_country']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['vendor_manufacture_country']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingVendorManufacturiesData, isFetchingProjectData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['vendor_employee']}}))
        if (isComponentPrepared && !isFetchingVendorEmployeesData && !isFetchingProjectData && !errorProjectData) {
            if (!errorVendorEmployeesData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['vendor_employee']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['vendor_employee']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingVendorEmployeesData, isFetchingProjectData]);

    useEffect(() => {
        funcChangeCancelSet(true)
    }, [selectedID]);

    useEffect(() => {
        if (isFetchingProjectData) {
            funcChangeCancelSet(true)
        }
    }, [isFetchingProjectData]);

    function funcChangeCancelSet(newStatus: boolean) {
        dispatch(deleteChangedComponentData({componentName}))
        dispatch(changeComponentReadOnly({componentName, newStatus}))
        dispatch(deleteFieldInvalid({componentName}))        
    }

    return (<>
        {isComponentPrepared && (<>

            {savingProcess?.status && 
                <LoadingView
                    isSuccessful={savingProcess.isSuccessful} 
                    errorMessage={savingProcess.message} 
                    componentName={componentName} 
                />
            } 

            <ContentBlock myStyleContent={{flexDirection: 'row', display: 'flex', height: '100%'}}>
                <ContentBlock line={true} title={'Реквизиты Вендора:'}>
                    <BlockInput
                        onChange={() => {}}
                        fieldName={'vendor'}
                        title={'Вендор'}
                        type={'text'}
                        value={vendorData?.find(item => item.id === componentData?.objInputAndChangedData['vendor'])?.name as IInputValue}
                        placeholder={''}
                        skeletonLoading={loadingProcess?.['vendor']}
                        isRequired={false}
                        isReadOnly={true}
                    ></BlockInput>
                    <BlockSelect
                        fieldName={'vendor_manufacture_country'}
                        showName={"name"}
                        title={'Завод'}
                        value={componentData?.objInputAndChangedData['vendor_manufacture_country'] as ISelectValue}
                        options={vendorManufacturiesData || []}
                        isEmptyOption={true}
                        onChange={(obj) => setValues(obj)}   
                        skeletonLoading={loadingProcess?.['vendor_manufacture_country']}
                        isRequired={fieldParams?.['vendor_manufacture_country']?.isRequired}  
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['vendor_manufacture_country']}   
                        isChanged={!!componentData?.objChangedData?.['vendor_manufacture_country']}  
                    >
                        <ButtonMain
                            onClick={() => {}}
                            type={'other'}
                            color="transparent"
                            drop={true}
                            actions={[
                                {
                                    name: "Добавить", 
                                    onClick: () => {
                                        dispatch(setModalProps({componentName: 'CreateNewVendorManufactureModal', data: {
                                            objChangedData: {
                                                active: true,
                                                vendor: componentData?.objInputAndChangedData['vendor']
                                            },
                                            objReadOnlyFields: ['active', 'vendor'],
                                            qtyFieldsForSavingBtn: 2
                                        }}))
                                        dispatch(setModalOpen('CreateNewVendorManufactureModal'))
                                    }
                                }, 
                                {
                                    name: "Изменить", 
                                    onClick: () => {
                                        const data = vendorManufacturiesData?.find(item => item.id === componentData?.objInputAndChangedData['vendor_manufacture_country'])
                                        if (data) {
                                            dispatch(setModalProps({componentName: 'CreateNewVendorManufactureModal', data: {
                                                objInputData: funcConvertToFieldDataType(data),
                                                objReadOnlyFields: ['active', 'vendor'],
                                                qtyFieldsForSavingBtn: 0
                                            }}))
                                            dispatch(setModalOpen('CreateNewVendorManufactureModal'))
                                        } else {
                                            return {}
                                        }                                        
                                    }, 
                                    disabled: !!!componentData?.objInputAndChangedData['vendor_manufacture_country']
                                }
                            ]}
                            myStyle={{width: '20px', height: '20px', margin: '2.5px 4px'}}
                        />
                    </BlockSelect>
                </ContentBlock>
                <ContentBlock line={true} title={'Контакты Вендора:'}>
                    <BlockSelect
                        fieldName={'vendor_employee'}
                        showName={"name"}
                        title={'Имя сотрудника'}
                        value={componentData?.objInputAndChangedData['vendor_employee'] as ISelectValue}
                        options={vendorEmployeesData || []}
                        isEmptyOption={true}
                        onChange={(obj) => setValues(obj)}
                        skeletonLoading={loadingProcess?.['vendor_employee']}
                        isRequired={fieldParams?.['vendor_employee']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['vendor_employee']}
                        isChanged={!!componentData?.objChangedData?.['vendor_employee']}
                    >
                        <ButtonMain
                            onClick={() => { }}
                            type={'other'}
                            color="transparent"
                            drop={true}
                            actions={[
                                {
                                    name: "Добавить",
                                    onClick: () => {
                                        dispatch(setModalProps({
                                            componentName: 'CreateNewVendorEmployeeModal', data: {
                                                objChangedData: {
                                                    active: true,
                                                    vendor: componentData?.objInputAndChangedData['vendor']
                                                },
                                                objReadOnlyFields: ['active', 'vendor'],
                                                qtyFieldsForSavingBtn: 2
                                            }
                                        }))
                                        dispatch(setModalOpen('CreateNewVendorEmployeeModal'))
                                    }
                                },
                                {
                                    name: "Изменить",
                                    onClick: () => {
                                        const data = vendorEmployeesData?.find(item => item.id === componentData?.objInputAndChangedData['vendor_employee'])
                                        if (data) {
                                            dispatch(setModalProps({
                                                componentName: 'CreateNewVendorEmployeeModal', data: {
                                                    objInputData: funcConvertToFieldDataType(data),
                                                    objReadOnlyFields: ['active', 'vendor'],
                                                    qtyFieldsForSavingBtn: 0
                                                }
                                            }))
                                            dispatch(setModalOpen('CreateNewVendorEmployeeModal'))
                                        } else {
                                            return {}
                                        }
                                    },
                                    disabled: !!!componentData?.objInputAndChangedData['vendor_employee']
                                }
                            ]}
                            myStyle={{ width: '20px', height: '20px', margin: '2.5px 4px' }}
                        />
                    </BlockSelect>
                    <BlockInput
                        onChange={() => {}}
                        fieldName={'vendor_employee_email'}
                        title={'Почта сотрудника'}
                        type={'text'}
                        value={vendorEmployeesData?.find(item => item.id === componentData?.objInputAndChangedData['vendor_employee'])?.email as IInputValue}
                        placeholder={''}
                        skeletonLoading={loadingProcess?.['vendor_employee']}
                        isRequired={false}
                        isReadOnly={true}
                    ></BlockInput>
                    <BlockInput
                        onChange={() => {}}
                        fieldName={'vendor_employee_phone'}
                        title={'Телефон сотрудника'}
                        type={'text'}
                        value={vendorEmployeesData?.find(item => item.id === componentData?.objInputAndChangedData['vendor_employee'])?.phone as IInputValue}
                        placeholder={''}
                        skeletonLoading={loadingProcess?.['vendor_employee']}
                        isRequired={false}
                        isReadOnly={true}
                    ></BlockInput>
                    <BlockTextarea
                        onChange={() => {}}
                        fieldName={'vendor_employee_other'}
                        title={'Дополнительная информация'}
                        type={'text'}
                        value={vendorEmployeesData?.find(item => item.id === componentData?.objInputAndChangedData['vendor_employee'])?.other as ITextareaValue}
                        placeholder={''}
                        skeletonLoading={loadingProcess?.['vendor_employee']}
                        isRequired={false}
                        isReadOnly={true}
                    ></BlockTextarea>
                </ContentBlock>
                <ContentBlock title={'Общение по заказу:'}>
                    <BlockTextarea
                        onChange={(obj) => setValues(obj)}
                        fieldName={'vendor_communication'}
                        title={'Тема письма с Вендором'}
                        type={fieldParams?.['vendor_communication']?.type as ITextareaTypes}
                        value={componentData?.objInputAndChangedData['vendor_communication'] as ITextareaTypes}
                        placeholder={'Введите текст'}
                        skeletonLoading={loadingProcess?.['vendor_communication']}
                        isRequired={fieldParams?.['vendor_communication']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['vendor_communication']}
                        isChanged={!!componentData?.objChangedData?.['vendor_communication']}
                        rows={11}
                    ></BlockTextarea>
                </ContentBlock>
            </ContentBlock>
        </>)}
    </>)
}


export default ProjectVendorInfo