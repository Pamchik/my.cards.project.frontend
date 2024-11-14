import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import BtnBlock from "../../../../../blocks/BtnBlock";
import ButtonMain from "../../../../../UI/buttons/ButtonMain";
import LoadingView from "../../../../../loading/LoadingView";
import ContentBlock from "../../../../../blocks/ContentBlock";
import BlockInput from "../../../../../UI/fields/BlockInput";
import { IFieldParams, IInputTypes } from "../../../../../../store/componentsData/fieldsParamsSlice";
import { deleteAllComponentData, deleteChangedComponentData, IInputValue, setInputData } from "../../../../../../store/componentsData/componentsDataSlice";
import { useEffectStoreData } from "../../../../../hooks/useEffectStoreData";
import { useComponentPreparation } from "../../../../../hooks/useComponentPreparation";
import { useAllComponentParamsReset } from "../../../../../hooks/useComponentDataReset";
import useTimeoutManager from "../../../../../hooks/useTimeoutManager";
import { useFieldValueChange } from "../../../../../hooks/useFieldValueChange";
import { useAddAnnexesConditionMutation, useGetAnnexesConditionQuery, useUpdateAnnexesConditionMutation } from "../../../../../../store/api/annexesConditionApiSlice";
import { deleteComponentsAPIUpdate } from "../../../../../../store/componentsData/componentsAPIUpdateSlice";
import { setLoadingStatus } from "../../../../../../store/componentsData/loadingProcessSlice";
import { funcConvertToFieldDataType } from "../../../../../functions/funcConvertToFieldDataType";
import { setSavingStatus } from "../../../../../../store/componentsData/savingProcessSlice";
import { funcValidateFields } from "../../../../../functions/funcValidateFields";
import { deleteFieldInvalid, setFieldInvalid } from "../../../../../../store/componentsData/fieldsInvalidSlice";
import { functionErrorMessage } from "../../../../../functions/functionErrorMessage";
import { changeComponentReadOnly } from "../../../../../../store/componentsData/componentsReadOnlySlice";



interface IAnnexesConditionsData {
    selectedID: number
}

const AnnexesConditions = ({
    selectedID,
}: IAnnexesConditionsData) => {

    const componentName = 'AnnexesConditions'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const { loadingProcess, fieldParams, componentData, componentReadOnly, componentInvalidFields, savingProcess, componentsAPIUpdate } = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: annexesConditionData, isFetching: isFetchingAnnexesConditionData, error: errorAnnexesConditionData, refetch: refetchAnnexesConditionData} = useGetAnnexesConditionQuery({line_number: selectedID});
    const [updateAnnexesCondition, {}] = useUpdateAnnexesConditionMutation()
    const [addAnnexesCondition, {}] = useAddAnnexesConditionMutation()

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);
    
    useEffect(() => {
        if (componentsAPIUpdate.includes('annexesConditionData')) {
            updateAPIData('annexesConditionData', refetchAnnexesConditionData)
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
        'deviation_min': {isRequired: false, type: 'number', valueMinMax: {min: -100, max: 0}},
        'deviation_max': {isRequired: false, type: 'number', valueMinMax: {min: 0, max: 100}},
        'lead_time_min': {isRequired: false, type: 'number', valueMinMax: {min: 0}},
        'lead_time_max': {isRequired: false, type: 'number', valueMinMax: {min: 0}},
        'name': {isRequired: false, type: 'text'}
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: Object.keys(initFieldParams)}}))
        if (isComponentPrepared) {
            if (!isFetchingAnnexesConditionData) {
                if (!errorAnnexesConditionData && annexesConditionData) {
                    const myData = funcConvertToFieldDataType(annexesConditionData[0])
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
    }, [selectedID, isComponentPrepared, annexesConditionData, isFetchingAnnexesConditionData]); 

    useEffect(() => {
        funcChangeCancelSet(true)
    }, [selectedID]);

    useEffect(() => {
        if (isFetchingAnnexesConditionData) {
            funcChangeCancelSet(true)
        }
    }, [isFetchingAnnexesConditionData]);

    async function funcSaveFields () {
        dispatch(setSavingStatus({componentName, data: {status: true}}))
        const currentId: number = componentData?.objInputAndChangedData['id'] as number
        const isValid = funcValidateFields(fieldParams, componentData?.objInputAndChangedData, componentData?.objChangedData)
        if (currentId) {
            if (isValid.isAllFieldsValid) {
                dispatch(deleteFieldInvalid({componentName}))
                const myData = componentData.objChangedData
                await updateAnnexesCondition({...myData, id: currentId}).unwrap()    
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
                await addAnnexesCondition({...myData, line_number: selectedID}).unwrap()    
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
                <ContentBlock title={'Название:'} myStyleMain={{}} line={true}>
                    <BlockInput
                        onChange={(obj) => setValues(obj)}
                        fieldName={'name'}
                        title={'Название'}
                        type={fieldParams?.['name']?.type as IInputTypes}
                        value={componentData?.objInputAndChangedData['name'] as IInputValue}
                        placeholder={'Введите название'}
                        skeletonLoading={loadingProcess?.['name']}
                        isRequired={fieldParams?.['name']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['name']}
                        isChanged={!!componentData?.objChangedData?.['name']}
                    />
                </ContentBlock>
                <ContentBlock title={'Производственное отклонение:'} myStyleMain={{height: '200px'}} line={true}>
                    <BlockInput
                        onChange={(obj) => setValues(obj)}
                        fieldName={'deviation_min'}
                        title={'Отрицательное отклонение %'}
                        type={fieldParams?.['deviation_min']?.type as IInputTypes}
                        value={componentData?.objInputAndChangedData['deviation_min'] as IInputValue}
                        placeholder={'Введите целое число'}
                        skeletonLoading={loadingProcess?.['deviation_min']}
                        isRequired={fieldParams?.['deviation_min']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['deviation_min']}
                        isChanged={!!componentData?.objChangedData?.['deviation_min']}
                    />
                    <BlockInput
                        onChange={(obj) => setValues(obj)}
                        fieldName={'deviation_max'}
                        title={'Положительное отклонение %'}
                        type={fieldParams?.['deviation_max']?.type as IInputTypes}
                        value={componentData?.objInputAndChangedData['deviation_max'] as IInputValue}
                        placeholder={'Введите целое число'}
                        skeletonLoading={loadingProcess?.['deviation_max']}
                        isRequired={fieldParams?.['deviation_max']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['deviation_max']}
                        isChanged={!!componentData?.objChangedData?.['deviation_max']}
                    />
                </ContentBlock>
                <ContentBlock title={'Срок производства и доставки:'} myStyleMain={{}}>
                    <BlockInput
                        onChange={(obj) => setValues(obj)}
                        fieldName={'lead_time_min'}
                        title={'Минимальная дата доставки'}
                        type={fieldParams?.['lead_time_min']?.type as IInputTypes}
                        value={componentData?.objInputAndChangedData['lead_time_min'] as IInputValue}
                        placeholder={'Введите количество недель'}
                        skeletonLoading={loadingProcess?.['lead_time_min']}
                        isRequired={fieldParams?.['lead_time_min']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['lead_time_min']}
                        isChanged={!!componentData?.objChangedData?.['lead_time_min']}
                    />
                    <BlockInput
                        onChange={(obj) => setValues(obj)}
                        fieldName={'lead_time_max'}
                        title={'Максимальная дата доставки'}
                        type={fieldParams?.['lead_time_max']?.type as IInputTypes}
                        value={componentData?.objInputAndChangedData['lead_time_max'] as IInputValue}
                        placeholder={'Введите количество недель'}
                        skeletonLoading={loadingProcess?.['lead_time_max']}
                        isRequired={fieldParams?.['lead_time_max']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['lead_time_max']}
                        isChanged={!!componentData?.objChangedData?.['lead_time_max']}
                    />
                </ContentBlock>
            </ContentBlock>
        </>)}
    </>)
}


export default AnnexesConditions