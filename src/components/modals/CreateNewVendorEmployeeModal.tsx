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
import { useAddVendorEmployeeMutation, useUpdateVendorEmployeeMutation } from "../../store/api/vendorEmployeeApiSlice";
import { useGetVendorQuery } from "../../store/api/vendorApiSlice";
import { useAllComponentParamsReset } from "../hooks/useComponentDataReset";
import useTimeoutManager from "../hooks/useTimeoutManager";


const CreateNewVendorEmployeeModal = () => {

    const componentName = 'CreateNewVendorEmployeeModal'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const {modalsPropsData, loadingProcess, fieldParams, componentData, componentInvalidFields, savingProcess, componentsAPIUpdate} = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: vendorData, isFetching: isFetchingVendorData, error: errorVendorData, refetch: refetchVendorData} = useGetVendorQuery(undefined)
    const [updateVendorEmployee, {}] = useUpdateVendorEmployeeMutation()
    const [addVendorEmployee, {}] = useAddVendorEmployeeMutation()

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    const initFieldParams: IFieldParams = {
        'name': {isRequired: true, type: 'text'},
        'email': {isRequired: false, type: 'email'},
        'phone': {isRequired: false, type: 'phone'},
        'other': {isRequired: false, type: 'text'},
        'vendor': {isRequired: true, type: 'number'},
        'active': {isRequired: true, type: 'boolean'},
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: Object.keys(initFieldParams)}}))
        if (isComponentPrepared) {
            setManagedTimeout(() => {
                dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: Object.keys(initFieldParams)}}))
            }, 1000) 
        }
    }, [isComponentPrepared]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['vendor']}}))
        if (isComponentPrepared && !isFetchingVendorData && !errorVendorData) {
            if (!errorVendorData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['vendor']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['vendor']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingVendorData]);

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
                await updateVendorEmployee({...myData, id: currentId}).unwrap()    
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
                await addVendorEmployee({...myData}).unwrap()    
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
                    <MainModalText modalTitle={`${componentData?.objInputData?.['id'] ? 'Изменение сотрудника Вендора' : 'Создание сотрудника Вендора'}`}/>
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

                <MainModalMainBlock myStyleMainBlock={{ display: 'flex', minHeight: '250px' }}>
                    <ContentBlock>
                        <BlockInput
                            onChange={(obj) => setValues(obj)}
                            fieldName={'name'}
                            title={'Имя сотрудника'}
                            type={fieldParams?.['name']?.type as IInputTypes}
                            value={componentData?.objInputAndChangedData['name'] as IInputValue}
                            placeholder={'Введите имя сотрудника'}
                            skeletonLoading={loadingProcess?.['name']}
                            isRequired={fieldParams?.['name']?.isRequired}
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('name')}
                            isInvalidStatus={componentInvalidFields?.['name']}
                            isChanged={!!componentData?.objChangedData?.['name']}
                        />
                        <BlockInput
                            onChange={(obj) => setValues(obj)}
                            fieldName={'email'}
                            title={'Почта'}
                            type={fieldParams?.['email']?.type as IInputTypes}
                            value={componentData?.objInputAndChangedData['email'] as IInputValue}
                            placeholder={'Введите почту сотрудника'}
                            skeletonLoading={loadingProcess?.['email']}
                            isRequired={fieldParams?.['email']?.isRequired}
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('email')}
                            isInvalidStatus={componentInvalidFields?.['email']}
                            isChanged={!!componentData?.objChangedData?.['email']}
                        />                
                        <BlockInput
                            onChange={(obj) => setValues(obj)}
                            fieldName={'phone'}
                            title={'Номер телефона'}
                            type={fieldParams?.['phone']?.type as IInputTypes}
                            value={componentData?.objInputAndChangedData['phone'] as IInputValue}
                            placeholder={'Введите номер'}
                            skeletonLoading={loadingProcess?.['phone']}
                            isRequired={fieldParams?.['phone']?.isRequired}
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('phone')}
                            isInvalidStatus={componentInvalidFields?.['phone']}
                            isChanged={!!componentData?.objChangedData?.['phone']}
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
                            rows={3}
                        />
                        <BlockSelect
                            fieldName={'vendor'}
                            showName={"name"}
                            title={'Вендор'}
                            value={componentData?.objInputAndChangedData['vendor'] as ISelectValue}
                            options={vendorData || []}
                            isEmptyOption={false}
                            onChange={(obj) => setValues(obj)}   
                            skeletonLoading={loadingProcess?.['vendor']}
                            isRequired={fieldParams?.['vendor']?.isRequired}  
                            isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('vendor')} 
                            isInvalidStatus={componentInvalidFields?.['vendor']}   
                            isChanged={!!componentData?.objChangedData?.['vendor']}  
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

export default CreateNewVendorEmployeeModal