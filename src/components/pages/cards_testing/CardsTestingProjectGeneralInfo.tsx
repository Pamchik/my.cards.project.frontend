import { useEffect, useState } from "react";
import { useEffectStoreData } from "../../hooks/useEffectStoreData";
import { useComponentPreparation } from "../../hooks/useComponentPreparation";
import { useFieldValueChange } from "../../hooks/useFieldValueChange";
import { useDispatch } from "react-redux";
import { useGetCardTestingQuery } from "../../../store/api/cardTestingApiSlice";
import { IFieldParams, IInputTypes } from "../../../store/componentsData/fieldsParamsSlice";
import { useGetBankQuery } from "../../../store/api/bankApiSlice";
import { useGetKeyExchangesQuery } from "../../../store/api/keyExchangeApiSlice";
import { useGetBankEmployeesQuery } from "../../../store/api/bankEmployeeApiSlice";
import { useGetVendorQuery } from "../../../store/api/vendorApiSlice";
import { useGetVendorEmployeesQuery } from "../../../store/api/vendorEmployeeApiSlice";
import { useGetVendorManufacturiesQuery } from "../../../store/api/vendorManufacturiesApiSlice";
import { setLoadingStatus } from "../../../store/componentsData/loadingProcessSlice";
import { funcConvertToFieldDataType } from "../../functions/funcConvertToFieldDataType";
import { deleteChangedComponentData, IInputValue, ISelectValue, setInputData } from "../../../store/componentsData/componentsDataSlice";
import { deleteComponentsAPIUpdate } from "../../../store/componentsData/componentsAPIUpdateSlice";
import BtnBlock from "../../blocks/BtnBlock";
import ButtonMain from "../../UI/buttons/ButtonMain";
import LoadingView from "../../loading/LoadingView";
import ContentBlock from "../../blocks/ContentBlock";
import BlockInput from "../../UI/fields/BlockInput";
import BlockSelect from "../../UI/fields/BlockSelect";
import { setModalProps } from "../../../store/modalData/modalsPropsDataSlice";
import { setModalOpen } from "../../../store/modalData/modalsSlice";
import { useGetCardTestTypesQuery } from "../../../store/api/cardTestTypeApiSlice";
import { useGetTestCardTransfersQuery } from "../../../store/api/testCardTransferApiSlice";
import { useAllComponentParamsReset } from "../../hooks/useComponentDataReset";
import useTimeoutManager from "../../hooks/useTimeoutManager";
import { changeComponentReadOnly } from "../../../store/componentsData/componentsReadOnlySlice";
import { deleteFieldInvalid } from "../../../store/componentsData/fieldsInvalidSlice";
import { funcNumberWithThousandSeparator } from "../../functions/funcNumberWithThousandSeparator";

interface ICardsTestingProjectGeneralInfo {
    selectedID: number
}

const CardsTestingProjectGeneralInfo = ({
    selectedID
}: ICardsTestingProjectGeneralInfo) => {

    const componentName = 'CardsTestingProjectGeneralInfo'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const { loadingProcess, fieldParams, componentData, componentReadOnly, componentInvalidFields, savingProcess, componentsAPIUpdate } = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)
    const dispatch = useDispatch()

    const { data: cardTestingData, isFetching: isFetchingCardTestingData, error: errorCardTestingData, refetch: refetchCardTestingData } = useGetCardTestingQuery({ id: selectedID });
    const { data: bankData, isFetching: isFetchingBankData, error: errorBankData, refetch: refetchBankData } = useGetBankQuery(
        { id: componentData?.objInputAndChangedData['bank'] as number },
        {
            skip: !componentData?.objInputAndChangedData['bank'],
            selectFromResult: ({ data, ...other }) => ({
                data: componentData?.objInputAndChangedData['bank'] ? data : [],
                ...other
            })
        }
    )
    const { data: keyExchangesData, isFetching: isFetchingKeyExchangesData, error: errorKeyExchangesData, refetch: refetchKeyExchangesData } = useGetKeyExchangesQuery(
        { vendor: componentData?.objInputAndChangedData['bank'] as number },
        {
            skip: !componentData?.objInputAndChangedData['bank'],
            selectFromResult: ({ data, ...other }) => ({
                data: componentData?.objInputAndChangedData['bank'] ? data : [],
                ...other
            })
        }
    )
    const { data: bankEmployeesData, isFetching: isFetchingBankEmployeesData, error: errorBankEmployeesData, refetch: refetchBankEmployeesData } = useGetBankEmployeesQuery(
        { bank: componentData?.objInputAndChangedData['bank'] as number },
        {
            skip: !componentData?.objInputAndChangedData['bank'],
            selectFromResult: ({ data, ...other }) => ({
                data: componentData?.objInputAndChangedData['bank'] ? data : [],
                ...other
            })
        }
    )
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
    const { data: vendorManufacturiesData, isFetching: isFetchingVendorManufacturiesData, error: errorVendorManufacturiesData, refetch: refetchVendorManufacturiesData } = useGetVendorManufacturiesQuery(
        { vendor: componentData?.objInputAndChangedData['vendor'] as number },
        {
            skip: !componentData?.objInputAndChangedData['vendor'],
            selectFromResult: ({ data, ...other }) => ({
                data: componentData?.objInputAndChangedData['vendor'] ? data : [],
                ...other
            })
        }
    )
    const { data: cardTestTypesData, isFetching: isFetchingCardTestTypesData, error: errorCardTestTypesData, refetch: refetchCardTestTypesData } = useGetCardTestTypesQuery(undefined)
    const { data: testCardTransfersData, isFetching: isFetchingTestCardTransfersData, error: errorTestCardTransfersData, refetch: refetchTestCardTransfersData } = useGetTestCardTransfersQuery(
        { card_testing_project: selectedID, deleted: 'False' },
        {
            skip: !selectedID,
            selectFromResult: ({ data, ...other }) => ({
                data: selectedID ? data : [],
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
        if (componentsAPIUpdate.includes('cardTestingData')) {
            updateAPIData('cardTestingData', refetchCardTestingData)
        } else if (componentsAPIUpdate.includes('cardTestTypesData')) {
            updateAPIData('cardTestTypesData', refetchCardTestTypesData)
        } else if (componentsAPIUpdate.includes('testCardTransfersData')) {
            updateAPIData('testCardTransfersData', refetchTestCardTransfersData)
        } else if (componentsAPIUpdate.includes('bankData')) {
            updateAPIData('bankData', refetchBankData)
        } else if (componentsAPIUpdate.includes('keyExchangesData')) {
            updateAPIData('keyExchangesData', refetchKeyExchangesData)
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
        'request_date': { isRequired: false, type: 'date' },
        'requested_quantity': { isRequired: false, type: 'number', valueMinMax: {min: 0} },
        'received_quantity': { isRequired: false, type: 'text' },
        'on_stock_quantity': { isRequired: false, type: 'text' },
        'bank': { isRequired: false, type: 'number' },
        'KCV': { isRequired: false, type: 'number' },
        'KCV_value': { isRequired: false, type: 'text' },
        'signed_form_date': { isRequired: false, type: 'date' },
        'signed_by': { isRequired: false, type: 'number' },
        'vendor': { isRequired: true, type: 'number' },
        'vendor_origin': { isRequired: false, type: 'number' },
        'vendor_consultant': { isRequired: false, type: 'number' },
        'input_code': { isRequired: false, type: 'text' }
    }

    useEffect(() => {
        componentPreparing({ loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams });
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({ componentName, data: { status: true, fields: Object.keys(initFieldParams) } }))
        if (isComponentPrepared) {
            if (!isFetchingCardTestingData) {
                if (!errorCardTestingData && cardTestingData) {
                    const myData = funcConvertToFieldDataType(cardTestingData[0])
                    dispatch(setInputData({ componentName, data: myData }))
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: true, fields: Object.keys(initFieldParams) } }))
                    }, 1000)
                } else {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: false, fields: Object.keys(initFieldParams) } }))
                    }, 1000)
                }
            }
        }
    }, [selectedID, isComponentPrepared, cardTestingData, isFetchingCardTestingData]); 

    useEffect(() => {
        dispatch(setLoadingStatus({ componentName, data: { status: true, fields: ['KCV', 'KCV_value'] } }))
        if (isComponentPrepared && !isFetchingKeyExchangesData && !isFetchingCardTestingData && !errorCardTestingData) {
            if (!errorKeyExchangesData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: true, fields: ['KCV', 'KCV_value'] } }))
                }, 1000)
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: false, fields: ['KCV', 'KCV_value'] } }))
                }, 1000)
            }
        }
    }, [selectedID, isComponentPrepared, isFetchingKeyExchangesData, isFetchingCardTestingData]);

    useEffect(() => {
        dispatch(setLoadingStatus({ componentName, data: { status: true, fields: ['bank'] } }))
        if (isComponentPrepared && !isFetchingBankData && !isFetchingCardTestingData && !errorCardTestingData) {
            if (!errorBankData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: true, fields: ['bank'] } }))
                }, 1000)
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: false, fields: ['bank'] } }))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingBankData, isFetchingCardTestingData]);

    useEffect(() => {
        dispatch(setLoadingStatus({ componentName, data: { status: true, fields: ['signed_by'] } }))
        if (isComponentPrepared && !isFetchingBankEmployeesData && !isFetchingCardTestingData && !errorCardTestingData) {
            if (!errorBankEmployeesData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: true, fields: ['signed_by'] } }))
                }, 1000)
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: false, fields: ['signed_by'] } }))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingBankEmployeesData, isFetchingCardTestingData]);

    useEffect(() => {
        dispatch(setLoadingStatus({ componentName, data: { status: true, fields: ['vendor'] } }))
        if (isComponentPrepared && !isFetchingVendorData && !isFetchingCardTestingData && !errorCardTestingData) {
            if (!errorVendorData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: true, fields: ['vendor'] } }))
                }, 1000)
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: false, fields: ['vendor'] } }))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingVendorData, isFetchingCardTestingData]);

    useEffect(() => {
        dispatch(setLoadingStatus({ componentName, data: { status: true, fields: ['vendor_origin'] } }))
        if (isComponentPrepared && !isFetchingVendorManufacturiesData && !isFetchingCardTestingData && !errorCardTestingData) {
            if (!errorVendorManufacturiesData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: true, fields: ['vendor_origin'] } }))
                }, 1000)
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: false, fields: ['vendor_origin'] } }))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingVendorManufacturiesData, isFetchingCardTestingData]);

    useEffect(() => {
        dispatch(setLoadingStatus({ componentName, data: { status: true, fields: ['vendor_consultant'] } }))
        if (isComponentPrepared && !isFetchingVendorEmployeesData && !isFetchingCardTestingData && !errorCardTestingData) {
            if (!errorVendorEmployeesData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: true, fields: ['vendor_consultant'] } }))
                }, 1000)
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: false, fields: ['vendor_consultant'] } }))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingVendorEmployeesData, isFetchingCardTestingData]);

    useEffect(() => {
        dispatch(setLoadingStatus({ componentName, data: { status: true, fields: ['received_quantity', 'on_stock_quantity'] } }))
        if (isComponentPrepared && !isFetchingTestCardTransfersData && !isFetchingCardTestingData && !errorCardTestingData) {
            if (!errorTestCardTransfersData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: true, fields: ['received_quantity', 'on_stock_quantity'] } }))
                }, 1000)
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: false, fields: ['received_quantity', 'on_stock_quantity'] } }))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingTestCardTransfersData, isFetchingCardTestingData]);

    const [isLiveType, setIsLiveType] = useState<boolean>(false)
    useEffect(() => {
        if (componentData?.objInputAndChangedData['type_card']) {
            const typeCardName = cardTestTypesData?.find(item => item.id === componentData?.objInputAndChangedData['type_card'])?.name
            if (typeCardName === 'Live') {
                setIsLiveType(true)
            } else {
                setIsLiveType(false)
            }
        } else {
            setIsLiveType(false)
        }
    }, [componentData?.objInputAndChangedData['type_card'], cardTestTypesData]);
    
    // Получение количества полученного
        const [receivedQuantity, setReceivedQuantity] = useState<string>('0')
        useEffect(() => {
            let qty = 0;
            testCardTransfersData?.forEach(item => {
                if (item.action === 1 && item.transfer_quantity) {
                    qty += +item.transfer_quantity
                }
            })
            setReceivedQuantity(funcNumberWithThousandSeparator(qty))
        }, [testCardTransfersData]);

    // Количество в остатке
        const [leftoverQuantity, setLeftoverQuantity] = useState<string>('0')
        useEffect(() => {
            let qty = 0;
            testCardTransfersData?.forEach(item => {
                if (item.action === 1 && item.transfer_quantity) {
                    qty += +item.transfer_quantity
                } else if (item.action === 2 && item.transfer_quantity) {
                    qty -= +item.transfer_quantity
                }
            })
            setLeftoverQuantity(funcNumberWithThousandSeparator(qty))
        }, [testCardTransfersData]);

    useEffect(() => {
        funcChangeCancelSet(true)
    }, [selectedID]);

    useEffect(() => {
        if (isFetchingCardTestingData) {
            funcChangeCancelSet(true)
        }
    }, [isFetchingCardTestingData]);

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
                        fieldName={'requested_quantity'}
                        title={'Количество в запросе'}
                        type={fieldParams?.['requested_quantity']?.type as IInputTypes}
                        value={componentData?.objInputAndChangedData['requested_quantity'] as IInputValue}
                        placeholder={'Введите количество'}
                        skeletonLoading={loadingProcess?.['requested_quantity']}
                        isRequired={fieldParams?.['requested_quantity']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['requested_quantity']}
                        isChanged={!!componentData?.objChangedData?.['requested_quantity']}
                        minValue={0}
                    />  
                    <BlockInput
                        onChange={() => { }}
                        fieldName={'received_quantity'}
                        title={'Количество полученное'}
                        type={fieldParams?.['received_quantity']?.type as IInputTypes}
                        value={receivedQuantity}
                        placeholder={''}
                        skeletonLoading={loadingProcess?.['received_quantity']}
                        isRequired={fieldParams?.['received_quantity']?.isRequired}
                        isReadOnly={true}
                    />   
                    <BlockInput
                        onChange={() => { }}
                        fieldName={'on_stock_quantity'}
                        title={'Остаток'}
                        type={fieldParams?.['on_stock_quantity']?.type as IInputTypes}
                        value={leftoverQuantity}
                        placeholder={''}
                        skeletonLoading={loadingProcess?.['on_stock_quantity']}
                        isRequired={fieldParams?.['on_stock_quantity']?.isRequired}
                        isReadOnly={true}
                    />                    
                </ContentBlock>

                {componentData?.objInputAndChangedData?.['is_for_bank'] && (<>
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
                        {isLiveType && <>
                            <BlockSelect
                                fieldName={'KCV'}
                                showName={"number"}
                                title={'K-код ключа'}
                                value={componentData?.objInputAndChangedData['KCV'] as ISelectValue}
                                options={keyExchangesData || []}
                                isEmptyOption={true}
                                onChange={(obj) => setValues(obj)}
                                skeletonLoading={loadingProcess?.['KCV']}
                                isRequired={true}
                                isReadOnly={componentReadOnly?.status}
                                isInvalidStatus={componentInvalidFields?.['KCV']}
                                isChanged={!!componentData?.objChangedData?.['KCV']}
                            /> 
                            <BlockInput
                                onChange={() => { }}
                                fieldName={'KCV_value'}
                                title={'Контрольная сумма'}
                                type={fieldParams?.['KCV_value']?.type as IInputTypes}
                                value={keyExchangesData?.find(item => item.id === componentData?.objInputAndChangedData['KCV'])?.KCV as IInputValue || ''}
                                placeholder={''}
                                skeletonLoading={loadingProcess?.['KCV_value']}
                                isRequired={fieldParams?.['KCV_value']?.isRequired}
                                isReadOnly={true}
                            />  
                            <BlockInput
                                onChange={(obj) => setValues(obj)}
                                fieldName={'signed_form_date'}
                                title={'Дата подписания формы'}
                                type={fieldParams?.['signed_form_date']?.type as IInputTypes}
                                value={componentData?.objInputAndChangedData['signed_form_date'] as IInputValue}
                                placeholder={''}
                                skeletonLoading={loadingProcess?.['signed_form_date']}
                                isRequired={fieldParams?.['signed_form_date']?.isRequired}
                                isReadOnly={componentReadOnly?.status}
                                isInvalidStatus={componentInvalidFields?.['signed_form_date']}
                                isChanged={!!componentData?.objChangedData?.['signed_form_date']}
                            />  
                            <BlockSelect
                                fieldName={'signed_by'}
                                showName={"name"}
                                title={'Подписант'}
                                value={componentData?.objInputAndChangedData['signed_by'] as ISelectValue}
                                options={bankEmployeesData || []}
                                isEmptyOption={true}
                                onChange={(obj) => setValues(obj)}
                                skeletonLoading={loadingProcess?.['signed_by']}
                                isRequired={fieldParams?.['signed_by']?.isRequired}
                                isReadOnly={componentReadOnly?.status}
                                isInvalidStatus={componentInvalidFields?.['signed_by']}
                                isChanged={!!componentData?.objChangedData?.['signed_by']}
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
                                                    componentName: 'CreateNewBankEmployeeModal', data: {
                                                        objChangedData: {
                                                            active: true,
                                                            bank: componentData?.objInputAndChangedData['bank']
                                                        },
                                                        objReadOnlyFields: ['active', 'bank'],
                                                        qtyFieldsForSavingBtn: 2
                                                    }
                                                }))
                                                dispatch(setModalOpen('CreateNewBankEmployeeModal'))
                                            }
                                        },
                                        {
                                            name: "Изменить",
                                            onClick: () => {
                                                const data = bankEmployeesData?.find(item => item.id === componentData?.objInputAndChangedData['signed_by'])
                                                if (data) {
                                                    dispatch(setModalProps({
                                                        componentName: 'CreateNewBankEmployeeModal', data: {
                                                            objInputData: funcConvertToFieldDataType(data),
                                                            objReadOnlyFields: ['active', 'bank'],
                                                            qtyFieldsForSavingBtn: 0
                                                        }
                                                    }))
                                                    dispatch(setModalOpen('CreateNewBankEmployeeModal'))
                                                } else {
                                                    return {}
                                                }
                                            },
                                            disabled: !!!componentData?.objInputAndChangedData['signed_by']
                                        }
                                    ]}
                                    myStyle={{ width: '20px', height: '20px', margin: '2.5px 4px' }}
                                />
                            </BlockSelect>
                        </>}
                    </ContentBlock>            
                </>)}

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
                            onClick={() => { }}
                            type={'other'}
                            color="transparent"
                            drop={true}
                            actions={[
                                {
                                    name: "Добавить",
                                    onClick: () => {
                                        dispatch(setModalProps({
                                            componentName: 'CreateNewVendorManufactureModal', data: {
                                                objChangedData: {
                                                    active: true,
                                                    vendor: componentData?.objInputAndChangedData['vendor']
                                                },
                                                objReadOnlyFields: ['active', 'vendor'],
                                                qtyFieldsForSavingBtn: 2
                                            }
                                        }))
                                        dispatch(setModalOpen('CreateNewVendorManufactureModal'))
                                    }
                                },
                                {
                                    name: "Изменить",
                                    onClick: () => {
                                        const data = vendorManufacturiesData?.find(item => item.id === componentData?.objInputAndChangedData['vendor_origin'])
                                        if (data) {
                                            dispatch(setModalProps({
                                                componentName: 'CreateNewVendorManufactureModal', data: {
                                                    objInputData: funcConvertToFieldDataType(data),
                                                    objReadOnlyFields: ['active', 'vendor'],
                                                    qtyFieldsForSavingBtn: 0
                                                }
                                            }))
                                            dispatch(setModalOpen('CreateNewVendorManufactureModal'))
                                        } else {
                                            return {}
                                        }
                                    },
                                    disabled: !!!componentData?.objInputAndChangedData['vendor_origin']
                                }
                            ]}
                            myStyle={{ width: '20px', height: '20px', margin: '2.5px 4px' }}
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
                                        const data = vendorEmployeesData?.find(item => item.id === componentData?.objInputAndChangedData['vendor_consultant'])
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
                                    disabled: !!!componentData?.objInputAndChangedData['vendor_consultant']
                                }
                            ]}
                            myStyle={{ width: '20px', height: '20px', margin: '2.5px 4px' }}
                        />
                    </BlockSelect> 
                    {isLiveType &&
                        <BlockInput
                            onChange={(obj) => setValues(obj)}
                            fieldName={'input_code'}
                            title={'Входящий код от вендора'}
                            type={fieldParams?.['input_code']?.type as IInputTypes}
                            value={componentData?.objInputAndChangedData['input_code'] as IInputValue}
                            placeholder={'Введите номер'}
                            skeletonLoading={loadingProcess?.['input_code']}
                            isRequired={fieldParams?.['input_code']?.isRequired}
                            isReadOnly={componentReadOnly?.status}
                            isInvalidStatus={componentInvalidFields?.['input_code']}
                            isChanged={!!componentData?.objChangedData?.['input_code']}
                        />
                    }
                </ContentBlock>
            </ContentBlock>
        </>)}
    </>)
}

export default CardsTestingProjectGeneralInfo