import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import BtnBlock from "../../../../blocks/BtnBlock";
import ButtonMain from "../../../../UI/buttons/ButtonMain";
import LoadingView from "../../../../loading/LoadingView";
import ContentBlock from "../../../../blocks/ContentBlock";
import BlockSelect from "../../../../UI/fields/BlockSelect";
import { deleteAllComponentData, deleteChangedComponentData, ISelectValue, ITextareaValue, setInputData } from "../../../../../store/componentsData/componentsDataSlice";
import BlockInput from "../../../../UI/fields/BlockInput";
import { IFieldParams, IInputTypes, ITextareaTypes } from "../../../../../store/componentsData/fieldsParamsSlice";
import BlockTextarea from "../../../../UI/fields/BlockTextarea";
import { useEffectStoreData } from "../../../../hooks/useEffectStoreData";
import { useComponentPreparation } from "../../../../hooks/useComponentPreparation";
import { useAllComponentParamsReset } from "../../../../hooks/useComponentDataReset";
import useTimeoutManager from "../../../../hooks/useTimeoutManager";
import { useFieldValueChange } from "../../../../hooks/useFieldValueChange";
import { useAddProcessDataMutation, useGetProcessesDataQuery, useUpdateProcessDataMutation } from "../../../../../store/api/processDataApiSlice";
import { useGetProcessStatusesQuery } from "../../../../../store/api/processStatusApiSlice";
import { deleteComponentsAPIUpdate } from "../../../../../store/componentsData/componentsAPIUpdateSlice";
import { setLoadingStatus } from "../../../../../store/componentsData/loadingProcessSlice";
import { funcConvertToFieldDataType } from "../../../../functions/funcConvertToFieldDataType";
import { setSavingStatus } from "../../../../../store/componentsData/savingProcessSlice";
import { funcValidateFields } from "../../../../functions/funcValidateFields";
import { deleteFieldInvalid, setFieldInvalid } from "../../../../../store/componentsData/fieldsInvalidSlice";
import { functionErrorMessage } from "../../../../functions/functionErrorMessage";
import { changeComponentReadOnly } from "../../../../../store/componentsData/componentsReadOnlySlice";
import { useGetChangelogQuery } from "../../../../../store/api/changelogApiSlice";




interface IStatusCommentBlockData {
    selectedID: number
    processStep: number
}

const StatusCommentBlock = ({
    selectedID,
    processStep
}: IStatusCommentBlockData) => {

    const componentName = `StatusCommentBlock_${processStep}`
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const { loadingProcess, fieldParams, componentData, componentReadOnly, componentInvalidFields, savingProcess, componentsAPIUpdate } = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: processStatusesData, isFetching: isFetchingProcessStatusesData, error: errorProcessStatusesData, refetch: refetchProcessStatusesData} = useGetProcessStatusesQuery(undefined)
    const {data: processData, isFetching: isFetchingProcessData, error: errorProcessData, refetch: refetchProcessData } = useGetProcessesDataQuery(
        { line_number: selectedID as number, process_step: processStep },
        {
            skip: !selectedID || !processStep,
            selectFromResult: ({ data, ...other }) => ({
                data: (selectedID && processStep) ? data : [],
                ...other
            })
        }
    )
    const {data: changelogData, isFetching: isFetchingChangelogData, error: errorChangelogData, refetch: refetchChangelogData} = useGetChangelogQuery({
        model_name: 'ProcessData',
        id: selectedID,
        process_step: processStep
    });

    const [updateProcessData, {}] = useUpdateProcessDataMutation()
    const [addProcessData, {}] = useAddProcessDataMutation()

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);
    
    useEffect(() => {
        if (componentsAPIUpdate.includes(`processData_${processStep}`)) {
            updateAPIData(`processData_${processStep}`, refetchProcessData)
        } else if (componentsAPIUpdate.includes('processStatusesData')) {
            updateAPIData('processStatusesData', refetchProcessStatusesData)
        } else if (componentsAPIUpdate.includes('changelogData')) {
            updateAPIData('changelogData', refetchChangelogData)
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
        'step_status': {isRequired: true, type: 'number'},
        'modified_date': {isRequired: false, type: 'text'},
        'modified_by_name': {isRequired: false, type: 'text'},
        'step_comment': {isRequired: false, type: 'text'},
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['step_comment']}}))
        if (isComponentPrepared) {
            if (!isFetchingProcessData) {
                if (!errorProcessData && processData) {
                    const myData = funcConvertToFieldDataType(processData[0])
                    dispatch(setInputData({componentName, data: Object.keys(myData).length > 0 ? myData : {line_number: selectedID, process_step: processStep, step_status: 1}}))
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['step_comment']}}))
                    }, 1000)  
                } else {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['step_comment']}}))
                    }, 1000)
                }
            }
        }
    }, [selectedID, isComponentPrepared, processData, isFetchingProcessData]); 

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['step_status']}}))
        if (isComponentPrepared && !isFetchingProcessStatusesData && !isFetchingProcessData && !errorProcessData) {
            if (!errorProcessStatusesData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['step_status']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['step_status']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingProcessStatusesData, isFetchingProcessData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['modified_by_name', 'modified_date']}}))
        if (isComponentPrepared) {
            if (!isFetchingChangelogData) {
                if (!errorChangelogData && changelogData) {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['modified_by_name', 'modified_date']}}))
                    }, 1000)  
                } else {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['modified_by_name', 'modified_date']}}))
                    }, 1000)
                }
            }
        }
    }, [selectedID, isComponentPrepared, changelogData, isFetchingChangelogData]); 

    useEffect(() => {
        funcChangeCancelSet(true)
    }, [selectedID]);

    useEffect(() => {
        if (isFetchingProcessData) {
            funcChangeCancelSet(true)
        }
    }, [isFetchingProcessData]);

    async function funcSaveFields () {
        dispatch(setSavingStatus({componentName, data: {status: true}}))
        const currentId: number = componentData?.objInputAndChangedData['id'] as number
        const isValid = funcValidateFields(fieldParams, componentData?.objInputAndChangedData, componentData?.objChangedData)
        if (currentId) {
            if (isValid.isAllFieldsValid) {
                dispatch(deleteFieldInvalid({componentName}))
                const myData = componentData.objChangedData
                await updateProcessData({...myData, id: currentId}).unwrap()    
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
                await addProcessData({line_number: selectedID, process_step: processStep, step_status: 1, ...myData}).unwrap()    
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
                <ContentBlock myStyleMain={{maxWidth: '20%'}}>
                    <BlockSelect
                        fieldName={'step_status'}
                        showName={"name_rus"}
                        title={'Статус'}
                        value={componentData?.objInputAndChangedData['step_status'] as ISelectValue}
                        options={processStatusesData || []}
                        onChange={(obj) => setValues(obj)}   
                        skeletonLoading={loadingProcess?.['step_status']}
                        isRequired={fieldParams?.['step_status']?.isRequired}  
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['step_status']}
                        isChanged={!!componentData?.objChangedData?.['step_status']}
                        isSortDisabled={true}
                    ></BlockSelect>
                </ContentBlock>
                <ContentBlock myStyleMain={{maxWidth: '40%'}}>
                    <BlockInput
                        onChange={() => {}}
                        fieldName={'modified_date'}
                        title={'Дата изменения данных'}
                        type={fieldParams?.['modified_date']?.type as IInputTypes}
                        value={changelogData?.update?.timestamp || ''}
                        placeholder={''}
                        skeletonLoading={loadingProcess?.['modified_date']}
                        isRequired={fieldParams?.['modified_date']?.isRequired}
                        isReadOnly={true}
                        myStyleInput={{width: '70%'}}
                    ></BlockInput>
                    <BlockInput
                        onChange={() => {}}
                        fieldName={'modified_by_name'}
                        title={'Изменил'}
                        type={fieldParams?.['modified_by_name']?.type as IInputTypes}
                        value={changelogData?.update?.username || ''}
                        placeholder={''}
                        skeletonLoading={loadingProcess?.['modified_by_name']}
                        isRequired={fieldParams?.['modified_by_name']?.isRequired}
                        isReadOnly={true}
                        myStyleInput={{width: '70%'}}
                    />
                </ContentBlock>
                <ContentBlock myStyleMain={{maxWidth: '40%'}}>
                    <BlockTextarea
                        onChange={(obj) => setValues(obj)}
                        fieldName={'step_comment'}
                        title={'Комментарий'}
                        type={fieldParams?.['step_comment']?.type as ITextareaTypes}
                        value={componentData?.objInputAndChangedData['step_comment'] as ITextareaValue}
                        placeholder={'Введите комментарий'}
                        skeletonLoading={loadingProcess?.['step_comment']}
                        isRequired={fieldParams?.['step_comment']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['step_comment']}
                        isChanged={!!componentData?.objChangedData?.['step_comment']}
                        rows={6}
                    />
                </ContentBlock>
            </ContentBlock>
        </>)}
    </>)
}


export default StatusCommentBlock