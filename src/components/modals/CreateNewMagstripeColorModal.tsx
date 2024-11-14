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
import { funcConvertToFieldDataType } from "../functions/funcConvertToFieldDataType";
import { useGetMagstripeTracksQuery } from "../../store/api/magstripeTrackApiSlice";
import { useAddMagstripeColorMutation, useUpdateMagstripeColorMutation } from "../../store/api/magstripeColorApiSlice";
import { useAllComponentParamsReset } from "../hooks/useComponentDataReset";
import useTimeoutManager from "../hooks/useTimeoutManager";


const CreateNewMagstripeColorModal = () => {

    const componentName = 'CreateNewMagstripeColorModal'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const {modalsPropsData, loadingProcess, fieldParams, componentData, componentInvalidFields, savingProcess, componentsAPIUpdate} = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: vendorsData, isFetching: isFetchingVendorsData, error: errorVendorsData, refetch: refetchVendorsData} = useGetVendorsQuery(undefined)
    const {data: magstripeTracksData, isFetching: isFetchingMagstripeTracksData, error: errorMagstripeTracksData, refetch: refetchMagstripeTracksData} = useGetMagstripeTracksQuery(undefined)
    const [updateMagstripeColor, {}] = useUpdateMagstripeColorMutation()
    const [addMagstripeColor, {}] = useAddMagstripeColorMutation()

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    const initFieldParams: IFieldParams = {
        'name_eng': {isRequired: true, type: 'text'},
        'name_rus': {isRequired: true, type: 'text'},
        'vendor': {isRequired: true, type: 'number'},
        'magstripe_tracks': {isRequired: true, type: 'number'},
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
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['magstripe_tracks']}}))
        if (isComponentPrepared && !isFetchingMagstripeTracksData) {
            if (!errorMagstripeTracksData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['magstripe_tracks']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['magstripe_tracks']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingMagstripeTracksData]);

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
                await updateMagstripeColor({...myData, id: currentId}).unwrap()    
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
                await addMagstripeColor({...myData}).unwrap()    
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
                    <MainModalText modalTitle={`${componentData?.objInputData?.['id'] ? 'Изменение цвета Магнитной полосы' : 'Создание цвета Магнитной полосы'}`}/>
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
                            fieldName={'name_rus'}
                            title={'Название (rus)'}
                            type={fieldParams?.['name_rus']?.type as IInputTypes}
                            value={componentData?.objInputAndChangedData['name_rus'] as IInputValue}
                            placeholder={'Введите название на русском'}
                            skeletonLoading={loadingProcess?.['name_rus']}
                            isRequired={fieldParams?.['name_rus']?.isRequired}
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('name_rus')}
                            isInvalidStatus={componentInvalidFields?.['name_rus']}
                            isChanged={!!componentData?.objChangedData?.['name_rus']}
                        /> 
                        <BlockInput
                            onChange={(obj) => setValues(obj)}
                            fieldName={'name_eng'}
                            title={'Название (eng)'}
                            type={fieldParams?.['name_eng']?.type as IInputTypes}
                            value={componentData?.objInputAndChangedData['name_eng'] as IInputValue}
                            placeholder={'Введите название на английском'}
                            skeletonLoading={loadingProcess?.['name_eng']}
                            isRequired={fieldParams?.['name_eng']?.isRequired}
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('name_eng')}
                            isInvalidStatus={componentInvalidFields?.['name_eng']}
                            isChanged={!!componentData?.objChangedData?.['name_eng']}
                        /> 
                        <BlockSelect
                            fieldName={'magstripe_tracks'}
                            showName={"name_rus"}
                            title={'Количество дорожек'}
                            value={componentData?.objInputAndChangedData['magstripe_tracks'] as ISelectValue}
                            options={magstripeTracksData || []}
                            isEmptyOption={true}
                            onChange={(obj) => setValues(obj)}   
                            skeletonLoading={loadingProcess?.['magstripe_tracks']}
                            isRequired={fieldParams?.['magstripe_tracks']?.isRequired}  
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('magstripe_tracks')}
                            isInvalidStatus={componentInvalidFields?.['magstripe_tracks']}   
                            isChanged={!!componentData?.objChangedData?.['magstripe_tracks']}  
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

export default CreateNewMagstripeColorModal