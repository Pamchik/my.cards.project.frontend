import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useGetProjectQuery } from "../../../../../../store/api/projectsApiSlice";
import { useGetDeliveriesInfoQuery } from "../../../../../../store/api/deliveryInfoApiSlice";
import { useComponentPreparation } from "../../../../../hooks/useComponentPreparation";
import { useAllComponentParamsReset } from "../../../../../hooks/useComponentDataReset";
import useTimeoutManager from "../../../../../hooks/useTimeoutManager";
import { useFieldValueChange } from "../../../../../hooks/useFieldValueChange";
import { IFieldParams, IInputTypes } from "../../../../../../store/componentsData/fieldsParamsSlice";
import { useEffectStoreData } from "../../../../../hooks/useEffectStoreData";
import { deleteAllComponentData, deleteChangedComponentData, ISelectValue, setInputData } from "../../../../../../store/componentsData/componentsDataSlice";
import { changeComponentReadOnly } from "../../../../../../store/componentsData/componentsReadOnlySlice";
import { deleteFieldInvalid, setFieldInvalid } from "../../../../../../store/componentsData/fieldsInvalidSlice";
import BtnBlock from "../../../../../blocks/BtnBlock";
import ContentBlock from "../../../../../blocks/ContentBlock";
import BlockInput from "../../../../../UI/fields/BlockInput";
import { setLoadingStatus } from "../../../../../../store/componentsData/loadingProcessSlice";
import { deleteComponentsAPIUpdate } from "../../../../../../store/componentsData/componentsAPIUpdateSlice";
import BlockSelect from "../../../../../UI/fields/BlockSelect";
import BlockCheckBox from "../../../../../UI/fields/BlockCheckBox";
import { useGetCurrenciesQuery } from "../../../../../../store/api/currencyApiSlice";
import { IPaymentInfoData, useGetPaymentsInfoQuery } from "../../../../../../store/api/paymentInfoApiSlice";
import ButtonMain from "../../../../../UI/buttons/ButtonMain";
import LoadingView from "../../../../../loading/LoadingView";
import { setSavingStatus } from "../../../../../../store/componentsData/savingProcessSlice";
import { funcValidateFields } from "../../../../../functions/funcValidateFields";
import { functionErrorMessage } from "../../../../../functions/functionErrorMessage";
import { useAddVendorPriceMutation, useGetVendorPriceQuery, useUpdateVendorPriceMutation } from "../../../../../../store/api/vendorPriceApiSlice";
import { funcConvertToFieldDataType } from "../../../../../functions/funcConvertToFieldDataType";
import { funcCheckNotEmpty } from "../../../../../functions/funcCheckNotEmpty";
import { funcFloatWithThousandSeparator } from "../../../../../functions/funcFloatWithThousandSeparator";
import { funcNumberWithThousandSeparator } from "../../../../../functions/funcNumberWithThousandSeparator";

interface IVendorPriceInfoData {
    selectedID: number
}

const VendorPriceInfo = ({
    selectedID,
}: IVendorPriceInfoData) => {

    const componentName = 'VendorPriceInfo'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const { loadingProcess, fieldParams, componentData, componentReadOnly, componentInvalidFields, savingProcess, componentsAPIUpdate } = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()
    const Decimal = require('decimal.js')

    const {data: projectData, isFetching: isFetchingProjectData, error: errorProjectData, refetch: refetchProjectData} = useGetProjectQuery({id: selectedID});
    const {data: deliveriesInfoData, isFetching: isFetchingDeliveriesInfoData, error: errorDeliveriesInfoData, refetch: refetchDeliveriesInfoData} = useGetDeliveriesInfoQuery({line_number: selectedID, company_type: 'vendor'});
    const {data: currenciesData, isFetching: isFetchingCurrenciesData, error: errorCurrenciesData, refetch: refetchCurrenciesData} = useGetCurrenciesQuery(undefined);
    const {data: paymentsInfoData, isFetching: isFetchingPaymentsInfoData, error: errorPaymentsInfoData, refetch: refetchPaymentsInfoData} = useGetPaymentsInfoQuery({line_number: selectedID, company_type: 'vendor', deleted: 'False'});
    const {data: vendorPriceData, isFetching: isFetchingVendorPriceData, error: errorVendorPriceData, refetch: refetchVendorPriceData} = useGetVendorPriceQuery({line_number: selectedID});

    const [updateVendorPrice, {}] = useUpdateVendorPriceMutation()
    const [addVendorPrice, {}] = useAddVendorPriceMutation()

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);
    
    useEffect(() => {
        if (componentsAPIUpdate.includes('projectData')) {
            updateAPIData('projectData', refetchProjectData)
        } else if (componentsAPIUpdate.includes('deliveriesVendorInfoData')) {
            updateAPIData('deliveriesVendorInfoData', refetchDeliveriesInfoData)
        } else if (componentsAPIUpdate.includes('currenciesData')) {
            updateAPIData('currenciesData', refetchCurrenciesData)
        } else if (componentsAPIUpdate.includes('paymentsVendorInfoData')) {
            updateAPIData('paymentsVendorInfoData', refetchPaymentsInfoData)
        } else if (componentsAPIUpdate.includes('vendorPriceData')) {
            updateAPIData('vendorPriceData', refetchVendorPriceData)
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
        'main_currency': {isRequired: false, type: 'number'},
        'unit_price': {isRequired: false, type: 'float'},
        'product_total_price': {isRequired: false, type: 'text'},
        'product_total_price_fact': {isRequired: false, type: 'text'},
        'payment_сurrency': {isRequired: false, type: 'number'},
        'prepaid_percent': {isRequired: false, type: 'number', valueMinMax: {min: 0, max: 100}},
        'prepaid_value': {isRequired: false, type: 'text'},
        'postpaid_percent': {isRequired: false, type: 'number', valueMinMax: {min: 0, max: 100}},
        'postpaid_value': {isRequired: false, type: 'text'},
        'epson_proof_cost': {isRequired: false, type: 'float'},
        'payment_system_approval_cost': {isRequired: false, type: 'float'},
        'certificate_of_origin_cost': {isRequired: false, type: 'float'}
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: Object.keys(initFieldParams)}}))
        if (isComponentPrepared) {
            if (!isFetchingProjectData && !isFetchingDeliveriesInfoData && !isFetchingPaymentsInfoData && !isFetchingVendorPriceData) {
                if (!errorProjectData && projectData && !errorDeliveriesInfoData && deliveriesInfoData && !errorPaymentsInfoData && paymentsInfoData && !errorVendorPriceData && vendorPriceData) {
                    const myData = funcConvertToFieldDataType(vendorPriceData[0])
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
    }, [selectedID, isComponentPrepared, projectData, deliveriesInfoData, paymentsInfoData, vendorPriceData, isFetchingProjectData, isFetchingDeliveriesInfoData, isFetchingPaymentsInfoData, isFetchingVendorPriceData]); 

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['main_currency', 'payment_сurrency']}}))
        if (isComponentPrepared && !isFetchingCurrenciesData && !isFetchingProjectData && !isFetchingDeliveriesInfoData && !isFetchingPaymentsInfoData && !isFetchingVendorPriceData && !errorProjectData && !errorDeliveriesInfoData && !errorPaymentsInfoData && !errorVendorPriceData) {
            if (!errorCurrenciesData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['main_currency', 'payment_сurrency']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['main_currency', 'payment_сurrency']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingCurrenciesData, isFetchingProjectData, isFetchingDeliveriesInfoData, isFetchingPaymentsInfoData, isFetchingVendorPriceData]);

    useEffect(() => {
        funcChangeCancelSet(true)
    }, [selectedID]);

    useEffect(() => {
        if (isFetchingProjectData || isFetchingDeliveriesInfoData || isFetchingPaymentsInfoData || isFetchingVendorPriceData) {
            funcChangeCancelSet(true)
        }
    }, [isFetchingProjectData, isFetchingDeliveriesInfoData, isFetchingPaymentsInfoData, isFetchingVendorPriceData]);

    async function funcSaveFields () {
        dispatch(setSavingStatus({componentName, data: {status: true}}))
        const currentId: number = componentData?.objInputAndChangedData['id'] as number
        const isValid = funcValidateFields(fieldParams, componentData?.objInputAndChangedData, componentData?.objChangedData)
        if (currentId) {
            if (isValid.isAllFieldsValid) {
                dispatch(deleteFieldInvalid({componentName}))
                const myData = componentData.objChangedData
                await updateVendorPrice({...myData, id: currentId}).unwrap()    
                .then((res) => {
                    dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: true}}))
                    dispatch(deleteAllComponentData({componentName}))
                    funcChangeCancelSet(true)
                    setManagedTimeout(() => { 
                        dispatch(setSavingStatus({ componentName, data: { status: false } }))
                    }, 1000)  
                }).catch((error) => {
                    const message = functionErrorMessage(error)
                    dispatch(setSavingStatus({ componentName, data: { status: true, isSuccessful: false, message: message} }))
                })             
            } else {
                dispatch(setFieldInvalid({componentName, data: isValid.data}))
                dispatch(setSavingStatus({componentName, data: {status: false}}))
            }
        } else {
            if (isValid.isAllFieldsValid) {
                dispatch(deleteFieldInvalid({componentName}))
                const myData = componentData.objChangedData
                await addVendorPrice({...myData, line_number: selectedID}).unwrap()    
                .then((res) => {
                    dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: true}}))
                    dispatch(deleteAllComponentData({componentName}))
                    setManagedTimeout(() => { 
                        dispatch(setSavingStatus({ componentName, data: { status: false } }))
                    }, 1000)  
                }).catch((error) => {
                    const message = functionErrorMessage(error)
                    dispatch(setSavingStatus({ componentName, data: { status: true, isSuccessful: false, message: message} }))
                })             
            } else {
                dispatch(setFieldInvalid({componentName, data: isValid.data}))
                dispatch(setSavingStatus({componentName, data: {status: false}}))
            }
        }
    }  

    function funcChangeCancelSet(newStatus: boolean) {
        dispatch(deleteChangedComponentData({componentName}))
        dispatch(changeComponentReadOnly({componentName, newStatus}))
        dispatch(deleteFieldInvalid({componentName}))            
    }

    const [objPaymentStates, setObjPaymentStates] = useState<{
        product_total_price: string | '', 
        product_total_price_fact: string | '', 
        postpaid_percent: number | '',
    }>
    ({
        product_total_price: '', 
        product_total_price_fact: '', 
        postpaid_percent: '',
    })

    const [totalReceivedQty, setTotalReceivedQty] = useState<number>(0)
    useEffect(() => {
        if (deliveriesInfoData && deliveriesInfoData.length > 0) {
            setTotalReceivedQty(
                deliveriesInfoData.filter(item => (
                    item.quantity !== null
                )).reduce((total, payment) => total + (payment.quantity || 0), 0)
            )       
        } else {
            setTotalReceivedQty(0)
        }
    }, [deliveriesInfoData]);

    useEffect(() => {
        const unitPrice = new Decimal(componentData?.objInputAndChangedData['unit_price'] as number || 0);
        const qty_plan = new Decimal(projectData?.[0].product_qty_to_vendor || 0)
        const qty_received = new Decimal(totalReceivedQty)

        const product_total_price = 
            funcCheckNotEmpty(componentData?.objInputAndChangedData, 'unit_price') 
            ? funcFloatWithThousandSeparator(unitPrice.mul(qty_plan))
            : ''

        const product_total_price_fact = 
            funcCheckNotEmpty(componentData?.objInputAndChangedData, 'unit_price') 
            ? funcFloatWithThousandSeparator(unitPrice.mul(qty_received))
            : ''        

        const postpaid_percent = 
            funcCheckNotEmpty(componentData?.objInputAndChangedData, 'prepaid_percent') 
            ? 100 - (componentData?.objInputAndChangedData['prepaid_percent'] as number || 0) 
            : ''

        setObjPaymentStates({
            product_total_price: product_total_price,
            product_total_price_fact: product_total_price_fact,
            postpaid_percent: postpaid_percent
        })
    }, [projectData, totalReceivedQty, componentData?.objInputAndChangedData]);

    const [totalPrepaidValue, setTotalPrepaidValue] = useState<string>('');
    const [totalPostValue, setTotalPostValue] = useState<string>('');

    useEffect(() => {
        if (paymentsInfoData && paymentsInfoData.length > 0) {
            // Фильтрация для предоплаты
            const prepaidPayments = paymentsInfoData.filter(item => (
                item.payment_type === 1 && 
                item.payment_value !== null
            ));

            // Фильтрация для постоплаты
            const postPayments = paymentsInfoData.filter(item => (
                item.payment_type === 2 && 
                item.payment_value !== null
            ));

            // Функция для группировки по валютам и суммирования
            const groupByCurrency = (payments: IPaymentInfoData[]) => {
                return payments.reduce((acc: { [key: number]: number }, payment: IPaymentInfoData) => {
                    const currency = payment.currency;
                    const value = payment.payment_value || 0;
                    
                    if (!acc[currency]) {
                        acc[currency] = 0;
                    }
            
                    acc[currency] += value;
            
                    return acc;
                }, {});
            };

            const prepaidSums = groupByCurrency(prepaidPayments);
            const postSums = groupByCurrency(postPayments);

            const formatCurrencySums = (sums: Record<string, number>) => {
                return Object.entries(sums)
                    .map(([currency, total]) => `${funcFloatWithThousandSeparator(total)} ${currenciesData?.find(item => item.id.toString() === currency)?.abbreviation || 'UNKNOWN'}`)
                    .join(' / ');
            };
                     
            setTotalPrepaidValue(formatCurrencySums(prepaidSums));
            setTotalPostValue(formatCurrencySums(postSums));
        } else {
            setTotalPrepaidValue('');
            setTotalPostValue('');
        }
    }, [paymentsInfoData, componentData?.objInputAndChangedData['payment_сurrency']]);

    function onCheckboxClick (fieldName: string, e: React.ChangeEvent<HTMLInputElement>) {
        const isChecked = e.target.checked;
        funcAdditionalCostAdd(fieldName, isChecked)
    }

    function funcAdditionalCostAdd (fieldName: string, isChecked: boolean) {
        if (fieldName === 'epson_proof_cost') {
            setValues({name: fieldName, value: isChecked ? 45 : null})
        } else if (fieldName === 'payment_system_approval_cost') {
            setValues({name: fieldName, value: isChecked ? 250 : null})
        } else if (fieldName === 'certificate_of_origin_cost') {
            setValues({name: fieldName, value: isChecked ? 0 : null})
        } else {}
    }   

    return (<>
        {isComponentPrepared && (<>
            <BtnBlock>
                {
                    componentData?.objChangedData && Object.keys(componentData.objChangedData).length > 0 && 
                    <ButtonMain
                        onClick={funcSaveFields} 
                        type={'submit'} 
                        title={'Сохранить'}
                    />
                }
                <ButtonMain 
                    onClick={() => funcChangeCancelSet(componentReadOnly?.status ? false : true)} 
                    type={'other'} 
                    color={'gray'}
                    myStyle={{width: '120px'}} 
                    title={!componentReadOnly?.status ? 'Отмена' : 'Редактировать'}
                />                 
            </BtnBlock>

            {savingProcess?.status && 
                <LoadingView
                    isSuccessful={savingProcess.isSuccessful} 
                    errorMessage={savingProcess.message} 
                    componentName={componentName} 
                />
            } 

            <ContentBlock myStyleMain={{flex: '0 0 auto'}} myStyleContent={{display: 'flex', flexDirection: 'row'}}>
                <ContentBlock title={'Стоимость для расчета:'} myStyleMain={{maxWidth: '20%'}} line={true}>
                    <BlockSelect
                        fieldName={'main_currency'}
                        showName={"name"}
                        title={'Основная валюта'}
                        value={componentData?.objInputAndChangedData['main_currency'] as ISelectValue}
                        options={currenciesData || []}
                        isEmptyOption={true}
                        onChange={(obj) => setValues(obj)}   
                        skeletonLoading={loadingProcess?.['main_currency']}
                        isRequired={fieldParams?.['main_currency']?.isRequired}  
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['main_currency']}   
                        isChanged={!!componentData?.objChangedData?.['main_currency']}  
                    ></BlockSelect>
                    <BlockInput
                        onChange={(obj) => setValues(obj)}   
                        fieldName={'unit_price'}
                        title={'Цена за единицу'}
                        type={fieldParams?.['unit_price']?.type as IInputTypes}
                        value={componentData?.objInputAndChangedData['unit_price'] as ISelectValue}
                        // placeholder={''}
                        skeletonLoading={loadingProcess?.['unit_price']}
                        isRequired={fieldParams?.['unit_price']?.isRequired}  
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['unit_price']}   
                        isChanged={!!componentData?.objChangedData?.['unit_price']}  
                    />   
                    <BlockInput
                        onChange={() => {}}
                        fieldName={'product_total_price'}
                        title={`Итого по заказанному (${funcNumberWithThousandSeparator(projectData?.[0]?.product_qty_to_vendor || 0)} шт)`}
                        type={fieldParams?.['product_total_price']?.type as IInputTypes}
                        value={objPaymentStates.product_total_price}
                        placeholder={''}
                        skeletonLoading={loadingProcess?.['product_total_price']}
                        isReadOnly={true}
                    />   
                    <BlockInput
                        onChange={() => {}}
                        fieldName={'product_total_price_fact'}
                        title={`Итого по фактическому (${funcNumberWithThousandSeparator(totalReceivedQty)} шт)`}
                        type={fieldParams?.['product_total_price_fact']?.type as IInputTypes}
                        value={objPaymentStates.product_total_price_fact}
                        placeholder={''}
                        skeletonLoading={loadingProcess?.['product_total_price_fact']}
                        isReadOnly={true}
                    />                  
                </ContentBlock>

                <ContentBlock title={'Условия оплаты:'} myStyleMain={{maxWidth: '40%'}} line={true}>
                    <BlockSelect
                        fieldName={'payment_сurrency'}
                        showName={"name"}
                        title={'Валюта для оплаты'}
                        value={componentData?.objInputAndChangedData['payment_сurrency'] as ISelectValue}
                        options={currenciesData || []}
                        isEmptyOption={true}
                        onChange={(obj) => setValues(obj)}   
                        skeletonLoading={loadingProcess?.['payment_сurrency']}
                        isRequired={fieldParams?.['payment_сurrency']?.isRequired}  
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['payment_сurrency']}   
                        isChanged={!!componentData?.objChangedData?.['payment_сurrency']}  
                        myStyle={{marginBottom: '0'}}
                    ></BlockSelect>

                    <ContentBlock myStyleMain={{flex: '0 0 auto', padding: '0'}} myStyleContent={{display: 'flex', flexDirection: 'row'}}>
                        <ContentBlock myStyleMain={{maxWidth: '50%', padding: '0'}}>
                            <BlockInput
                                onChange={(obj) => setValues(obj)}   
                                fieldName={'prepaid_percent'}
                                title={'Предоплата %'}
                                type={fieldParams?.['prepaid_percent']?.type as IInputTypes}
                                value={componentData?.objInputAndChangedData['prepaid_percent'] as ISelectValue}
                                // placeholder={''}
                                skeletonLoading={loadingProcess?.['prepaid_percent']}
                                isRequired={fieldParams?.['prepaid_percent']?.isRequired}  
                                isReadOnly={componentReadOnly?.status}
                                isInvalidStatus={componentInvalidFields?.['prepaid_percent']}   
                                isChanged={!!componentData?.objChangedData?.['prepaid_percent']}  
                            />
                            <BlockInput
                                onChange={() => {}}
                                fieldName={'prepaid_value'}
                                title={'Оплачено'}
                                type={fieldParams?.['prepaid_value']?.type as IInputTypes}
                                value={totalPrepaidValue}
                                placeholder={''}
                                skeletonLoading={loadingProcess?.['prepaid_value']}
                                isReadOnly={true}
                            /> 
                        </ContentBlock>
                        <ContentBlock myStyleMain={{maxWidth: '50%', padding: '0'}}>
                            <BlockInput
                                onChange={(obj) => {}}   
                                fieldName={'postpaid_percent'}
                                title={'Доплата %'}
                                type={fieldParams?.['postpaid_percent']?.type as IInputTypes}
                                value={objPaymentStates.postpaid_percent}
                                // placeholder={''}
                                skeletonLoading={loadingProcess?.['postpaid_percent']}
                                isReadOnly={true}
                            />
                            <BlockInput
                                onChange={() => {}}
                                fieldName={'postpaid_value'}
                                title={'Оплачено'}
                                type={fieldParams?.['postpaid_value']?.type as IInputTypes}
                                value={totalPostValue}
                                placeholder={''}
                                skeletonLoading={loadingProcess?.['postpaid_value']}
                                isReadOnly={true}
                            />  
                        </ContentBlock>
                    </ContentBlock>
                </ContentBlock>

                <ContentBlock title={'Дополнительные расходы:'} myStyleMain={{maxWidth: '40%', padding: '0', marginTop: '5px'}}>
                    <ContentBlock myStyleMain={{flex: '0 0 auto', padding: '0'}} myStyleContent={{display: 'flex', flexDirection: 'row', padding: '0'}}>
                        <BlockCheckBox
                            key={1} 
                            id={1}
                            isDisabled={componentReadOnly?.status}
                            fieldName={'epson_proof_cost'}
                            checked={(funcCheckNotEmpty(componentData?.objInputAndChangedData, 'epson_proof_cost'))}
                            onChange={onCheckboxClick}
                            myStyleCheckElement={{marginLeft: '20px', marginTop: '15px'}}
                            myStyleInput={{marginTop: '15px'}}
                            myStyleMain={{width: '50px'}}
                        ></BlockCheckBox>
                        <BlockInput
                            onChange={() => {}}
                            fieldName={'epson_proof_cost'}
                            title={'Подготовка пруфа'}
                            type={fieldParams?.['epson_proof_cost']?.type as IInputTypes}
                            value={componentData?.objInputAndChangedData['epson_proof_cost'] as ISelectValue}
                            placeholder={'Стандартно 45 евро'}
                            skeletonLoading={loadingProcess?.['epson_proof_cost']}
                            isReadOnly={true}
                            myStyle={{width: 'calc(100% - 50px)', marginBottom: '0'}}
                        ></BlockInput>  
                    </ContentBlock>
                    <ContentBlock myStyleMain={{flex: '0 0 auto', padding: '0'}} myStyleContent={{display: 'flex', flexDirection: 'row', padding: '0'}}>
                        <BlockCheckBox
                            key={2} 
                            id={2}
                            isDisabled={componentReadOnly?.status}
                            fieldName={'payment_system_approval_cost'}
                            checked={(funcCheckNotEmpty(componentData?.objInputAndChangedData, 'payment_system_approval_cost'))}
                            onChange={onCheckboxClick}
                            myStyleCheckElement={{marginLeft: '20px', marginTop: '15px'}}
                            myStyleInput={{marginTop: '15px'}}
                            myStyleMain={{width: '50px'}}
                        ></BlockCheckBox>
                        <BlockInput
                            onChange={() => {}}
                            fieldName={'payment_system_approval_cost'}
                            title={'Согласование в ПС'}
                            type={fieldParams?.['payment_system_approval_cost']?.type as IInputTypes}
                            value={componentData?.objInputAndChangedData['payment_system_approval_cost'] as ISelectValue}
                            placeholder={'Стандартно 250 евро для MC'}
                            skeletonLoading={loadingProcess?.['payment_system_approval_cost']}
                            isReadOnly={true}
                            myStyle={{width: 'calc(100% - 50px)', marginBottom: '0'}}
                        ></BlockInput>   
                    </ContentBlock>
                    <ContentBlock myStyleMain={{flex: '0 0 auto', padding: '0'}} myStyleContent={{display: 'flex', flexDirection: 'row', padding: '0'}}>
                        <BlockCheckBox
                            key={3} 
                            id={3}
                            isDisabled={componentReadOnly?.status}
                            fieldName={'certificate_of_origin_cost'}
                            checked={(funcCheckNotEmpty(componentData?.objInputAndChangedData, 'certificate_of_origin_cost'))}
                            onChange={onCheckboxClick}
                            myStyleCheckElement={{marginLeft: '20px', marginTop: '15px'}}
                            myStyleInput={{marginTop: '15px'}}
                            myStyleMain={{width: '50px'}}
                        ></BlockCheckBox>
                        <BlockInput
                            onChange={() => {}}
                            fieldName={'certificate_of_origin_cost'}
                            title={'Сертификат происхождения'}
                            type={fieldParams?.['certificate_of_origin_cost']?.type as IInputTypes}
                            value={componentData?.objInputAndChangedData['certificate_of_origin_cost'] as ISelectValue}
                            placeholder={'Стандартно 0 евро'}
                            skeletonLoading={loadingProcess?.['certificate_of_origin_cost']}
                            isReadOnly={true}
                            myStyle={{width: 'calc(100% - 50px)', marginBottom: '0'}}
                        ></BlockInput> 
                    </ContentBlock>

                </ContentBlock>
            </ContentBlock>
        </>)}
    </>)
}


export default VendorPriceInfo