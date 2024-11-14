import { useEffect, useState } from "react";
import { useEffectStoreData } from "../../hooks/useEffectStoreData";
import { useComponentPreparation } from "../../hooks/useComponentPreparation";
import { useFieldValueChange } from "../../hooks/useFieldValueChange";
import { useDispatch } from "react-redux";
import { useGetKeyExchangeQuery } from "../../../store/api/keyExchangeApiSlice";
import { deleteComponentsAPIUpdate } from "../../../store/componentsData/componentsAPIUpdateSlice";
import { IFieldParams, IInputTypes } from "../../../store/componentsData/fieldsParamsSlice";
import { setLoadingStatus } from "../../../store/componentsData/loadingProcessSlice";
import { funcConvertToFieldDataType } from "../../functions/funcConvertToFieldDataType";
import { deleteChangedComponentData, IInputValue, ISelectValue, setInputData } from "../../../store/componentsData/componentsDataSlice";
import ButtonMain from "../../UI/buttons/ButtonMain";
import LoadingView from "../../loading/LoadingView";
import ContentBlock from "../../blocks/ContentBlock";
import BlockInput from "../../UI/fields/BlockInput";
import BlockSelect from "../../UI/fields/BlockSelect";
import { setModalProps } from "../../../store/modalData/modalsPropsDataSlice";
import { setModalOpen } from "../../../store/modalData/modalsSlice";
import { useGetBankQuery } from "../../../store/api/bankApiSlice";
import { useGetBankEmployeesQuery } from "../../../store/api/bankEmployeeApiSlice";
import { useGetVendorQuery } from "../../../store/api/vendorApiSlice";
import { useGetVendorEmployeesQuery } from "../../../store/api/vendorEmployeeApiSlice";
import { useGetVendorManufacturiesQuery } from "../../../store/api/vendorManufacturiesApiSlice";
import { useAllComponentParamsReset } from "../../hooks/useComponentDataReset";
import useTimeoutManager from "../../hooks/useTimeoutManager";
import { changeComponentReadOnly } from "../../../store/componentsData/componentsReadOnlySlice";
import { deleteFieldInvalid } from "../../../store/componentsData/fieldsInvalidSlice";


interface IKeyExchangeProjectParams {
    selectedID: number
}

const KeyExchangeProjectParams = ({
    selectedID,
}: IKeyExchangeProjectParams) => {

    const componentName = 'KeyExchangeProjectParams'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const { loadingProcess, fieldParams, componentData, componentReadOnly, componentInvalidFields, savingProcess, componentsAPIUpdate } = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: keyExchangeData, isFetching: isFetchingKeyExchangeData, error: errorKeyExchangeData, refetch: refetchKeyExchangeData} = useGetKeyExchangeQuery({id: selectedID});
    const {data: bankData, isFetching: isFetchingBankData, error: errorBankData, refetch: refetchBankData} = useGetBankQuery(
        { id: componentData?.objInputAndChangedData['bank'] as number},
        { 
            skip: !componentData?.objInputAndChangedData['bank'],
            selectFromResult: ({ data, ...other }) => ({
                data: componentData?.objInputAndChangedData['bank'] ? data : [],
                ...other
            })        
        }
    )
    const {data: bankEmployeesData, isFetching: isFetchingBankEmployeesData, error: errorBankEmployeesData, refetch: refetchBankEmployeesData} = useGetBankEmployeesQuery(
        { bank: componentData?.objInputAndChangedData['bank'] as number},
        { 
            skip: !componentData?.objInputAndChangedData['bank'],
            selectFromResult: ({ data, ...other }) => ({
                data: componentData?.objInputAndChangedData['bank'] ? data : [],
                ...other
            })        
        }
    )
    const {data: vendorData, isFetching: isFetchingVendorData, error: errorVendorData, refetch: refetchVendorData} = useGetVendorQuery(
        { id: componentData?.objInputAndChangedData['vendor'] as number},
        { 
            skip: !componentData?.objInputAndChangedData['vendor'],
            selectFromResult: ({ data, ...other }) => ({
                data: componentData?.objInputAndChangedData['vendor'] ? data : [],
                ...other
            })        
        }
    )
    const {data: vendorEmployeesData, isFetching: isFetchingVendorEmployeesData, error: errorVendorEmployeesData, refetch: refetchVendorEmployeesData} = useGetVendorEmployeesQuery(
        { vendor: componentData?.objInputAndChangedData['vendor'] as number},
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
        if (componentsAPIUpdate.includes('keyExchangeData')) {
            updateAPIData('keyExchangeData', refetchKeyExchangeData)
        } else if (componentsAPIUpdate.includes('bankData')) {
            updateAPIData('bankData', refetchBankData)
        } else if (componentsAPIUpdate.includes('bankEmployeesData')) {
            updateAPIData('bankEmployeesData', refetchBankEmployeesData)
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
        'request_date': {isRequired: false, type: 'date'},
        'KCV': {isRequired: false, type: 'text'},
        'key_label': {isRequired: false, type: 'text'},
        'bank': {isRequired: true, type: 'number'},
        'bank_KMC_name': {isRequired: false, type: 'number'},
        'vendor': {isRequired: true, type: 'number'},
        'vendor_origin': {isRequired: false, type: 'number'},
        'vendor_consultant': {isRequired: false, type: 'number'},
        'vendor_KMC_name': {isRequired: false, type: 'number'}
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: Object.keys(initFieldParams)}}))
        if (isComponentPrepared) {
            if (!isFetchingKeyExchangeData) {
                if (!errorKeyExchangeData && keyExchangeData) {
                    const myData = funcConvertToFieldDataType(keyExchangeData[0])
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
    }, [selectedID, isComponentPrepared, keyExchangeData, isFetchingKeyExchangeData]); 

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['bank']}}))
        if (isComponentPrepared && !isFetchingBankData && !isFetchingKeyExchangeData && !errorKeyExchangeData) {
            if (!errorBankData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['bank']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['bank']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingBankData, isFetchingKeyExchangeData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['bank_KMC_name']}}))
        if (isComponentPrepared && !isFetchingBankEmployeesData && !isFetchingKeyExchangeData && !errorKeyExchangeData) {
            if (!errorBankEmployeesData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['bank_KMC_name']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['bank_KMC_name']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingBankEmployeesData, isFetchingKeyExchangeData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['vendor']}}))
        if (isComponentPrepared && !isFetchingVendorData && !isFetchingKeyExchangeData && !errorKeyExchangeData) {
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
    }, [isComponentPrepared, isFetchingVendorData, isFetchingKeyExchangeData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['vendor_origin']}}))
        if (isComponentPrepared && !isFetchingVendorManufacturiesData && !isFetchingKeyExchangeData && !errorKeyExchangeData) {
            if (!errorVendorManufacturiesData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['vendor_origin']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['vendor_origin']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingVendorManufacturiesData, isFetchingKeyExchangeData]);

    useEffect(() => {
        dispatch(setLoadingStatus({ componentName, data: { status: true, fields: ['vendor_consultant', 'vendor_KMC_name']}}))
        if (isComponentPrepared && !isFetchingVendorEmployeesData && !isFetchingKeyExchangeData && !errorKeyExchangeData) {
            if (!errorVendorEmployeesData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: true, fields: ['vendor_consultant', 'vendor_KMC_name']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: false, fields: ['vendor_consultant', 'vendor_KMC_name']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingVendorEmployeesData, isFetchingKeyExchangeData]);

    useEffect(() => {
        funcChangeCancelSet(true)
    }, [selectedID]);

    useEffect(() => {
        if (isFetchingKeyExchangeData) {
            funcChangeCancelSet(true)
        }
    }, [isFetchingKeyExchangeData]);

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
                <ContentBlock line={true} title={'Общая информация:'}>
                    <BlockInput
                        onChange={(obj) => setValues(obj)}
                        fieldName={'request_date'}
                        title={'Дата запроса'}
                        type={fieldParams?.['request_date']?.type as IInputTypes}
                        value={componentData?.objInputAndChangedData['request_date'] as IInputValue}
                        placeholder={''}
                        skeletonLoading={loadingProcess?.['request_date']}
                        isRequired={fieldParams?.['request_date']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['request_date']}
                        isChanged={!!componentData?.objChangedData?.['request_date']}
                    />
                    <BlockInput
                        onChange={(obj) => setValues(obj)}
                        fieldName={'KCV'}
                        title={'KCV'}
                        type={fieldParams?.['KCV']?.type as IInputTypes}
                        value={componentData?.objInputAndChangedData['KCV'] as IInputValue}
                        placeholder={'Введите контрольную сумму'}
                        skeletonLoading={loadingProcess?.['KCV']}
                        isRequired={fieldParams?.['KCV']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['KCV']}
                        isChanged={!!componentData?.objChangedData?.['KCV']}
                    />
                    <BlockInput
                        onChange={(obj) => setValues(obj)}
                        fieldName={'key_label'}
                        title={'Key label'}
                        type={fieldParams?.['key_label']?.type as IInputTypes}
                        value={componentData?.objInputAndChangedData['key_label'] as IInputValue}
                        placeholder={'Введите ключевую метку'}
                        skeletonLoading={loadingProcess?.['key_label']}
                        isRequired={fieldParams?.['key_label']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['key_label']}
                        isChanged={!!componentData?.objChangedData?.['key_label']}
                    />
                </ContentBlock>
                <ContentBlock line={true} title={'Данные по Банку:'}>
                    <BlockSelect
                        fieldName={'bank'}
                        showName={"name_eng"}
                        title={'Банк'}
                        value={componentData?.objInputAndChangedData['bank'] as ISelectValue}
                        options={bankData || []}
                        onChange={(obj) => setValues(obj)}   
                        skeletonLoading={loadingProcess?.['bank']}
                        isRequired={fieldParams?.['bank']?.isRequired}  
                        isReadOnly={true} 
                    />
                    <BlockSelect
                        fieldName={'bank_KMC_name'}
                        showName={"name"}
                        title={'КМС от Банка'}
                        value={componentData?.objInputAndChangedData['bank_KMC_name'] as ISelectValue}
                        options={bankEmployeesData || []}
                        isEmptyOption={true}
                        onChange={(obj) => setValues(obj)}   
                        skeletonLoading={loadingProcess?.['bank_KMC_name']}
                        isRequired={fieldParams?.['bank_KMC_name']?.isRequired}  
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['bank_KMC_name']}   
                        isChanged={!!componentData?.objChangedData?.['bank_KMC_name']}  
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
                                        dispatch(setModalProps({componentName: 'CreateNewBankEmployeeModal', data: {
                                            objChangedData: {
                                                active: true,
                                                bank: componentData?.objInputAndChangedData['bank']
                                            },
                                            objReadOnlyFields: ['active', 'bank'],
                                            qtyFieldsForSavingBtn: 2
                                        }}))
                                        dispatch(setModalOpen('CreateNewBankEmployeeModal'))
                                    }
                                }, 
                                {
                                    name: "Изменить", 
                                    onClick: () => {
                                        const data = bankEmployeesData?.find(item => item.id === componentData?.objInputAndChangedData['bank_KMC_name'])
                                        if (data) {
                                            dispatch(setModalProps({componentName: 'CreateNewBankEmployeeModal', data: {
                                                objInputData: funcConvertToFieldDataType(data),
                                                objReadOnlyFields: ['active', 'bank'],
                                                qtyFieldsForSavingBtn: 0
                                            }}))
                                            dispatch(setModalOpen('CreateNewBankEmployeeModal'))
                                        } else {
                                            return {}
                                        }                                        
                                    }, 
                                    disabled: !!!componentData?.objInputAndChangedData['bank_KMC_name']
                                }
                            ]}
                            myStyle={{width: '20px', height: '20px', margin: '2.5px 4px'}}
                        />
                    </BlockSelect>
                </ContentBlock>
                <ContentBlock title={'Данные по Вендору:'}>
                    <BlockSelect
                        fieldName={'vendor'}
                        showName={"name"}
                        title={'Вендор'}
                        value={componentData?.objInputAndChangedData['vendor'] as ISelectValue}
                        options={vendorData || []}
                        onChange={(obj) => setValues(obj)}   
                        skeletonLoading={loadingProcess?.['vendor']}
                        isRequired={fieldParams?.['vendor']?.isRequired}  
                        isReadOnly={true} 
                    />
                    <BlockSelect
                        fieldName={'vendor_origin'}
                        showName={"name"}
                        title={'Завод'}
                        value={componentData?.objInputAndChangedData['vendor_origin'] as ISelectValue}
                        options={vendorManufacturiesData || []}
                        isEmptyOption={true}
                        onChange={(obj) => setValues(obj)}   
                        skeletonLoading={loadingProcess?.['vendor_origin']}
                        isRequired={fieldParams?.['vendor_origin']?.isRequired}  
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['vendor_origin']}   
                        isChanged={!!componentData?.objChangedData?.['vendor_origin']}  
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
                                        const data = vendorManufacturiesData?.find(item => item.id === componentData?.objInputAndChangedData['vendor_origin'])
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
                                    disabled: !!!componentData?.objInputAndChangedData['vendor_origin']
                                }
                            ]}
                            myStyle={{width: '20px', height: '20px', margin: '2.5px 4px'}}
                        />
                    </BlockSelect>
                    <BlockSelect
                        fieldName={'vendor_consultant'}
                        showName={"name"}
                        title={'Консультант'}
                        value={componentData?.objInputAndChangedData['vendor_consultant'] as ISelectValue}
                        options={vendorEmployeesData || []}
                        isEmptyOption={true}
                        onChange={(obj) => setValues(obj)}   
                        skeletonLoading={loadingProcess?.['vendor_consultant']}
                        isRequired={fieldParams?.['vendor_consultant']?.isRequired}  
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['vendor_consultant']}   
                        isChanged={!!componentData?.objChangedData?.['vendor_consultant']}  
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
                                        dispatch(setModalProps({componentName: 'CreateNewVendorEmployeeModal', data: {
                                            objChangedData: {
                                                active: true,
                                                vendor: componentData?.objInputAndChangedData['vendor']
                                            },
                                            objReadOnlyFields: ['active', 'vendor'],
                                            qtyFieldsForSavingBtn: 2
                                        }}))
                                        dispatch(setModalOpen('CreateNewVendorEmployeeModal'))
                                    }
                                }, 
                                {
                                    name: "Изменить", 
                                    onClick: () => {
                                        const data = vendorEmployeesData?.find(item => item.id === componentData?.objInputAndChangedData['vendor_consultant'])
                                        if (data) {
                                            dispatch(setModalProps({componentName: 'CreateNewVendorEmployeeModal', data: {
                                                objInputData: funcConvertToFieldDataType(data),
                                                objReadOnlyFields: ['active', 'vendor'],
                                                qtyFieldsForSavingBtn: 0
                                            }}))
                                            dispatch(setModalOpen('CreateNewVendorEmployeeModal'))
                                        } else {
                                            return {}
                                        }                                        
                                    }, 
                                    disabled: !!!componentData?.objInputAndChangedData['vendor_consultant']
                                }
                            ]}
                            myStyle={{width: '20px', height: '20px', margin: '2.5px 4px'}}
                        />
                    </BlockSelect>
                    <BlockSelect
                        fieldName={'vendor_KMC_name'}
                        showName={"name"}
                        title={'КМС от Вендора'}
                        value={componentData?.objInputAndChangedData['vendor_KMC_name'] as ISelectValue}
                        options={vendorEmployeesData || []}
                        isEmptyOption={true}
                        onChange={(obj) => setValues(obj)}   
                        skeletonLoading={loadingProcess?.['vendor_KMC_name']}
                        isRequired={fieldParams?.['vendor_KMC_name']?.isRequired}  
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['vendor_KMC_name']}   
                        isChanged={!!componentData?.objChangedData?.['vendor_KMC_name']}  
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
                                        dispatch(setModalProps({componentName: 'CreateNewVendorEmployeeModal', data: {
                                            objChangedData: {
                                                active: true,
                                                vendor: componentData?.objInputAndChangedData['vendor']
                                            },
                                            objReadOnlyFields: ['active', 'vendor'],
                                            qtyFieldsForSavingBtn: 2
                                        }}))
                                        dispatch(setModalOpen('CreateNewVendorEmployeeModal'))
                                    }
                                }, 
                                {
                                    name: "Изменить", 
                                    onClick: () => {
                                        const data = vendorEmployeesData?.find(item => item.id === componentData?.objInputAndChangedData['vendor_KMC_name'])
                                        if (data) {
                                            dispatch(setModalProps({componentName: 'CreateNewVendorEmployeeModal', data: {
                                                objInputData: funcConvertToFieldDataType(data),
                                                objReadOnlyFields: ['active', 'vendor'],
                                                qtyFieldsForSavingBtn: 0
                                            }}))
                                            dispatch(setModalOpen('CreateNewVendorEmployeeModal'))
                                        } else {
                                            return {}
                                        }                                        
                                    }, 
                                    disabled: !!!componentData?.objInputAndChangedData['vendor_KMC_name']
                                }
                            ]}
                            myStyle={{width: '20px', height: '20px', margin: '2.5px 4px'}}
                        />
                    </BlockSelect>
                </ContentBlock>
            </ContentBlock>
        </>)}
    </>)
}


export default KeyExchangeProjectParams