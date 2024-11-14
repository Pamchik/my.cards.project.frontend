import { useEffect, useState } from "react";
import { MainModalBtnBlock, MainModalMainBlock, MainModalText, MainModalTopBlock, ModalViewBase } from "./ModalViewBase"
import { useEffectStoreData } from "../hooks/useEffectStoreData";
import { useComponentPreparation } from "../hooks/useComponentPreparation";
import { useFieldValueChange } from "../hooks/useFieldValueChange";
import { useDispatch } from "react-redux";
import { setModalClose, setModalOpen } from "../../store/modalData/modalsSlice";
import ButtonMain from "../UI/buttons/ButtonMain";
import ContentBlock from "../blocks/ContentBlock";
import { IFieldParams, ITextareaTypes } from "../../store/componentsData/fieldsParamsSlice";
import { ISelectValue, ITextareaValue, deleteAllComponentData, setChangedData, setInputData } from "../../store/componentsData/componentsDataSlice";
import { setLoadingStatus } from "../../store/componentsData/loadingProcessSlice";
import { deleteModalProps, setModalProps } from "../../store/modalData/modalsPropsDataSlice";
import { setSavingStatus } from "../../store/componentsData/savingProcessSlice";
import { funcValidateFields } from "../functions/funcValidateFields";
import { deleteFieldInvalid, setFieldInvalid } from "../../store/componentsData/fieldsInvalidSlice";
import { functionErrorMessage } from "../functions/functionErrorMessage";
import LoadingView from "../loading/LoadingView";
import { useGetBanksQuery } from "../../store/api/bankApiSlice";
import BlockSelect from "../UI/fields/BlockSelect";
import { funcConvertToFieldDataType } from "../functions/funcConvertToFieldDataType";
import { useAllComponentParamsReset } from "../hooks/useComponentDataReset";
import { useGetVendorsQuery } from "../../store/api/vendorApiSlice";
import BlockTextarea from "../UI/fields/BlockTextarea";
import { useAddKeyExchangeMutation } from "../../store/api/keyExchangeApiSlice";
import useTimeoutManager from "../hooks/useTimeoutManager";


const CreateNewKeyExchangeModal = () => {

    const componentName = 'CreateNewKeyExchangeModal'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const {modalsPropsData, loadingProcess, fieldParams, componentData, componentInvalidFields, savingProcess, componentsAPIUpdate} = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: vendorsData, isFetching: isFetchingVendorsData, error: errorVendorsData, refetch: refetchVendorsData} = useGetVendorsQuery(undefined)
    const {data: banksData, isFetching: isFetchingBanksData, error: errorBanksData, refetch: refetchBanksData} = useGetBanksQuery(undefined)

    const [addKeyExchange, {}] = useAddKeyExchangeMutation()

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    const initFieldParams: IFieldParams = {
        'vendor': {isRequired: true, type: 'number'},
        'bank': {isRequired: true, type: 'number'},
        'other': {isRequired: false, type: 'text'}
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['vendor']}}))
        if (isComponentPrepared && !isFetchingVendorsData) {
            if (!errorVendorsData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['vendor']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['vendor']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingVendorsData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['bank']}}))
        if (isComponentPrepared && !isFetchingBanksData) {
            if (!errorBanksData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['bank']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['bank']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingBanksData]);

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
        const isValid = funcValidateFields(fieldParams, componentData?.objInputAndChangedData, componentData?.objChangedData)
        if (isValid.isAllFieldsValid) {
            dispatch(deleteFieldInvalid({componentName}))
            const myData = componentData.objChangedData
            await addKeyExchange({...myData}).unwrap()    
            .then((res) => {
                dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: true}}))
                dispatch(deleteAllComponentData({componentName}))
                setManagedTimeout(() => { 
                    dispatch(setSavingStatus({ componentName, data: { status: false } }))
                    dispatch(setModalClose(componentName))
                    dispatch(deleteModalProps({componentName}))
                    
                    if (res?.id) {
                        const currentUrl = window.location.href
                        window.open(`${currentUrl}${res.id}/`, '_blank');                    
                    }
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
                    <MainModalText modalTitle={'Создание нового проекта по обмену ключами'}/>
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
                            fieldName={'vendor'}
                            showName={"name"}
                            title={'Название Вендора'}
                            value={componentData?.objInputAndChangedData['vendor'] as ISelectValue}
                            options={vendorsData || []}
                            isEmptyOption={true}
                            onChange={(obj) => setValues(obj)}   
                            skeletonLoading={loadingProcess?.['vendor']}
                            isRequired={fieldParams?.['vendor']?.isRequired}  
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('vendor')}
                            isInvalidStatus={componentInvalidFields?.['vendor']}   
                            isChanged={!!componentData?.objChangedData?.['vendor']}  
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
                                            dispatch(setModalProps({componentName: 'CreateNewVendorModal', data: {
                                                objChangedData: {active: true},
                                                objReadOnlyFields: ['active'],
                                                qtyFieldsForSavingBtn: 1
                                            }}))
                                            dispatch(setModalOpen('CreateNewVendorModal'))
                                        }
                                    }, 
                                    {
                                        name: "Изменить", 
                                        onClick: () => {
                                            const data = vendorsData?.find(item => item.id === componentData?.objInputAndChangedData['vendor'])
                                            if (data) {
                                                dispatch(setModalProps({componentName: 'CreateNewVendorModal', data: {
                                                    objInputData: funcConvertToFieldDataType(data),
                                                    objReadOnlyFields: ['active']
                                                }}))
                                                dispatch(setModalOpen('CreateNewVendorModal'))
                                            } else {
                                                return {}
                                            }                                        
                                        }, 
                                        disabled: !!!componentData?.objInputAndChangedData['vendor']
                                    }
                                ]}
                                myStyle={{width: '20px', height: '20px', margin: '2.5px 4px'}}
                            />
                        </BlockSelect>
                        <BlockSelect
                            fieldName={'bank'}
                            showName={"name_eng"}
                            title={'Название Банка'}
                            value={componentData?.objInputAndChangedData['bank'] as ISelectValue}
                            options={banksData || []}
                            isEmptyOption={true}
                            onChange={(obj) => setValues(obj)}   
                            skeletonLoading={loadingProcess?.['bank']}
                            isRequired={fieldParams?.['bank']?.isRequired}  
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('bank')}
                            isInvalidStatus={componentInvalidFields?.['bank']}   
                            isChanged={!!componentData?.objChangedData?.['bank']}  
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
                                            dispatch(setModalProps({componentName: 'CreateNewBankModal', data: {
                                                objChangedData: {active: true},
                                                objReadOnlyFields: ['active'],
                                                qtyFieldsForSavingBtn: 1
                                            }}))
                                            dispatch(setModalOpen('CreateNewBankModal'))
                                        }
                                    }, 
                                    {
                                        name: "Изменить", 
                                        onClick: () => {
                                            const data = banksData?.find(item => item.id === componentData?.objInputAndChangedData['bank'])
                                            if (data) {
                                                dispatch(setModalProps({componentName: 'CreateNewBankModal', data: {
                                                    objInputData: funcConvertToFieldDataType(data),
                                                    objReadOnlyFields: ['active']
                                                }}))
                                                dispatch(setModalOpen('CreateNewBankModal'))
                                            } else {
                                                return {}
                                            }                                        
                                        }, 
                                        disabled: !!!componentData?.objInputAndChangedData['bank']
                                    }
                                ]}
                                myStyle={{width: '20px', height: '20px', margin: '2.5px 4px'}}
                            />
                        </BlockSelect>
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
                    </ContentBlock>
                </MainModalMainBlock>
            </ModalViewBase>
        </>)}
    </>)
}

export default CreateNewKeyExchangeModal