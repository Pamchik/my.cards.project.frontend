import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useGetProjectQuery } from "../../../../store/api/projectsApiSlice";
import { useEffectStoreData } from "../../../hooks/useEffectStoreData";
import { useComponentPreparation } from "../../../hooks/useComponentPreparation";
import { useAllComponentParamsReset } from "../../../hooks/useComponentDataReset";
import useTimeoutManager from "../../../hooks/useTimeoutManager";
import { useFieldValueChange } from "../../../hooks/useFieldValueChange";
import { IFieldParams, IInputTypes } from "../../../../store/componentsData/fieldsParamsSlice";
import BtnBlock from "../../../blocks/BtnBlock";
import ButtonMain from "../../../UI/buttons/ButtonMain";
import LoadingView from "../../../loading/LoadingView";
import ContentBlock from "../../../blocks/ContentBlock";
import BlockSelect from "../../../UI/fields/BlockSelect";
import { deleteChangedComponentData, IInputValue, ISelectValue, setInputData } from "../../../../store/componentsData/componentsDataSlice";
import { useGetProductTypesQuery } from "../../../../store/api/productTypeApiSlice";
import { useGetPaymentSystemsQuery } from "../../../../store/api/paymentSystemApiSlice";
import { useGetProductCategoriesQuery } from "../../../../store/api/productCategoryApiSlice";
import { setModalProps } from "../../../../store/modalData/modalsPropsDataSlice";
import { setModalOpen } from "../../../../store/modalData/modalsSlice";
import { funcConvertToFieldDataType } from "../../../functions/funcConvertToFieldDataType";
import BlockInput from "../../../UI/fields/BlockInput";
import { deleteComponentsAPIUpdate } from "../../../../store/componentsData/componentsAPIUpdateSlice";
import { setLoadingStatus } from "../../../../store/componentsData/loadingProcessSlice";
import { useGetDeliveriesInfoQuery } from "../../../../store/api/deliveryInfoApiSlice";
import { changeComponentReadOnly } from "../../../../store/componentsData/componentsReadOnlySlice";
import { deleteFieldInvalid } from "../../../../store/componentsData/fieldsInvalidSlice";
import { funcNumberWithThousandSeparator } from "../../../functions/funcNumberWithThousandSeparator";


interface IProjectMainData {
    selectedID: number
}

const ProjectMainData = ({
    selectedID,
}: IProjectMainData) => {

    const componentName = 'ProjectMainData'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const {loadingProcess, componentReadOnly, fieldParams, componentData, componentInvalidFields, savingProcess, componentsAPIUpdate } = useEffectStoreData(componentName)
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: projectData, isFetching: isFetchingProjectData, error: errorProjectData, refetch: refetchProjectData} = useGetProjectQuery({id: selectedID});
    const { data: productTypesData, isFetching: isFetchingProductTypesData, error: errorProductTypesData, refetch: refetchProductTypesData } = useGetProductTypesQuery(
        { vendor: componentData?.objInputAndChangedData['vendor'] as number },
        {
            skip: !componentData?.objInputAndChangedData['vendor'],
            selectFromResult: ({ data, ...other }) => ({
                data: componentData?.objInputAndChangedData['vendor'] ? data : [],
                ...other
            })
        }
    );
    const {data: paymentSystemsData, isFetching: isFetchingPaymentSystemsData, error: errorPaymentSystemsData, refetch: refetchPaymentSystemsData} = useGetPaymentSystemsQuery(undefined)
    const {data: productCategoriesData, isFetching: isFetchingProductCategoriesData, error: errorProductCategoriesData, refetch: refetchProductCategoriesData} = useGetProductCategoriesQuery(
        { payment_system: componentData?.objInputAndChangedData['payment_system'] as number},
        {   
            skip: !componentData?.objInputAndChangedData['payment_system'],
            selectFromResult: ({ data, ...other }) => ({
                data: componentData?.objInputAndChangedData['payment_system'] ? data : [],
                ...other
            })  
        }
    );
    const {data: deliveriesInfoData, isFetching: isFetchingDeliveriesInfoData, error: errorDeliveriesInfoData, refetch: refetchDeliveriesInfoData} = useGetDeliveriesInfoQuery({line_number: selectedID, deleted: 'False'});

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    useEffect(() => {
        if (componentsAPIUpdate.includes('projectData')) {
            updateAPIData('projectData', refetchProjectData)
        } else if (componentsAPIUpdate.includes('productTypesData')) {
            updateAPIData('productTypesData', refetchProductTypesData)
        } else if (componentsAPIUpdate.includes('paymentSystemsData')) {
            updateAPIData('paymentSystemsData', refetchPaymentSystemsData)
        } else if (componentsAPIUpdate.includes('productCategoriesData')) {
            updateAPIData('productCategoriesData', refetchProductCategoriesData)
        } else if (componentsAPIUpdate.includes('deliveriesInfoData')) {
            updateAPIData('deliveriesInfoData', refetchDeliveriesInfoData)
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
        'product_type': {isRequired: true, type: 'number'},
        'payment_system': {isRequired: true, type: 'number'},
        'product_category': {isRequired: false, type: 'number'},
        'product_name': {isRequired: false, type: 'text'},
        'product_code': {isRequired: false, type: 'text'},
        'product_revision': {isRequired: false, type: 'text'},
        'product_qty_from_bank': {isRequired: false, type: 'number', valueMinMax: {min: 0}},
        'product_sold': {isRequired: false, type: 'text'},
        'product_qty_to_vendor': {isRequired: false, type: 'number', valueMinMax: {min: 0}},
        'product_received': {isRequired: false, type: 'text'},
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
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['product_type']}}))
        if (isComponentPrepared && !productTypesData && !isFetchingProductTypesData && !errorProjectData) {
            if (!errorProductTypesData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['product_type']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['product_type']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingProductTypesData, isFetchingProjectData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['payment_system']}}))
        if (isComponentPrepared && !isFetchingPaymentSystemsData && !isFetchingProjectData && !errorProjectData) {
            if (!errorPaymentSystemsData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['payment_system']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['payment_system']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingPaymentSystemsData, isFetchingProjectData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['product_category']}}))
        if (isComponentPrepared && !isFetchingProductCategoriesData && !isFetchingProjectData && !errorProjectData) {
            if (!errorProductCategoriesData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['product_category']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['product_category']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingProductCategoriesData, isFetchingProjectData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['product_sold', 'product_received']}}))
        if (isComponentPrepared && !isFetchingDeliveriesInfoData && !isFetchingProjectData && !errorProjectData) {
            if (!errorDeliveriesInfoData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['product_sold', 'product_received']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['product_sold', 'product_received']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingDeliveriesInfoData, isFetchingProjectData]);

    const [totalSentQty, setTotalSentQty] = useState<string>('0')
    const [totalReceivedQty, setTotalReceivedQty] = useState<string>('0')
    useEffect(() => {
        if (deliveriesInfoData && deliveriesInfoData.length > 0) {
            const sentQty = deliveriesInfoData.filter(item => (
                                item.company_type === 'bank' &&
                                item.quantity !== null
                            )).reduce((total, payment) => total + (payment.quantity || 0), 0)
            setTotalSentQty(
                funcNumberWithThousandSeparator(sentQty)
            ) 

            const receivedQty = deliveriesInfoData.filter(item => (
                                    item.company_type === 'vendor' &&
                                    item.quantity !== null
                                )).reduce((total, payment) => total + (payment.quantity || 0), 0)
            setTotalReceivedQty(
                funcNumberWithThousandSeparator(receivedQty)
            )                 
        } else {
            setTotalSentQty('0')
            setTotalReceivedQty('0')
        }
    }, [deliveriesInfoData]);

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
                <ContentBlock line={true} title={'Описание продукта:'}>
                    <BlockSelect
                        fieldName={'product_type'}
                        showName={"name_rus"}
                        title={'Тип продукта'}
                        value={componentData?.objInputAndChangedData['product_type'] as ISelectValue}
                        options={productTypesData || []}
                        isEmptyOption={true}
                        onChange={() => {}}
                        skeletonLoading={loadingProcess?.['product_type']}
                        isRequired={fieldParams?.['product_type']?.isRequired}
                        isReadOnly={true}
                    ></BlockSelect>
                    <BlockSelect
                        fieldName={'payment_system'}
                        showName={"name"}
                        title={'Платежная система'}
                        value={componentData?.objInputAndChangedData['payment_system'] as ISelectValue}
                        options={paymentSystemsData || []}
                        isEmptyOption={true}
                        onChange={() => {}}
                        skeletonLoading={loadingProcess?.['payment_system']}
                        isRequired={fieldParams?.['payment_system']?.isRequired}
                        isReadOnly={true}
                    ></BlockSelect>
                    <BlockSelect
                        fieldName={'product_category'}
                        showName={"name"}
                        title={'Категория продукта'}
                        value={componentData?.objInputAndChangedData['product_category'] as ISelectValue}
                        options={productCategoriesData || []}
                        isEmptyOption={true}
                        onChange={(obj) => setValues(obj)}   
                        skeletonLoading={loadingProcess?.['product_category']}
                        isRequired={fieldParams?.['product_category']?.isRequired}  
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['product_category']}   
                        isChanged={!!componentData?.objChangedData?.['product_category']}  
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
                                        dispatch(setModalProps({componentName: 'CreateNewProductCategoryModal', data: {
                                            objChangedData: {
                                                active: true, 
                                                payment_system: componentData?.objInputAndChangedData['payment_system'] as ISelectValue
                                            },
                                            objReadOnlyFields: ['active', 'payment_system'],
                                            qtyFieldsForSavingBtn: 2
                                        }}))
                                        dispatch(setModalOpen('CreateNewProductCategoryModal'))
                                    },
                                    disabled: !!!componentData?.objInputAndChangedData['payment_system']
                                }, 
                                {
                                    name: "Изменить", 
                                    onClick: () => {
                                        const data = productCategoriesData?.find(item => item.id === componentData?.objInputAndChangedData['product_category'])
                                        if (data) {
                                            dispatch(setModalProps({componentName: 'CreateNewProductCategoryModal', data: {
                                                objInputData: funcConvertToFieldDataType(data),
                                                objReadOnlyFields: ['active', 'payment_system']
                                            }}))
                                            dispatch(setModalOpen('CreateNewProductCategoryModal'))
                                        } else {
                                            return {}
                                        }                                        
                                    }, 
                                    disabled: !!!componentData?.objInputAndChangedData['product_category']
                                }
                            ]}
                            myStyle={{width: '20px', height: '20px', margin: '2.5px 4px'}}
                        />
                    </BlockSelect>
                    <BlockInput
                        onChange={(obj) => setValues(obj)}
                        fieldName={'product_name'}
                        title={'Название продукта'}
                        type={fieldParams?.['product_name']?.type as IInputTypes}
                        value={componentData?.objInputAndChangedData['product_name'] as IInputValue}
                        placeholder={'Введите название'}
                        skeletonLoading={loadingProcess?.['product_name']}
                        isRequired={fieldParams?.['product_name']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['product_name']}
                        isChanged={!!componentData?.objChangedData?.['product_name']}
                    ></BlockInput>
                    <BlockInput
                        onChange={(obj) => setValues(obj)}
                        fieldName={'product_code'}
                        title={'Код продукта'}
                        type={fieldParams?.['product_code']?.type as IInputTypes}
                        value={componentData?.objInputAndChangedData['product_code'] as IInputValue}
                        placeholder={'Введите код продукта'}
                        skeletonLoading={loadingProcess?.['product_code']}
                        isRequired={fieldParams?.['product_code']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['product_code']}
                        isChanged={!!componentData?.objChangedData?.['product_code']}
                    ></BlockInput>
                    <BlockInput
                        onChange={(obj) => setValues(obj)}
                        fieldName={'product_revision'}
                        title={'Ревизия продукта'}
                        type={fieldParams?.['product_revision']?.type as IInputTypes}
                        value={componentData?.objInputAndChangedData['product_revision'] as IInputValue}
                        placeholder={'Введите ревизию продукта'}
                        skeletonLoading={loadingProcess?.['product_revision']}
                        isRequired={fieldParams?.['product_revision']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['product_revision']}
                        isChanged={!!componentData?.objChangedData?.['product_revision']}
                    ></BlockInput>
                </ContentBlock>
                <ContentBlock line={true} title={'Количество от Банка:'}>
                    <BlockInput
                        onChange={(obj) => setValues(obj)}
                        fieldName={'product_qty_from_bank'}
                        title={'Количество в заказе'}
                        type={fieldParams?.['product_qty_from_bank']?.type as IInputTypes}
                        value={componentData?.objInputAndChangedData['product_qty_from_bank'] as IInputValue}
                        placeholder={'Введите целое число'}
                        skeletonLoading={loadingProcess?.['product_qty_from_bank']}
                        isRequired={fieldParams?.['product_qty_from_bank']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['product_qty_from_bank']}
                        isChanged={!!componentData?.objChangedData?.['product_qty_from_bank']}
                    ></BlockInput>
                    <BlockInput
                        onChange={() => {}}
                        fieldName={'product_sold'}
                        title={'Проданное количество'}
                        type={fieldParams?.['product_sold']?.type as IInputTypes}
                        value={totalSentQty}
                        placeholder={''}
                        skeletonLoading={loadingProcess?.['product_sold']}
                        isRequired={fieldParams?.['product_sold']?.isRequired}
                        isReadOnly={true}
                    ></BlockInput>
                </ContentBlock>
                <ContentBlock title={'Количество для Вендора:'}>
                    <BlockInput
                        onChange={(obj) => setValues(obj)}
                        fieldName={'product_qty_to_vendor'}
                        title={'Количество в заказе'}
                        type={fieldParams?.['product_qty_to_vendor']?.type as IInputTypes}
                        value={componentData?.objInputAndChangedData['product_qty_to_vendor'] as IInputValue}
                        placeholder={'Введите целое число'}
                        skeletonLoading={loadingProcess?.['product_qty_to_vendor']}
                        isRequired={fieldParams?.['product_qty_to_vendor']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['product_qty_to_vendor']}
                        isChanged={!!componentData?.objChangedData?.['product_qty_to_vendor']}
                    ></BlockInput>
                    <BlockInput
                        onChange={() => {}}
                        fieldName={'product_received'}
                        title={'Полученное количество'}
                        type={fieldParams?.['product_received']?.type as IInputTypes}
                        value={totalReceivedQty}
                        placeholder={''}
                        skeletonLoading={loadingProcess?.['product_received']}
                        isRequired={fieldParams?.['product_received']?.isRequired}
                        isReadOnly={true}
                    ></BlockInput>
                </ContentBlock>
            </ContentBlock>
        </>)}
    </>)
}


export default ProjectMainData