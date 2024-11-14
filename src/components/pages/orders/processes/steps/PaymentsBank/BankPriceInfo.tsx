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
import { funcConvertToFieldDataType } from "../../../../../functions/funcConvertToFieldDataType";
import { funcCheckNotEmpty } from "../../../../../functions/funcCheckNotEmpty";
import { useGetBanksQuery } from "../../../../../../store/api/bankApiSlice";
import { useAddBankPriceMutation, useGetBankPriceQuery, useUpdateBankPriceMutation } from "../../../../../../store/api/bankPriceApiSlice";
import { funcFloatWithThousandSeparator } from "../../../../../functions/funcFloatWithThousandSeparator";
import { funcNumberWithThousandSeparator } from "../../../../../functions/funcNumberWithThousandSeparator";


interface IBankPriceInfoData {
    selectedID: number
}

const BankPriceInfo = ({
    selectedID,
}: IBankPriceInfoData) => {

    const componentName = 'BankPriceInfo'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const { loadingProcess, fieldParams, componentData, componentReadOnly, componentInvalidFields, savingProcess, componentsAPIUpdate } = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()
    const Decimal = require('decimal.js')

    const {data: projectData, isFetching: isFetchingProjectData, error: errorProjectData, refetch: refetchProjectData} = useGetProjectQuery({id: selectedID});
    const {data: deliveriesInfoData, isFetching: isFetchingDeliveriesInfoData, error: errorDeliveriesInfoData, refetch: refetchDeliveriesInfoData} = useGetDeliveriesInfoQuery({line_number: selectedID, company_type: 'bank'});
    const {data: currenciesData, isFetching: isFetchingCurrenciesData, error: errorCurrenciesData, refetch: refetchCurrenciesData} = useGetCurrenciesQuery(undefined);
    const {data: paymentsInfoData, isFetching: isFetchingPaymentsInfoData, error: errorPaymentsInfoData, refetch: refetchPaymentsInfoData} = useGetPaymentsInfoQuery({line_number: selectedID, company_type: 'bank', deleted: 'False'});
    const {data: bankPriceData, isFetching: isFetchingBankPriceData, error: errorBankPriceData, refetch: refetchBankPriceData} = useGetBankPriceQuery({line_number: selectedID});
    const {data: banksData, isFetching: isFetchingBanksData, error: errorBanksData, refetch: refetchBanksData} = useGetBanksQuery(undefined);


    const [updateBankPrice, {}] = useUpdateBankPriceMutation()
    const [addBankPrice, {}] = useAddBankPriceMutation()

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);
    
    useEffect(() => {
        if (componentsAPIUpdate.includes('projectData')) {
            updateAPIData('projectData', refetchProjectData)
        } else if (componentsAPIUpdate.includes('deliveriesBankInfoData')) {
            updateAPIData('deliveriesBankInfoData', refetchDeliveriesInfoData)
        } else if (componentsAPIUpdate.includes('currenciesData')) {
            updateAPIData('currenciesData', refetchCurrenciesData)
        } else if (componentsAPIUpdate.includes('paymentsBankInfoData')) {
            updateAPIData('paymentsBankInfoData', refetchPaymentsInfoData)
        } else if (componentsAPIUpdate.includes('bankPriceData')) {
            updateAPIData('bankPriceData', refetchBankPriceData)
        } else if (componentsAPIUpdate.includes('banksData')) {
            updateAPIData('banksData', refetchBanksData)
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
        'product_total_price_sold': {isRequired: false, type: 'text'},
        'additional_currency': {isRequired: false, type: 'number'},
        'exchange_rates': {isRequired: false, type: 'float'},
        'exchange_rates_by_bank': {isRequired: false, type: 'number'},
        'exchange_rates_by_date': {isRequired: false, type: 'date'},
        'unit_price_by_exchange_rates': {isRequired: false, type: 'text'},
        'product_total_price_by_exchange_rates': {isRequired: false, type: 'text'},
        'product_total_price_sold_by_exchange_rates': {isRequired: false, type: 'text'},
        'payment_сurrency': {isRequired: false, type: 'number'},
        'prepaid_percent': {isRequired: false, type: 'number', valueMinMax: {min: 0, max: 100}},
        'prepaid_value': {isRequired: false, type: 'text'},
        'postpaid_percent': {isRequired: false, type: 'number', valueMinMax: {min: 0, max: 100}},
        'postpaid_value': {isRequired: false, type: 'text'}
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: Object.keys(initFieldParams)}}))
        if (isComponentPrepared) {
            if (!isFetchingProjectData && !isFetchingDeliveriesInfoData && !isFetchingPaymentsInfoData && !isFetchingBankPriceData) {
                if (!errorProjectData && projectData && !errorDeliveriesInfoData && deliveriesInfoData && !errorPaymentsInfoData && paymentsInfoData && !errorBankPriceData && bankPriceData) {
                    const myData = funcConvertToFieldDataType(bankPriceData[0])
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
    }, [selectedID, isComponentPrepared, projectData, deliveriesInfoData, paymentsInfoData, bankPriceData, isFetchingProjectData, isFetchingDeliveriesInfoData, isFetchingPaymentsInfoData, isFetchingBankPriceData]); 

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['main_currency', 'payment_сurrency', 'additional_currency']}}))
        if (isComponentPrepared && !isFetchingCurrenciesData && !isFetchingProjectData && !isFetchingDeliveriesInfoData && !isFetchingPaymentsInfoData && !isFetchingBankPriceData && !errorProjectData && !errorDeliveriesInfoData && !errorPaymentsInfoData && !errorBankPriceData) {
            if (!errorCurrenciesData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['main_currency', 'payment_сurrency', 'additional_currency']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['main_currency', 'payment_сurrency', 'additional_currency']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingCurrenciesData, isFetchingProjectData, isFetchingDeliveriesInfoData, isFetchingPaymentsInfoData, isFetchingBankPriceData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['exchange_rates_by_date']}}))
        if (isComponentPrepared && !isFetchingBanksData && !isFetchingProjectData && !isFetchingDeliveriesInfoData && !isFetchingPaymentsInfoData && !isFetchingBankPriceData && !errorProjectData && !errorDeliveriesInfoData && !errorPaymentsInfoData && !errorBankPriceData) {
            if (!errorBanksData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['exchange_rates_by_date']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['exchange_rates_by_date']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingBanksData, isFetchingProjectData, isFetchingDeliveriesInfoData, isFetchingPaymentsInfoData, isFetchingBankPriceData]);

    useEffect(() => {
        funcChangeCancelSet(true)
    }, [selectedID]);

    useEffect(() => {
        if (isFetchingProjectData || isFetchingDeliveriesInfoData || isFetchingPaymentsInfoData || isFetchingBankPriceData) {
            funcChangeCancelSet(true)
        }
    }, [isFetchingProjectData, isFetchingDeliveriesInfoData, isFetchingPaymentsInfoData, isFetchingBankPriceData]);

    async function funcSaveFields () {
        dispatch(setSavingStatus({componentName, data: {status: true}}))
        const currentId: number = componentData?.objInputAndChangedData['id'] as number
        const isValid = funcValidateFields(fieldParams, componentData?.objInputAndChangedData, componentData?.objChangedData)
        if (currentId) {
            if (isValid.isAllFieldsValid) {
                dispatch(deleteFieldInvalid({componentName}))
                const myData = componentData.objChangedData
                await updateBankPrice({...myData, id: currentId}).unwrap()    
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
                await addBankPrice({...myData, line_number: selectedID}).unwrap()    
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
        product_total_price_sold: string | '',
        product_total_price_by_exchange_rates: string | '', 
        product_total_price_sold_by_exchange_rates: string | '',
        postpaid_percent: number | '',
        unit_price_by_exchange_rates: string | '',
    }>
    ({
        product_total_price: '', 
        product_total_price_sold: '',
        product_total_price_by_exchange_rates: '', 
        product_total_price_sold_by_exchange_rates: '',
        postpaid_percent: '',
        unit_price_by_exchange_rates: '',
    })

    const [totalSentQty, setTotalSentQty] = useState<number>(0)
    useEffect(() => {
        if (deliveriesInfoData && deliveriesInfoData.length > 0) {
            setTotalSentQty(
                deliveriesInfoData.filter(item => (
                    item.quantity !== null
                )).reduce((total, payment) => total + (payment.quantity || 0), 0)
            ) 
                          
        } else {
            setTotalSentQty(0)
        }
    }, [deliveriesInfoData]);

    useEffect(() => {

        const unitPrice = new Decimal(componentData?.objInputAndChangedData['unit_price'] as number || 0);
        const exchangeRates = new Decimal(componentData?.objInputAndChangedData['exchange_rates'] as number || 0)
        const qty_plan = new Decimal(projectData?.[0].product_qty_from_bank || 0)
        const qty_sold = new Decimal(totalSentQty)

        const product_total_price = 
            funcCheckNotEmpty(componentData?.objInputAndChangedData, 'unit_price') 
            ? funcFloatWithThousandSeparator(unitPrice.mul(qty_plan))
            : ''
        
        const product_total_price_sold = 
            funcCheckNotEmpty(componentData?.objInputAndChangedData, 'unit_price') 
            ? funcFloatWithThousandSeparator(unitPrice.mul(qty_sold))
            : ''        

        const unit_price_by_exchange_rates = 
            (funcCheckNotEmpty(componentData?.objInputAndChangedData, 'unit_price') && funcCheckNotEmpty(componentData?.objInputAndChangedData, 'exchange_rates') )
            ? funcFloatWithThousandSeparator(unitPrice.mul(exchangeRates))
            : ''

        const product_total_price_by_exchange_rates = 
            unit_price_by_exchange_rates
            ? funcFloatWithThousandSeparator(new Decimal(unit_price_by_exchange_rates.replace(' ', '')).mul(qty_plan))
            : ''
        
        const product_total_price_sold_by_exchange_rates = 
            unit_price_by_exchange_rates
            ? funcFloatWithThousandSeparator(new Decimal(unit_price_by_exchange_rates.replace(' ', '')).mul(qty_sold))
            : ''

        const postpaid_percent = 
            funcCheckNotEmpty(componentData?.objInputAndChangedData, 'prepaid_percent') 
            ? 100 - (componentData?.objInputAndChangedData['prepaid_percent'] as number || 0) 
            : ''

        setObjPaymentStates({
            product_total_price: product_total_price,
            product_total_price_sold: product_total_price_sold,
            unit_price_by_exchange_rates: unit_price_by_exchange_rates,
            product_total_price_by_exchange_rates: product_total_price_by_exchange_rates,
            product_total_price_sold_by_exchange_rates: product_total_price_sold_by_exchange_rates,
            postpaid_percent: postpaid_percent,
        })
    }, [projectData, totalSentQty, componentData?.objInputAndChangedData]);

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
                    ></BlockInput>
                    <BlockInput
                        onChange={() => {}}
                        fieldName={'product_total_price'}
                        title={`Итого по заказанному (${funcNumberWithThousandSeparator(projectData?.[0]?.product_qty_from_bank || 0)} шт)`}
                        type={fieldParams?.['product_total_price']?.type as IInputTypes}
                        value={objPaymentStates.product_total_price}
                        placeholder={''}
                        skeletonLoading={loadingProcess?.['product_total_price']}
                        isReadOnly={true}
                    ></BlockInput>
                    <BlockInput
                        onChange={() => {}}
                        fieldName={'product_total_price_sold'}
                        title={`Итого по проданному (${funcNumberWithThousandSeparator(totalSentQty)} шт)`}
                        type={fieldParams?.['product_total_price_sold']?.type as IInputTypes}
                        value={objPaymentStates.product_total_price_sold}
                        placeholder={''}
                        skeletonLoading={loadingProcess?.['product_total_price_sold']}
                        isReadOnly={true}
                    ></BlockInput>                 
                </ContentBlock>

                <ContentBlock title={'Дополнительная стоимость:'} myStyleMain={{maxWidth: '40%'}} line={true}>
                    <BlockSelect
                        fieldName={'additional_currency'}
                        showName={"name"}
                        title={'Дополнительная валюта'}
                        value={componentData?.objInputAndChangedData['additional_currency'] as ISelectValue}
                        options={currenciesData || []}
                        isEmptyOption={true}
                        onChange={(obj) => setValues(obj)}   
                        skeletonLoading={loadingProcess?.['additional_currency']}
                        isRequired={fieldParams?.['additional_currency']?.isRequired}  
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['additional_currency']}   
                        isChanged={!!componentData?.objChangedData?.['additional_currency']}  
                        myStyle={{marginBottom: '0'}}
                    ></BlockSelect>

                    <ContentBlock myStyleMain={{flex: '0 0 auto', padding: '0'}} myStyleContent={{display: 'flex', flexDirection: 'row'}}>
                        <ContentBlock myStyleMain={{maxWidth: '50%', padding: '0'}}>
                            <BlockInput
                                onChange={(obj) => setValues(obj)}   
                                fieldName={'exchange_rates'}
                                title={'Курс'}
                                type={fieldParams?.['exchange_rates']?.type as IInputTypes}
                                value={componentData?.objInputAndChangedData['exchange_rates'] as ISelectValue}
                                // placeholder={''}
                                skeletonLoading={loadingProcess?.['exchange_rates']}
                                isRequired={fieldParams?.['exchange_rates']?.isRequired}  
                                isReadOnly={componentReadOnly?.status}
                                isInvalidStatus={componentInvalidFields?.['exchange_rates']}   
                                isChanged={!!componentData?.objChangedData?.['exchange_rates']}  
                            ></BlockInput>
                            <BlockSelect
                                fieldName={'exchange_rates_by_bank'}
                                showName={"name_eng"}
                                title={'По Банку'}
                                value={componentData?.objInputAndChangedData['exchange_rates_by_bank'] as ISelectValue}
                                options={banksData || []}
                                isEmptyOption={true}
                                onChange={(obj) => setValues(obj)}   
                                skeletonLoading={loadingProcess?.['exchange_rates_by_bank']}
                                isRequired={fieldParams?.['exchange_rates_by_bank']?.isRequired}  
                                isReadOnly={componentReadOnly?.status}
                                isInvalidStatus={componentInvalidFields?.['exchange_rates_by_bank']}   
                                isChanged={!!componentData?.objChangedData?.['exchange_rates_by_bank']}  
                            ></BlockSelect>
                            <BlockInput
                                onChange={(obj) => setValues(obj)}   
                                fieldName={'exchange_rates_by_date'}
                                title={'На дату'}
                                type={fieldParams?.['exchange_rates_by_date']?.type as IInputTypes}
                                value={componentData?.objInputAndChangedData['exchange_rates_by_date'] as ISelectValue}
                                // placeholder={''}
                                skeletonLoading={loadingProcess?.['exchange_rates_by_date']}
                                isRequired={fieldParams?.['exchange_rates_by_date']?.isRequired}  
                                isReadOnly={componentReadOnly?.status}
                                isInvalidStatus={componentInvalidFields?.['exchange_rates_by_date']}   
                                isChanged={!!componentData?.objChangedData?.['exchange_rates_by_date']}  
                            ></BlockInput>
                        </ContentBlock>
                        <ContentBlock myStyleMain={{maxWidth: '50%', padding: '0'}}>
                            <BlockInput
                                onChange={() => {}}   
                                fieldName={'unit_price_by_exchange_rates'}
                                title={'Цена за единицу'}
                                type={fieldParams?.['unit_price_by_exchange_rates']?.type as IInputTypes}
                                value={objPaymentStates.unit_price_by_exchange_rates}
                                placeholder={''}
                                skeletonLoading={loadingProcess?.['unit_price_by_exchange_rates']}
                                isRequired={fieldParams?.['unit_price_by_exchange_rates']?.isRequired}  
                                isReadOnly={true}
                            ></BlockInput>
                            <BlockInput
                                onChange={() => {}}
                                fieldName={'product_total_price_by_exchange_rates'}
                                title={`Итого по заказанному (${funcNumberWithThousandSeparator(projectData?.[0].product_qty_from_bank || 0)} шт)`}
                                type={fieldParams?.['product_total_price_by_exchange_rates']?.type as IInputTypes}
                                value={objPaymentStates.product_total_price_by_exchange_rates}
                                placeholder={''}
                                skeletonLoading={loadingProcess?.['product_total_price_by_exchange_rates']}
                                isReadOnly={true}
                            ></BlockInput>
                            <BlockInput
                                onChange={() => {}}
                                fieldName={'product_total_price_sold_by_exchange_rates'}
                                title={`Итого по проданному (${funcNumberWithThousandSeparator(totalSentQty)} шт)`}
                                type={fieldParams?.['product_total_price_sold_by_exchange_rates']?.type as IInputTypes}
                                value={objPaymentStates.product_total_price_sold_by_exchange_rates}
                                placeholder={''}
                                skeletonLoading={loadingProcess?.['product_total_price_sold_by_exchange_rates']}
                                isReadOnly={true}
                            ></BlockInput>   
                        </ContentBlock>
                    </ContentBlock>
                </ContentBlock>

                <ContentBlock title={'Условия оплаты:'} myStyleMain={{maxWidth: '40%'}}>
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
                            ></BlockInput>
                            <BlockInput
                                onChange={() => {}}
                                fieldName={'prepaid_value'}
                                title={'Оплачено'}
                                type={fieldParams?.['prepaid_value']?.type as IInputTypes}
                                value={totalPrepaidValue}
                                placeholder={''}
                                skeletonLoading={loadingProcess?.['prepaid_value']}
                                isReadOnly={true}
                            ></BlockInput> 
                        </ContentBlock>
                        <ContentBlock myStyleMain={{maxWidth: '50%', padding: '0'}}>
                            <BlockInput
                                onChange={() => {}}   
                                fieldName={'postpaid_percent'}
                                title={'Доплата %'}
                                type={fieldParams?.['postpaid_percent']?.type as IInputTypes}
                                value={objPaymentStates.postpaid_percent}
                                skeletonLoading={loadingProcess?.['postpaid_percent']}
                                isReadOnly={true}
                            ></BlockInput>
                            <BlockInput
                                onChange={() => {}}
                                fieldName={'postpaid_value'}
                                title={'Оплачено'}
                                type={fieldParams?.['postpaid_value']?.type as IInputTypes}
                                value={totalPostValue}
                                placeholder={''}
                                skeletonLoading={loadingProcess?.['postpaid_value']}
                                isReadOnly={true}
                            ></BlockInput> 
                        </ContentBlock>
                    </ContentBlock>
                </ContentBlock>
            </ContentBlock>
        </>)}
    </>)
}


export default BankPriceInfo