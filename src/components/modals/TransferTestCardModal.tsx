import { useEffect, useState } from "react";
import { useEffectStoreData } from "../hooks/useEffectStoreData";
import { useComponentPreparation } from "../hooks/useComponentPreparation";
import { useAllComponentParamsReset } from "../hooks/useComponentDataReset";
import { useFieldValueChange } from "../hooks/useFieldValueChange";
import { useDispatch } from "react-redux";
import { useAddTestCardTransferMutation, useUpdateTestCardTransferMutation } from "../../store/api/testCardTransferApiSlice";
import { IFieldParams, IInputTypes, ITextareaTypes } from "../../store/componentsData/fieldsParamsSlice";
import { useGetBanksQuery } from "../../store/api/bankApiSlice";
import { useGetBankEmployeesQuery } from "../../store/api/bankEmployeeApiSlice";
import { cardTestingShortRelevantApi, useGetCardsTestingShortRelevantQuery } from "../../store/api/cardTestingShortRelevantApiSlice";
import { setLoadingStatus } from "../../store/componentsData/loadingProcessSlice";
import { IInputValue, ISelectValue, ITextareaValue, deleteAllComponentData, setChangedData, setInputData } from "../../store/componentsData/componentsDataSlice";
import { setSavingStatus } from "../../store/componentsData/savingProcessSlice";
import { funcValidateFields } from "../functions/funcValidateFields";
import { deleteFieldInvalid, setFieldInvalid } from "../../store/componentsData/fieldsInvalidSlice";
import { setModalClose, setModalOpen } from "../../store/modalData/modalsSlice";
import { deleteModalProps, setModalProps } from "../../store/modalData/modalsPropsDataSlice";
import { functionErrorMessage } from "../functions/functionErrorMessage";
import { MainModalBtnBlock, MainModalMainBlock, MainModalText, MainModalTopBlock, ModalViewBase } from "./ModalViewBase";
import LoadingView from "../loading/LoadingView";
import ButtonMain from "../UI/buttons/ButtonMain";
import ContentBlock from "../blocks/ContentBlock";
import BlockSelect from "../UI/fields/BlockSelect";
import { funcConvertToFieldDataType } from "../functions/funcConvertToFieldDataType";
import BlockInput from "../UI/fields/BlockInput";
import BlockTextarea from "../UI/fields/BlockTextarea";
import useTimeoutManager from "../hooks/useTimeoutManager";



const TransferTestCardModal = () => {

    const componentName = 'TransferTestCardModal'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const {modalsPropsData, loadingProcess, fieldParams, componentData, componentInvalidFields, savingProcess, componentsAPIUpdate} = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: banksData, isFetching: isFetchingBanksData, error: errorBanksData, refetch: refetchBanksData} = useGetBanksQuery(undefined)
    const { data: bankEmployeesData, isFetching: isFetchingBankEmployeesData, error: errorBankEmployeesData, refetch: refetchBankEmployeesData } = useGetBankEmployeesQuery(
        { bank: modalsPropsData?.other?.['bank'] as number },
        {
            skip: !modalsPropsData?.other?.['bank'],
            selectFromResult: ({ data, ...other }) => ({
                data: modalsPropsData?.other?.['bank'] ? data : [],
                ...other
            })
        }
    )
    const { data: cardsTestingShortRelevantData, isFetching: isFetchingCardsTestingShortRelevantData, error: errorCardsTestingShortRelevantData, refetch: refetchCardsTestingShortRelevantData } = useGetCardsTestingShortRelevantQuery(
        { id: (modalsPropsData?.other?.['action']?.id === 2 ? modalsPropsData?.other?.['to_card_testing_project'] : modalsPropsData?.other?.['card_testing_project'])},
        {
            skip: (modalsPropsData?.other?.['action']?.id === 2 ? !modalsPropsData?.other?.['to_card_testing_project'] : !modalsPropsData?.other?.['card_testing_project']),
            selectFromResult: ({ data, ...other }) => ({
                data: (modalsPropsData?.other?.['action']?.id === 2 ? modalsPropsData?.other?.['to_card_testing_project'] : modalsPropsData?.other?.['card_testing_project']) ? data : [],
                ...other
            })
        }
    )

    const [addTestCardTransfer, {}] = useAddTestCardTransferMutation()
    const [updateTestCardTransfer, {}] = useUpdateTestCardTransferMutation()

    const initFieldParams: IFieldParams = {
        'card_testing_project': {isRequired: true, type: 'number'},
        'bank': {isRequired: false, type: 'number'},
        'to_card_testing_project': {isRequired: false, type: 'number'},
        'recipient': {isRequired: false, type: 'number'},
        'transfer_date': {isRequired: true, type: 'date'},  
        'transfer_quantity': {isRequired: true, type: 'number', valueMinMax: {min: 0}},   
        'other': {isRequired: false, type: 'text'},     
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['card_testing_project']}}))
        if (isComponentPrepared && !isFetchingCardsTestingShortRelevantData) {
            if (!errorCardsTestingShortRelevantData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['card_testing_project']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['card_testing_project']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingCardsTestingShortRelevantData]);

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
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['recipient']}}))
        if (isComponentPrepared && !isFetchingBankEmployeesData) {
            if (!errorBankEmployeesData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['recipient']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['recipient']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingBankEmployeesData]);

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
        let updatedFieldParams = {...fieldParams}
        if (modalsPropsData?.other?.['action']?.id === 4) {
            updatedFieldParams = {
                ...fieldParams,
                'to_card_testing_project': {isRequired: true, type: 'number'},
            }
        } else if (modalsPropsData?.other?.['action']?.id === 5) {
            updatedFieldParams = {
                ...fieldParams,
                'bank': {isRequired: true, type: 'number'},
                'recipient': {isRequired: true, type: 'number'},
            }
        }
        const currentId: number = componentData?.objInputAndChangedData['id'] as number
        const isValid = funcValidateFields(fieldParams, componentData?.objInputAndChangedData, componentData?.objChangedData)
        if (currentId) {
            if (isValid.isAllFieldsValid) {
                dispatch(deleteFieldInvalid({componentName}))
                const myData = {...componentData.objChangedData, action: modalsPropsData?.other?.action?.id} 
                await updateTestCardTransfer({...myData, id: currentId}).unwrap()    
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
                await addTestCardTransfer({...myData}).unwrap()    
                .then((res) => {
                    dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: true}}))
                    dispatch(deleteAllComponentData({componentName}))
                    setManagedTimeout(() => { 
                        dispatch(setSavingStatus({ componentName, data: { status: false } }))
                        dispatch(setModalClose(componentName))
                        dispatch(deleteModalProps({componentName}))
                        dispatch(cardTestingShortRelevantApi.util.resetApiState())
                        allComponentParamsReset()
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
                    dispatch(cardTestingShortRelevantApi.util.resetApiState())
                    allComponentParamsReset()
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
                    <MainModalText modalTitle={modalsPropsData?.other?.['action']?.['title'] || ''}/>
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
                                dispatch(cardTestingShortRelevantApi.util.resetApiState())
                                allComponentParamsReset()
                            }}
                            type="resetIcon" 
                        />
                    </MainModalBtnBlock>
                </MainModalTopBlock>
                <MainModalMainBlock myStyleMainBlock={{ display: 'flex', minHeight: '250px'}}>
                    <ContentBlock myStyleMain={{width: '600px'}}>
                        {modalsPropsData?.other?.['action']?.id === 1 && <></>}
                        {modalsPropsData?.other?.['action']?.id === 2 && <>
                            <BlockSelect
                                fieldName={'card_testing_project'}
                                showName={"number"}
                                title={'Получить из'}
                                value={componentData?.objInputAndChangedData['card_testing_project'] as ISelectValue}
                                options={cardsTestingShortRelevantData || []}
                                isEmptyOption={true}
                                onChange={(obj) => setValues(obj)}   
                                skeletonLoading={loadingProcess?.['card_testing_project']}
                                isRequired={fieldParams?.['card_testing_project']?.isRequired}  
                                isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('card_testing_project')}
                                isInvalidStatus={componentInvalidFields?.['card_testing_project']}   
                                isChanged={!!componentData?.objChangedData?.['card_testing_project']}  
                            />
                        </>}
                        {modalsPropsData?.other?.['action']?.id === 3 && <>
                            <BlockSelect
                                fieldName={'bank'}
                                showName={"name_eng"}
                                title={'Банк (если поле пустое, то добавится на хранение в IBS Project)'}
                                value={componentData?.objInputAndChangedData['bank'] as ISelectValue}
                                options={banksData || []}
                                isEmptyOption={true}
                                onChange={(obj) => setValues(obj)}   
                                skeletonLoading={loadingProcess?.['bank']}
                                isRequired={fieldParams?.['bank']?.isRequired}  
                                isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('bank')}
                                isInvalidStatus={componentInvalidFields?.['bank']}   
                                isChanged={!!componentData?.objChangedData?.['bank']}  
                            />   
                        </>}
                        {modalsPropsData?.other?.['action']?.id === 4 && <>
                            <BlockSelect
                                fieldName={'to_card_testing_project'}
                                showName={"number"}
                                title={'Передать в'}
                                value={componentData?.objInputAndChangedData['to_card_testing_project'] as ISelectValue}
                                options={cardsTestingShortRelevantData || []}
                                isEmptyOption={true}
                                onChange={(obj) => setValues(obj)}   
                                skeletonLoading={loadingProcess?.['to_card_testing_project']}
                                isRequired={fieldParams?.['to_card_testing_project']?.isRequired}  
                                isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('to_card_testing_project')}
                                isInvalidStatus={componentInvalidFields?.['to_card_testing_project']}   
                                isChanged={!!componentData?.objChangedData?.['to_card_testing_project']}  
                            /> 
                        </>}
                        {modalsPropsData?.other?.['action']?.id === 5 && <>
                            <BlockSelect
                                fieldName={'recipient'}
                                showName={"name"}
                                title={'Получатель'}
                                value={componentData?.objInputAndChangedData['recipient'] as ISelectValue}
                                options={bankEmployeesData || []}
                                isEmptyOption={true}
                                onChange={(obj) => setValues(obj)}   
                                skeletonLoading={loadingProcess?.['recipient']}
                                isRequired={fieldParams?.['recipient']?.isRequired}  
                                isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('recipient')}
                                isInvalidStatus={componentInvalidFields?.['recipient']}   
                                isChanged={!!componentData?.objChangedData?.['recipient']}  
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
                                                        bank: modalsPropsData?.other?.['bank']
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
                                                const data = bankEmployeesData?.find(item => item.id === componentData?.objInputAndChangedData['recipient'])
                                                if (data) {
                                                    dispatch(setModalProps({componentName: 'CreateNewBankEmployeeModal', data: {
                                                        objInputData: {
                                                            ...funcConvertToFieldDataType(data),
                                                            bank: modalsPropsData?.other?.['bank']
                                                        },
                                                        objReadOnlyFields: ['active', 'bank']
                                                    }}))
                                                    dispatch(setModalOpen('CreateNewBankEmployeeModal'))
                                                } else {
                                                    return {}
                                                }                                        
                                            }, 
                                            disabled: !!!modalsPropsData?.other?.['bank']
                                        }
                                    ]}
                                    myStyle={{width: '20px', height: '20px', margin: '2.5px 4px'}}
                                />
                            </BlockSelect>
                        </>}
                        {modalsPropsData?.other?.['action']?.id === 6 && <></>}
                        {modalsPropsData?.other?.['action']?.id === 7 && <></>}
                        <BlockInput
                            onChange={(obj) => setValues(obj)}
                            fieldName={'transfer_date'}
                            title={'Дата'}
                            type={fieldParams?.['transfer_date']?.type as IInputTypes}
                            value={componentData?.objInputAndChangedData['transfer_date'] as IInputValue}
                            placeholder={''}
                            skeletonLoading={loadingProcess?.['transfer_date']}
                            isRequired={fieldParams?.['transfer_date']?.isRequired}
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('transfer_date')}
                            isInvalidStatus={componentInvalidFields?.['transfer_date']}
                            isChanged={!!componentData?.objChangedData?.['transfer_date']}
                        />
                        <BlockInput
                            onChange={(obj) => setValues(obj)}
                            fieldName={'transfer_quantity'}
                            title={'Количество'}
                            type={fieldParams?.['transfer_quantity']?.type as IInputTypes}
                            value={componentData?.objInputAndChangedData['transfer_quantity'] as IInputValue}
                            placeholder={'Введите количество'}
                            skeletonLoading={loadingProcess?.['transfer_quantity']}
                            isRequired={fieldParams?.['transfer_quantity']?.isRequired}
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('transfer_quantity')}
                            isInvalidStatus={componentInvalidFields?.['transfer_quantity']}
                            isChanged={!!componentData?.objChangedData?.['transfer_quantity']}
                            minValue={0}
                        />
                        <BlockTextarea
                            onChange={(obj) => setValues(obj)}
                            fieldName={'other'}
                            title={'Причина'}
                            type={fieldParams?.['other']?.type as ITextareaTypes}
                            value={componentData?.objInputAndChangedData['other'] as ITextareaValue}
                            placeholder={'Введите комментарий'}
                            skeletonLoading={loadingProcess?.['other']}
                            isRequired={fieldParams?.['other']?.isRequired}
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('other')}
                            isInvalidStatus={componentInvalidFields?.['other']}
                            isChanged={!!componentData?.objChangedData?.['other']}
                            rows={3}
                        />
                    </ContentBlock> 
                </MainModalMainBlock>
            </ModalViewBase>
        </>)}   
    </>)
}


export default TransferTestCardModal