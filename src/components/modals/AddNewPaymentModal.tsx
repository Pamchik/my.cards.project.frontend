import { useEffect, useState } from "react";
import { MainModalBtnBlock, MainModalMainBlock, MainModalText, MainModalTopBlock, ModalViewBase } from "./ModalViewBase"
import { useEffectStoreData } from "../hooks/useEffectStoreData";
import { useComponentPreparation } from "../hooks/useComponentPreparation";
import { useFieldValueChange } from "../hooks/useFieldValueChange";
import { useDispatch } from "react-redux";
import { setModalClose } from "../../store/modalData/modalsSlice";
import ButtonMain from "../UI/buttons/ButtonMain";
import ContentBlock from "../blocks/ContentBlock";
import BlockInput from "../UI/fields/BlockInput";
import BlockTextarea from "../UI/fields/BlockTextarea";
import { IFieldParams, IInputTypes, ITextareaTypes } from "../../store/componentsData/fieldsParamsSlice";
import { IInputValue, ISelectValue, ITextareaValue, deleteAllComponentData, setChangedData, setInputData } from "../../store/componentsData/componentsDataSlice";
import { setLoadingStatus } from "../../store/componentsData/loadingProcessSlice";
import { deleteModalProps } from "../../store/modalData/modalsPropsDataSlice";
import { setSavingStatus } from "../../store/componentsData/savingProcessSlice";
import { funcValidateFields } from "../functions/funcValidateFields";
import { deleteFieldInvalid, setFieldInvalid } from "../../store/componentsData/fieldsInvalidSlice";
import { functionErrorMessage } from "../functions/functionErrorMessage";
import LoadingView from "../loading/LoadingView";
import BlockSelect from "../UI/fields/BlockSelect";
import { useAllComponentParamsReset } from "../hooks/useComponentDataReset";
import useTimeoutManager from "../hooks/useTimeoutManager";
import { useGetPaymentTypesQuery } from "../../store/api/paymentTypeApiSlice";
import { useGetCurrenciesQuery } from "../../store/api/currencyApiSlice";
import { useAddPaymentInfoMutation, useUpdatePaymentInfoMutation } from "../../store/api/paymentInfoApiSlice";


const AddNewPaymentModal = () => {

    const componentName = 'AddNewPaymentModal'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const {modalsPropsData, loadingProcess, fieldParams, componentData, componentInvalidFields, savingProcess, componentsAPIUpdate} = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: currenciesData, isFetching: isFetchingCurrenciesData, error: errorCurrenciesData, refetch: refetchCurrenciesData} = useGetCurrenciesQuery(undefined);
    const {data: paymentTypesData, isFetching: isFetchingPaymentTypesData, error: errorPaymentTypesData, refetch: refetchPaymentTypesData} = useGetPaymentTypesQuery(undefined);

    const [addPaymentInfo, {}] = useAddPaymentInfoMutation()
    const [updatePaymentInfo, {}] = useUpdatePaymentInfoMutation()

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    const initFieldParams: IFieldParams = {
        'payment_type': {isRequired: true, type: 'number'},
        'currency': {isRequired: true, type: 'number'},
        'payment_value': {isRequired: true, type: 'float'},
        'payment_date': {isRequired: true, type: 'date'},
        'other': {isRequired: false, type: 'text'},
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['payment_type']}}))
        if (isComponentPrepared && !isFetchingPaymentTypesData) {
            if (!errorPaymentTypesData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['payment_type']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['payment_type']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingPaymentTypesData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['currency']}}))
        if (isComponentPrepared && !isFetchingCurrenciesData) {
            if (!errorCurrenciesData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['currency']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['currency']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingCurrenciesData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: Object.keys(initFieldParams)}}))
        if (isComponentPrepared) {
            setManagedTimeout(() => {
                dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: Object.keys(initFieldParams)}}))
            }, 1000) 
        }
    }, [isComponentPrepared]);

    useEffect(() => {
        if (modalsPropsData?.objInputData) {
            dispatch(setInputData({componentName, data: modalsPropsData.objInputData}))
        }
        if (modalsPropsData?.objChangedData) {
            dispatch(setChangedData({componentName, data: modalsPropsData.objChangedData}))
        }
    }, [isComponentPrepared]);
    
    async function funcSaveFields () {
        dispatch(setSavingStatus({componentName, data: {status: true}}))
        const currentId: number = componentData?.objInputAndChangedData['id'] as number
        const isValid = funcValidateFields(fieldParams, componentData?.objInputAndChangedData, componentData?.objChangedData)
        if (currentId) {
            if (isValid.isAllFieldsValid) {
                dispatch(deleteFieldInvalid({componentName}))
                const myData = componentData.objChangedData
                await updatePaymentInfo({...myData, id: currentId}).unwrap()    
                .then((res) => {
                    dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: true}}))
                    dispatch(deleteAllComponentData({componentName}))
                    setManagedTimeout(() => { 
                        dispatch(setSavingStatus({ componentName, data: { status: false } }))
                        dispatch(setModalClose(componentName))
                        dispatch(deleteModalProps({componentName}))
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
                await addPaymentInfo({...myData}).unwrap()    
                .then((res) => {
                    dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: true}}))
                    dispatch(deleteAllComponentData({componentName}))
                    setManagedTimeout(() => { 
                        dispatch(setSavingStatus({ componentName, data: { status: false } }))
                        dispatch(setModalClose(componentName))
                        dispatch(deleteModalProps({componentName}))
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

    return (<>
        {isComponentPrepared && (<>
            <ModalViewBase
                myStyleContext={{ }} 
                onClick={() => {
                    dispatch(setModalClose(componentName))
                    dispatch(deleteModalProps({componentName}))
                }}
                 onOverlayClick={false}
            >
                {savingProcess?.status && 
                    <LoadingView
                        isSuccessful={savingProcess.isSuccessful} 
                        errorMessage={savingProcess.message} 
                        componentName={componentName} 
                    />
                } 
                <MainModalTopBlock>
                    <div style={{width: '120px'}}></div>
                    <MainModalText modalTitle={`${componentData?.objInputData?.['id'] ? 'Изменение оплаты' : 'Добавление оплаты'}`}/>
                    <MainModalBtnBlock myStyleBtnBlock={{width: '120px'}}>
                        {
                            componentData?.objChangedData && Object.keys(componentData.objChangedData).length > (modalsPropsData?.qtyFieldsForSavingBtn || 0) && 
                            <ButtonMain
                                onClick={funcSaveFields} 
                                type={'submit'} 
                                title={'Сохранить'}
                            />
                        }
                        <ButtonMain 
                            onClick={() => {
                                dispatch(setModalClose(componentName))
                                dispatch(deleteModalProps({componentName}))
                            }}
                            type="resetIcon" 
                        />
                    </MainModalBtnBlock>
                </MainModalTopBlock>

                <MainModalMainBlock myStyleMainBlock={{ display: 'flex', minHeight: '250px', width: '800px'}}>
                    <ContentBlock>
                        <BlockSelect
                            fieldName={'payment_type'}
                            showName={"name"}
                            title={'Тип платежа'}
                            value={componentData?.objInputAndChangedData['payment_type'] as ISelectValue}
                            options={paymentTypesData || []}
                            isEmptyOption={true}
                            onChange={(obj) => setValues(obj)}   
                            skeletonLoading={loadingProcess?.['payment_type']}
                            isRequired={fieldParams?.['payment_type']?.isRequired}  
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('payment_type')} 
                            isInvalidStatus={componentInvalidFields?.['payment_type']}   
                            isChanged={!!componentData?.objChangedData?.['payment_type']}  
                            isSortDisabled={true}
                        ></BlockSelect>
                        <BlockSelect
                            fieldName={'currency'}
                            showName={"name"}
                            title={'Валюта'}
                            value={componentData?.objInputAndChangedData['currency'] as ISelectValue}
                            options={currenciesData || []}
                            isEmptyOption={true}
                            onChange={(obj) => setValues(obj)}   
                            skeletonLoading={loadingProcess?.['currency']}
                            isRequired={fieldParams?.['currency']?.isRequired}  
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('currency')} 
                            isInvalidStatus={componentInvalidFields?.['currency']}   
                            isChanged={!!componentData?.objChangedData?.['currency']}  
                        ></BlockSelect>
                        <BlockInput
                            onChange={(obj) => setValues(obj)}
                            fieldName={'payment_value'}
                            title={'Сумма'}
                            type={fieldParams?.['payment_value']?.type as IInputTypes}
                            value={componentData?.objInputAndChangedData['payment_value'] as IInputValue}
                            placeholder={'Введите сумму'}
                            skeletonLoading={loadingProcess?.['payment_value']}
                            isRequired={fieldParams?.['payment_value']?.isRequired}
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('payment_value')}
                            isInvalidStatus={componentInvalidFields?.['payment_value']}
                            isChanged={!!componentData?.objChangedData?.['payment_value']}
                        ></BlockInput>
                        <BlockInput
                            onChange={(obj) => setValues(obj)}
                            fieldName={'payment_date'}
                            title={'Дата'}
                            type={fieldParams?.['payment_date']?.type as IInputTypes}
                            value={componentData?.objInputAndChangedData['payment_date'] as IInputValue}
                            placeholder={''}
                            skeletonLoading={loadingProcess?.['payment_date']}
                            isRequired={fieldParams?.['payment_date']?.isRequired}
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('payment_date')}
                            isInvalidStatus={componentInvalidFields?.['payment_date']}
                            isChanged={!!componentData?.objChangedData?.['payment_date']}
                        ></BlockInput>
                        <BlockTextarea
                            onChange={(obj) => setValues(obj)}
                            fieldName={'other'}
                            title={'Описание'}
                            type={fieldParams?.['other']?.type as ITextareaTypes}
                            value={componentData?.objInputAndChangedData['other'] as ITextareaValue}
                            placeholder={'Введите комментарий'}
                            skeletonLoading={loadingProcess?.['other']}
                            isRequired={fieldParams?.['other']?.isRequired}
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('other')}
                            isInvalidStatus={componentInvalidFields?.['other']}
                            isChanged={!!componentData?.objChangedData?.['other']}
                            rows={4}
                        ></BlockTextarea>
                    </ContentBlock>
                </MainModalMainBlock>
            </ModalViewBase>
        </>)}
    </>)
}

export default AddNewPaymentModal