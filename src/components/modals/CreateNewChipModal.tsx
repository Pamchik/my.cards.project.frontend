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
import BlockSelect from "../UI/fields/BlockSelect";
import { useGetVendorsQuery } from "../../store/api/vendorApiSlice";
import { useAddChipMutation, useUpdateChipMutation } from "../../store/api/chipApiSlice";
import { funcConvertToFieldDataType } from "../functions/funcConvertToFieldDataType";
import { useAllComponentParamsReset } from "../hooks/useComponentDataReset";
import useTimeoutManager from "../hooks/useTimeoutManager";


const CreateNewChipModal = () => {

    const componentName = 'CreateNewChipModal'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const {modalsPropsData, loadingProcess, fieldParams, componentData, componentInvalidFields, savingProcess, componentsAPIUpdate} = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: vendorsData, isFetching: isFetchingVendorsData, error: errorVendorsData, refetch: refetchVendorsData} = useGetVendorsQuery(undefined)
    const [updateChip, {}] = useUpdateChipMutation()
    const [addChip, {}] = useAddChipMutation()

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    const initFieldParams: IFieldParams = {
        'short_name': {isRequired: true, type: 'text'},
        'full_name': {isRequired: true, type: 'text'},
        'kmc_test': {isRequired: false, type: 'text'},
        'kcv_test': {isRequired: false, type: 'text'},
        'vendor': {isRequired: true, type: 'number'},
        'other': {isRequired: false, type: 'text'},
        'active': {isRequired: true, type: 'boolean'},        
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
                await updateChip({...myData, id: currentId}).unwrap()    
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
                await addChip({...myData}).unwrap()    
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
                    <MainModalText modalTitle={`${componentData?.objInputData?.['id'] ? 'Изменение Чипа' : 'Создание Чипа'}`}/>
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

                <MainModalMainBlock myStyleMainBlock={{ display: 'flex', minHeight: '250px'}}>
                    <ContentBlock>
                        <BlockInput
                            onChange={(obj) => setValues(obj)}
                            fieldName={'short_name'}
                            title={'Короткое название'}
                            type={fieldParams?.['short_name']?.type as IInputTypes}
                            value={componentData?.objInputAndChangedData['short_name'] as IInputValue}
                            placeholder={'Введите название'}
                            skeletonLoading={loadingProcess?.['short_name']}
                            isRequired={fieldParams?.['short_name']?.isRequired}
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('short_name')}
                            isInvalidStatus={componentInvalidFields?.['short_name']}
                            isChanged={!!componentData?.objChangedData?.['short_name']}
                        /> 
                        <BlockInput
                            onChange={(obj) => setValues(obj)}
                            fieldName={'full_name'}
                            title={'Полное название'}
                            type={fieldParams?.['full_name']?.type as IInputTypes}
                            value={componentData?.objInputAndChangedData['full_name'] as IInputValue}
                            placeholder={'Введите название'}
                            skeletonLoading={loadingProcess?.['full_name']}
                            isRequired={fieldParams?.['full_name']?.isRequired}
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('full_name')}
                            isInvalidStatus={componentInvalidFields?.['full_name']}
                            isChanged={!!componentData?.objChangedData?.['full_name']}
                        /> 
                        <BlockInput
                            onChange={(obj) => setValues(obj)}
                            fieldName={'kmc_test'}
                            title={'Тестовый KMC'}
                            type={fieldParams?.['kmc_test']?.type as IInputTypes}
                            value={componentData?.objInputAndChangedData['kmc_test'] as IInputValue}
                            placeholder={'Введите KMC'}
                            skeletonLoading={loadingProcess?.['kmc_test']}
                            isRequired={fieldParams?.['kmc_test']?.isRequired}
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('kmc_test')}
                            isInvalidStatus={componentInvalidFields?.['kmc_test']}
                            isChanged={!!componentData?.objChangedData?.['kmc_test']}
                        /> 
                        <BlockInput
                            onChange={(obj) => setValues(obj)}
                            fieldName={'kcv_test'}
                            title={'Тестовый KCV'}
                            type={fieldParams?.['kcv_test']?.type as IInputTypes}
                            value={componentData?.objInputAndChangedData['kcv_test'] as IInputValue}
                            placeholder={'Введите KMC'}
                            skeletonLoading={loadingProcess?.['kcv_test']}
                            isRequired={fieldParams?.['kcv_test']?.isRequired}
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('kcv_test')}
                            isInvalidStatus={componentInvalidFields?.['kcv_test']}
                            isChanged={!!componentData?.objChangedData?.['kcv_test']}
                        />
                        <BlockSelect
                            fieldName={'vendor'}
                            showName={"name"}
                            title={'Вендор'}
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
                            rows={3}
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
                </MainModalMainBlock>
            </ModalViewBase>
        </>)}
    </>)
}

export default CreateNewChipModal