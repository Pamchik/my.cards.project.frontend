import { useEffect, useState } from "react";
import { MainModalBtnBlock, MainModalMainBlock, MainModalText, MainModalTopBlock, ModalViewBase } from "./ModalViewBase"
import { useEffectStoreData } from "../hooks/useEffectStoreData";
import { useComponentPreparation } from "../hooks/useComponentPreparation";
import { useFieldValueChange } from "../hooks/useFieldValueChange";
import { useDispatch } from "react-redux";
import { setModalClose, setModalOpen } from "../../store/modalData/modalsSlice";
import ButtonMain from "../UI/buttons/ButtonMain";
import ContentBlock from "../blocks/ContentBlock";
import BlockInput from "../UI/fields/BlockInput";
import BlockTextarea from "../UI/fields/BlockTextarea";
import { IFieldParams, IInputTypes, ITextareaTypes } from "../../store/componentsData/fieldsParamsSlice";
import { IInputValue, ISelectValue, ITextareaValue, deleteAllComponentData, setChangedData, setInputData } from "../../store/componentsData/componentsDataSlice";
import { setLoadingStatus } from "../../store/componentsData/loadingProcessSlice";
import { deleteModalProps, setModalProps } from "../../store/modalData/modalsPropsDataSlice";
import { setSavingStatus } from "../../store/componentsData/savingProcessSlice";
import { funcValidateFields } from "../functions/funcValidateFields";
import { deleteFieldInvalid, setFieldInvalid } from "../../store/componentsData/fieldsInvalidSlice";
import { functionErrorMessage } from "../functions/functionErrorMessage";
import LoadingView from "../loading/LoadingView";
import { useAddBankMutation, useUpdateBankMutation } from "../../store/api/bankApiSlice";
import BlockSelect from "../UI/fields/BlockSelect";
import { funcConvertToFieldDataType } from "../functions/funcConvertToFieldDataType";
import { useGetCountriesQuery } from "../../store/api/countryApiSlice";
import { useGetProcessingsQuery } from "../../store/api/processingApiSlice";
import { useGetPersoVendorsQuery } from "../../store/api/persoVendorApiSlice";
import { useAllComponentParamsReset } from "../hooks/useComponentDataReset";
import useTimeoutManager from "../hooks/useTimeoutManager";


const CreateNewBankModal = () => {

    const componentName = 'CreateNewBankModal'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const {modalsPropsData, loadingProcess, fieldParams, componentData, componentInvalidFields, savingProcess, componentsAPIUpdate} = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: countriesData, isFetching: isFetchingCountriesData, error: errorCountriesData, refetch: refetchCountriesData} = useGetCountriesQuery(undefined)
    const {data: processingsData, isFetching: isFetchingProcessingsData, error: errorProcessingsData, refetch: refetchProcessingsData} = useGetProcessingsQuery(undefined)
    const {data: persoVendorsData, isFetching: isFetchingPersoVendorsData, error: errorPersoVendorsData, refetch: refetchPersoVendorsData} = useGetPersoVendorsQuery(undefined)
    const [updateBank, {}] = useUpdateBankMutation()
    const [addBank, {}] = useAddBankMutation()

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

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
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['pesro_script_vendor']}}))
        if (isComponentPrepared && !isFetchingPersoVendorsData) {
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
    }, [isComponentPrepared, isFetchingPersoVendorsData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['country']}}))
        if (isComponentPrepared && !isFetchingCountriesData) {
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
    }, [isComponentPrepared, isFetchingCountriesData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['processing']}}))
        if (isComponentPrepared && !isFetchingProcessingsData) {
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
    }, [isComponentPrepared, isFetchingProcessingsData]);


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
                await updateBank({...myData, id: currentId}).unwrap()    
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
                await addBank({...myData}).unwrap()    
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
                    <MainModalText modalTitle={`${componentData?.objInputData?.['id'] ? 'Изменение Банка' : 'Создание Банка'}`}/>
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
                        <BlockInput
                            onChange={(obj) => setValues(obj)}
                            fieldName={'name_eng'}
                            title={'Название для отображения (eng)'}
                            type={fieldParams?.['name_eng']?.type as IInputTypes}
                            value={componentData?.objInputAndChangedData['name_eng'] as IInputValue}
                            placeholder={'Введите название на английском'}
                            skeletonLoading={loadingProcess?.['name_eng']}
                            isRequired={fieldParams?.['name_eng']?.isRequired}
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('name_eng')}
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
                                    isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('full_name_rus')}
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
                                    isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('address_rus')}
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
                                    isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('full_name_eng')}
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
                                    isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('address_eng')}
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
                                isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('country')} 
                                isInvalidStatus={componentInvalidFields?.['country']}   
                                isChanged={!!componentData?.objChangedData?.['country']}  
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
                                                dispatch(setModalProps({componentName: 'CreateNewCountryModal', data: {
                                                    objChangedData: {active: true},
                                                    objReadOnlyFields: ['active'],
                                                    qtyFieldsForSavingBtn: 1
                                                }}))
                                                dispatch(setModalOpen('CreateNewCountryModal'))
                                            }
                                        }, 
                                        {
                                            name: "Изменить", 
                                            onClick: () => {
                                                const data = countriesData?.find(item => item.id === componentData?.objInputAndChangedData['country'])
                                                if (data) {
                                                    dispatch(setModalProps({componentName: 'CreateNewCountryModal', data: {
                                                        objInputData: funcConvertToFieldDataType(data),
                                                        objReadOnlyFields: ['active']
                                                    }}))
                                                    dispatch(setModalOpen('CreateNewCountryModal'))
                                                } else {
                                                    return {}
                                                }                                        
                                            }, 
                                            disabled: !!!componentData?.objInputAndChangedData['country']
                                        }
                                    ]}
                                    myStyle={{width: '20px', height: '20px', margin: '2.5px 4px'}}
                                />
                            </BlockSelect>
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
                                isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('processing')}
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
                                                        objReadOnlyFields: ['active']
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
                                isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('pesro_script_vendor')}
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
                                                    objReadOnlyFields: ['active'],
                                                    qtyFieldsForSavingBtn: 1
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
                                isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('tolerance')}
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
                                isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('other')}
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
                                isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('active')} 
                                isInvalidStatus={componentInvalidFields?.['active']}   
                                isChanged={!!componentData?.objChangedData?.['active']}  
                            />
                        </ContentBlock>
                    </ContentBlock>
                </MainModalMainBlock>
            </ModalViewBase>
        </>)}
    </>)
}

export default CreateNewBankModal