import BtnBlock from "../../../blocks/BtnBlock";
import ButtonMain from "../../../UI/buttons/ButtonMain";
import ContentBlock from "../../../blocks/ContentBlock";
import { useEffect, useState } from "react";
import { useEffectStoreData } from "../../../hooks/useEffectStoreData";
import { IFieldParams, IInputTypes, ITextareaTypes } from "../../../../store/componentsData/fieldsParamsSlice";
import { useDispatch } from "react-redux";
import { useFieldValueChange } from "../../../hooks/useFieldValueChange";
import { changeComponentReadOnly } from "../../../../store/componentsData/componentsReadOnlySlice";
import { IInputValue, ISelectValue, ITextareaValue, deleteAllComponentData, deleteChangedComponentData, setChangedData, setInputData } from "../../../../store/componentsData/componentsDataSlice";
import { deleteFieldInvalid, setFieldInvalid } from "../../../../store/componentsData/fieldsInvalidSlice";
import { setLoadingStatus } from "../../../../store/componentsData/loadingProcessSlice";
import BlockInput from "../../../UI/fields/BlockInput";
import BlockTextarea from "../../../UI/fields/BlockTextarea";
import { useComponentPreparation } from "../../../hooks/useComponentPreparation";
import BlockSelect from "../../../UI/fields/BlockSelect";
import { funcConvertToFieldDataType } from "../../../functions/funcConvertToFieldDataType";
import { useGetBankQuery, useUpdateBankMutation } from "../../../../store/api/bankApiSlice";
import { useGetCountriesQuery } from "../../../../store/api/countryApiSlice";
import LoadingView from "../../../loading/LoadingView";
import { setSavingStatus } from "../../../../store/componentsData/savingProcessSlice";
import { functionErrorMessage } from "../../../functions/functionErrorMessage";
import { funcValidateFields } from "../../../functions/funcValidateFields";
import { deleteComponentsAPIUpdate } from "../../../../store/componentsData/componentsAPIUpdateSlice";
import { setModalOpen } from "../../../../store/modalData/modalsSlice";
import { setModalProps } from "../../../../store/modalData/modalsPropsDataSlice";
import { useGetPersoVendorsQuery } from "../../../../store/api/persoVendorApiSlice";
import { useGetProcessingsQuery } from "../../../../store/api/processingApiSlice";
import { useAllComponentParamsReset } from "../../../hooks/useComponentDataReset";
import useTimeoutManager from "../../../hooks/useTimeoutManager";

interface IBankMainInfo {
    selectedID: number
}

const BankMainInfo = ({
    selectedID
}: IBankMainInfo) => {

    const componentName = 'BankMainInfo'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const { loadingProcess, fieldParams, componentData, componentReadOnly, componentInvalidFields, savingProcess, componentsAPIUpdate } = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: bankData, isFetching: isFetchingBankData, error: errorBankData, refetch: refetchBankData} = useGetBankQuery({id: selectedID})
    const {data: countriesData, isFetching: isFetchingCountriesData, error: errorCountriesData, refetch: refetchCountriesData} = useGetCountriesQuery(undefined)
    const {data: processingsData, isFetching: isFetchingProcessingsData, error: errorProcessingsData, refetch: refetchProcessingsData} = useGetProcessingsQuery(undefined)
    const {data: persoVendorsData, isFetching: isFetchingPersoVendorsData, error: errorPersoVendorsData, refetch: refetchPersoVendorsData} = useGetPersoVendorsQuery(undefined)
    const [updateBank, {}] = useUpdateBankMutation()

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    useEffect(() => {
        if (componentsAPIUpdate.includes('bankData')) {
            refetchBankData()
            funcChangeCancelSet(true)
            dispatch(deleteComponentsAPIUpdate(['bankData']))
        } else if (componentsAPIUpdate.includes('countriesData')) {
            refetchCountriesData()
            funcChangeCancelSet(true)
            dispatch(deleteComponentsAPIUpdate(['countriesData']))
        } else if (componentsAPIUpdate.includes('processingCentersData')) {
            refetchProcessingsData()
            funcChangeCancelSet(true)
            dispatch(deleteComponentsAPIUpdate(['processingCentersData']))
        } else if (componentsAPIUpdate.includes('persoVendorsData')) {
            refetchPersoVendorsData()
            funcChangeCancelSet(true)
            dispatch(deleteComponentsAPIUpdate(['persoVendorsData']))
        }
    }, [componentsAPIUpdate]);

    const initFieldParams: IFieldParams = {
        'full_name_rus': {isRequired: false, type: 'text'},
        'address_rus': {isRequired: false, type: 'text'},
        'name_eng': {isRequired: true, type: 'text'},
        'full_name_eng': {isRequired: false, type: 'text'},
        'address_eng': {isRequired: false, type: 'text'},
        'country': {isRequired: true, type: 'number'},
        'processing': {isRequired: false, type: 'number' },
        'pesro_script_vendor': {isRequired: false, type: 'number'},
        'tolerance': {isRequired: false, type: 'number', valueMinMax: {min: 0, max: 100}},
        'other': {isRequired: false, type: 'text'},
        'active': {isRequired: true, type: 'boolean'},
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: Object.keys(initFieldParams)}}))
        if (isComponentPrepared) {
            if (!isFetchingBankData) {
                if (!errorBankData && bankData) {
                    const myData = funcConvertToFieldDataType(bankData[0])
                    dispatch(setInputData({componentName, data: myData}))
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: [
                            'full_name_rus',
                            'address_rus',
                            'name_eng',
                            'full_name_eng',
                            'address_eng',
                            'tolerance',
                            'other',
                            'active'
                        ]}}))
                    }, 1000)  
                } else {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: Object.keys(initFieldParams)}}))
                    }, 1000)
                }
            }
        }
    }, [selectedID, isComponentPrepared, bankData, isFetchingBankData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['pesro_script_vendor']}}))
        if (isComponentPrepared && !isFetchingPersoVendorsData && !isFetchingBankData && !errorBankData) {
            if (!errorPersoVendorsData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['pesro_script_vendor']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['pesro_script_vendor']}}))
                }, 1000)
            }
        }
    }, [selectedID, isComponentPrepared, isFetchingBankData, isFetchingPersoVendorsData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['country']}}))
        if (isComponentPrepared && !isFetchingCountriesData && !isFetchingBankData && !errorBankData) {
            if (!errorCountriesData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['country']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['country']}}))
                }, 1000)
            }
        }
    }, [selectedID, isComponentPrepared, isFetchingBankData, isFetchingCountriesData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['processing']}}))
        if (isComponentPrepared && !isFetchingProcessingsData && !isFetchingBankData && !errorBankData) {
            if (!errorProcessingsData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['processing']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['processing']}}))
                }, 1000)
            }
        }
    }, [selectedID, isComponentPrepared, isFetchingBankData, isFetchingProcessingsData]);

    useEffect(() => {
        funcChangeCancelSet(true)
    }, [selectedID]);

    async function funcSaveFields () {
        dispatch(setSavingStatus({componentName, data: {status: true}}))
        const currentId: number = componentData?.objInputAndChangedData['id'] as number
        if (currentId) {
            const isValid = funcValidateFields(fieldParams, componentData?.objInputAndChangedData, componentData?.objChangedData)
            if (isValid.isAllFieldsValid) {
                dispatch(deleteFieldInvalid({componentName}))
                const myData = componentData.objChangedData
                await updateBank({...myData, id: currentId}).unwrap()    
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
            dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: false, message: "Ошибка! Обновите страницу и попробуйте заново."}}))
        }
    }    

    function funcChangeCancelSet(newStatus: boolean) {
        dispatch(deleteChangedComponentData({componentName}))
        dispatch(changeComponentReadOnly({componentName, newStatus}))
        dispatch(deleteFieldInvalid({componentName}))            
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
            <ContentBlock>
                <BlockInput
                    onChange={(obj) => setValues(obj)}
                    fieldName={'name_eng'}
                    title={'Название для отображения (eng)'}
                    type={fieldParams?.['name_eng']?.type as IInputTypes}
                    value={componentData?.objInputAndChangedData['name_eng'] as IInputValue}
                    placeholder={'Введите название на английском'}
                    skeletonLoading={loadingProcess?.['name_eng']}
                    isRequired={fieldParams?.['name_eng']?.isRequired}
                    isReadOnly={componentReadOnly?.status}
                    isInvalidStatus={componentInvalidFields?.['name_eng']}
                    isChanged={!!componentData?.objChangedData?.['name_eng']}
                />
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <ContentBlock title={'Реквизиты Банка (rus):'} line={true}>
                        <BlockInput
                            onChange={(obj) => setValues(obj)}
                            fieldName={'full_name_rus'}
                            title={'Полное название (rus)'}
                            type={fieldParams?.['full_name_rus']?.type as IInputTypes}
                            value={componentData?.objInputAndChangedData['full_name_rus'] as IInputValue}
                            placeholder={'Введите название на русском'}
                            skeletonLoading={loadingProcess?.['full_name_rus']}
                            isRequired={fieldParams?.['full_name_rus']?.isRequired}
                            isReadOnly={componentReadOnly?.status}
                            isInvalidStatus={componentInvalidFields?.['full_name_rus']}
                            isChanged={!!componentData?.objChangedData?.['full_name_rus']}
                        />
                        <BlockTextarea
                            onChange={(obj) => setValues(obj)}
                            fieldName={'address_rus'}
                            title={'Адрес (rus)'}
                            type={fieldParams?.['address_rus']?.type as ITextareaTypes}
                            value={componentData?.objInputAndChangedData['address_rus'] as ITextareaValue}
                            placeholder={'Введите адрес на русском'}
                            skeletonLoading={loadingProcess?.['address_rus']}
                            isRequired={fieldParams?.['address_rus']?.isRequired}
                            isReadOnly={componentReadOnly?.status}
                            isInvalidStatus={componentInvalidFields?.['address_rus']}
                            isChanged={!!componentData?.objChangedData?.['address_rus']}
                            rows={3}
                        />
                    </ContentBlock>

                    <ContentBlock title={'Реквизиты Банка (eng):'}>
                        <BlockInput
                            onChange={(obj) => setValues(obj)}
                            fieldName={'full_name_eng'}
                            title={'Полное название (eng)'}
                            type={fieldParams?.['full_name_eng']?.type as IInputTypes}
                            value={componentData?.objInputAndChangedData['full_name_eng'] as IInputValue}
                            placeholder={'Введите название на английском'}
                            skeletonLoading={loadingProcess?.['full_name_eng']}
                            isRequired={fieldParams?.['full_name_eng']?.isRequired}
                            isReadOnly={componentReadOnly?.status}
                            isInvalidStatus={componentInvalidFields?.['full_name_eng']}
                            isChanged={!!componentData?.objChangedData?.['full_name_eng']}
                        />
                        <BlockTextarea
                            onChange={(obj) => setValues(obj)}
                            fieldName={'address_eng'}
                            title={'Адрес (eng)'}
                            type={fieldParams?.['address_eng']?.type as ITextareaTypes}
                            value={componentData?.objInputAndChangedData['address_eng'] as ITextareaValue}
                            placeholder={'Введите адрес на английском'}
                            skeletonLoading={loadingProcess?.['address_eng']}
                            isRequired={fieldParams?.['address_eng']?.isRequired}
                            isReadOnly={componentReadOnly?.status}
                            isInvalidStatus={componentInvalidFields?.['address_eng']}
                            isChanged={!!componentData?.objChangedData?.['address_eng']}
                            rows={3}
                        />
                    </ContentBlock>
                </div>

                <ContentBlock title={'Дополнительно:'}>
                    <BlockSelect
                        fieldName={'country'}
                        showName={"name_rus"}
                        title={'Страна'}
                        value={componentData?.objInputAndChangedData['country'] as ISelectValue}
                        options={countriesData || []}
                        isEmptyOption={true}
                        onChange={(obj) => setValues(obj)}   
                        skeletonLoading={loadingProcess?.['country']}
                        isRequired={fieldParams?.['country']?.isRequired}  
                        isReadOnly={true} 
                        isInvalidStatus={componentInvalidFields?.['country']}   
                        isChanged={!!componentData?.objChangedData?.['country']}  
                    />
                    <BlockSelect
                        fieldName={'processing'}
                        showName={"name"}
                        title={'Процессинг'}
                        value={componentData?.objInputAndChangedData['processing'] as ISelectValue}
                        options={processingsData || []}
                        isEmptyOption={true}
                        onChange={(obj) => setValues(obj)}   
                        skeletonLoading={loadingProcess?.['processing']}
                        isRequired={fieldParams?.['processing']?.isRequired}  
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['processing']}   
                        isChanged={!!componentData?.objChangedData?.['processing']}  
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
                                        dispatch(setModalProps({componentName: 'CreateNewProcessingModal', data: {
                                            objChangedData: {active: true},
                                            objReadOnlyFields: ['active'],
                                            qtyFieldsForSavingBtn: 1
                                        }}))
                                        dispatch(setModalOpen('CreateNewProcessingModal'))
                                    }
                                }, 
                                {
                                    name: "Изменить", 
                                    onClick: () => {
                                        const data = processingsData?.find(item => item.id === componentData?.objInputAndChangedData['processing'])
                                        if (data) {
                                            dispatch(setModalProps({componentName: 'CreateNewProcessingModal', data: {
                                                objInputData: funcConvertToFieldDataType(data),
                                                objReadOnlyFields: ['active'],
                                                qtyFieldsForSavingBtn: 1
                                            }}))
                                            dispatch(setModalOpen('CreateNewProcessingModal'))
                                        } else {
                                            return {}
                                        }                                        
                                    }, 
                                    disabled: !!!componentData?.objInputAndChangedData['processing']
                                }
                            ]}
                            myStyle={{width: '20px', height: '20px', margin: '2.5px 4px'}}
                        />
                    </BlockSelect>
                    <BlockSelect
                        fieldName={'pesro_script_vendor'}
                        showName={"name"}
                        title={'Персо вендор'}
                        value={componentData?.objInputAndChangedData['pesro_script_vendor'] as ISelectValue}
                        options={persoVendorsData || []}
                        isEmptyOption={true}
                        onChange={(obj) => setValues(obj)}   
                        skeletonLoading={loadingProcess?.['pesro_script_vendor']}
                        isRequired={fieldParams?.['pesro_script_vendor']?.isRequired}  
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['pesro_script_vendor']}   
                        isChanged={!!componentData?.objChangedData?.['pesro_script_vendor']}  
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
                                        dispatch(setModalProps({componentName: 'CreateNewPersoVendorModal', data: {
                                            objChangedData: {active: true},
                                            objReadOnlyFields: ['active']
                                        }}))
                                        dispatch(setModalOpen('CreateNewPersoVendorModal'))
                                    }
                                }, 
                                {
                                    name: "Изменить", 
                                    onClick: () => {
                                        const data = persoVendorsData?.find(item => item.id === componentData?.objInputAndChangedData['pesro_script_vendor'])
                                        if (data) {
                                            dispatch(setModalProps({componentName: 'CreateNewPersoVendorModal', data: {
                                                objInputData: funcConvertToFieldDataType(data),
                                                objReadOnlyFields: ['active']
                                            }}))
                                            dispatch(setModalOpen('CreateNewPersoVendorModal'))
                                        } else {
                                            return {}
                                        }                                        
                                    }, 
                                    disabled: !!!componentData?.objInputAndChangedData['pesro_script_vendor']
                                }
                            ]}
                            myStyle={{width: '20px', height: '20px', margin: '2.5px 4px'}}
                        />
                    </BlockSelect>
                    <BlockInput
                        onChange={(obj) => setValues(obj)}
                        fieldName={'tolerance'}
                        title={'Производственное отклонение'}
                        type={fieldParams?.['tolerance']?.type as IInputTypes}
                        value={componentData?.objInputAndChangedData['tolerance'] as IInputValue}
                        placeholder={'Введите отклонение при производстве (числом без %)'}
                        skeletonLoading={loadingProcess?.['tolerance']}
                        isRequired={fieldParams?.['tolerance']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['tolerance']}
                        isChanged={!!componentData?.objChangedData?.['tolerance']}
                    />
                    <BlockTextarea
                        onChange={(obj) => setValues(obj)}
                        fieldName={'other'}
                        title={'Другое'}
                        type={fieldParams?.['other']?.type as ITextareaTypes}
                        value={componentData?.objInputAndChangedData['other'] as ITextareaValue}
                        placeholder={'Введите комментарий'}
                        skeletonLoading={loadingProcess?.['other']}
                        isRequired={fieldParams?.['other']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['other']}
                        isChanged={!!componentData?.objChangedData?.['other']}
                        rows={2}
                    />
                    <BlockSelect
                        fieldName={'active'}
                        showName={"name"}
                        title={'Статус'}
                        value={componentData?.objInputAndChangedData['active'] as ISelectValue ? 1 : 2 }
                        options={[{id: 1, name: 'Активный'}, {id: 2, name: 'В архиве'}]}
                        isEmptyOption={false}
                        onChange={(obj) => setValues({name: obj.name, value: obj.value === 1 ? true : false})}   
                        skeletonLoading={loadingProcess?.['active']}
                        isRequired={fieldParams?.['active']?.isRequired}  
                        isReadOnly={componentReadOnly?.status} 
                        isInvalidStatus={componentInvalidFields?.['active']}   
                        isChanged={!!componentData?.objChangedData?.['active']}  
                    />
                </ContentBlock>
            </ContentBlock>
        </>)}
    </>)
}

export default BankMainInfo