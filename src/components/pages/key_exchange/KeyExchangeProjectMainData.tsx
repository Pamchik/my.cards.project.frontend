import { useEffect, useState } from "react";
import { useEffectStoreData } from "../../hooks/useEffectStoreData";
import { useComponentPreparation } from "../../hooks/useComponentPreparation";
import { useFieldValueChange } from "../../hooks/useFieldValueChange";
import { useDispatch } from "react-redux";
import { useGetKeyExchangeQuery } from "../../../store/api/keyExchangeApiSlice";
import { deleteComponentsAPIUpdate } from "../../../store/componentsData/componentsAPIUpdateSlice";
import { IFieldParams, IInputTypes, ITextareaTypes } from "../../../store/componentsData/fieldsParamsSlice";
import { setLoadingStatus } from "../../../store/componentsData/loadingProcessSlice";
import { funcConvertToFieldDataType } from "../../functions/funcConvertToFieldDataType";
import { ITextareaValue, deleteChangedComponentData, setInputData } from "../../../store/componentsData/componentsDataSlice";
import { deleteFieldInvalid } from "../../../store/componentsData/fieldsInvalidSlice";
import { changeComponentReadOnly } from "../../../store/componentsData/componentsReadOnlySlice";
import LoadingView from "../../loading/LoadingView";
import ContentBlock from "../../blocks/ContentBlock";
import BlockInput from "../../UI/fields/BlockInput";
import BlockTextarea from "../../UI/fields/BlockTextarea";
import { useAllComponentParamsReset } from "../../hooks/useComponentDataReset";
import useTimeoutManager from "../../hooks/useTimeoutManager";
import { useGetChangelogQuery } from "../../../store/api/changelogApiSlice";


interface IKeyExchangeProjectMainData {
    selectedID: number
}

const KeyExchangeProjectMainData = ({
    selectedID,
}: IKeyExchangeProjectMainData) => {

    const componentName = 'KeyExchangeProjectMainData'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const { loadingProcess, componentReadOnly, fieldParams, componentData, componentInvalidFields, savingProcess, componentsAPIUpdate } = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: keyExchangeData, isFetching: isFetchingKeyExchangeData, error: errorKeyExchangeData, refetch: refetchKeyExchangeData} = useGetKeyExchangeQuery({id: selectedID});
    const {data: changelogData, isFetching: isFetchingChangelogData, error: errorChangelogData, refetch: refetchChangelogData} = useGetChangelogQuery({
        model_name: 'KeyExchangeProjects',
        id: selectedID
    });
    
    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);
    
    useEffect(() => {
        if (componentsAPIUpdate.includes('keyExchangeData')) {
            updateAPIData('keyExchangeData', refetchKeyExchangeData)
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
        'created_by_name': {isRequired: false, type: 'text'},
        'modified_by_name': {isRequired: false, type: 'text'},
        'created_date': {isRequired: false, type: 'text'},
        'modified_date': {isRequired: false, type: 'text'},
        'other': {isRequired: false, type: 'text'},
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['other']}}))
        if (isComponentPrepared) {
            if (!isFetchingKeyExchangeData) {
                if (!errorKeyExchangeData && keyExchangeData) {
                    const myData = funcConvertToFieldDataType(keyExchangeData[0])
                    dispatch(setInputData({componentName, data: myData}))
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['other']}}))
                    }, 1000)  
                } else {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['other']}}))
                    }, 1000)
                }
            }
        }
    }, [selectedID, isComponentPrepared, keyExchangeData, isFetchingKeyExchangeData]); 

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['created_by_name', 'modified_by_name', 'created_date', 'modified_date']}}))
        if (isComponentPrepared) {
            if (!isFetchingChangelogData) {
                if (!errorChangelogData && changelogData) {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['created_by_name', 'modified_by_name', 'created_date', 'modified_date']}}))
                    }, 1000)  
                } else {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['created_by_name', 'modified_by_name', 'created_date', 'modified_date']}}))
                    }, 1000)
                }
            }
        }
    }, [selectedID, isComponentPrepared, changelogData, isFetchingChangelogData]); 

    useEffect(() => {
        funcChangeCancelSet(true)
    }, [selectedID]);

    useEffect(() => {
        if (isFetchingKeyExchangeData) {
            funcChangeCancelSet(true)
        }
    }, [isFetchingKeyExchangeData]);

    function funcChangeCancelSet(newStatus: boolean) {
        dispatch(deleteChangedComponentData({componentName}))
        dispatch(changeComponentReadOnly({componentName, newStatus}))
        dispatch(deleteFieldInvalid({componentName}))        
    }


    return (<>
        {isComponentPrepared && (<>

            {savingProcess?.status && 
                <LoadingView 
                    isSuccessful={savingProcess.isSuccessful} 
                    errorMessage={savingProcess.message} 
                    componentName={componentName} 
                />
            } 
            <ContentBlock myStyleContent={{flexDirection: 'row', display: 'flex', height: '100%'}}>
                <ContentBlock myStyleMain={{maxWidth: '25%'}}>
                    <BlockInput
                        onChange={() => {}}
                        fieldName={'created_by_name'}
                        title={'Создал'}
                        type={fieldParams?.['created_by_name']?.type as IInputTypes}
                        value={changelogData?.create?.username || ''}
                        skeletonLoading={loadingProcess?.['created_by_name']}
                        isReadOnly={true}
                        placeholder=""
                    />
                    <BlockInput
                        onChange={() => {}}
                        fieldName={'modified_by_name'}
                        title={'Изменил'}
                        type={fieldParams?.['modified_by_name']?.type as IInputTypes}
                        value={changelogData?.update?.username || ''}
                        skeletonLoading={loadingProcess?.['modified_by_name']}
                        isReadOnly={true}
                        placeholder=""
                    />
                </ContentBlock>
                <ContentBlock myStyleMain={{maxWidth: '20%'}}>
                    <BlockInput
                        onChange={() => {}}
                        fieldName={'created_date'}
                        title={'Дата создания'}
                        type={fieldParams?.['created_date']?.type as IInputTypes}
                        value={changelogData?.create?.timestamp || ''}
                        skeletonLoading={loadingProcess?.['created_date']}
                        isReadOnly={true}
                        placeholder=""
                    />
                    <BlockInput
                        onChange={() => {}}
                        fieldName={'modified_date'}
                        title={'Дата изменения'}
                        type={fieldParams?.['modified_date']?.type as IInputTypes}
                        value={changelogData?.update?.timestamp || ''}
                        skeletonLoading={loadingProcess?.['modified_date']}
                        isReadOnly={true}
                        placeholder=""
                    />
                </ContentBlock>
                <ContentBlock myStyleMain={{marginLeft: '40px'}}>
                    <BlockTextarea
                        onChange={(obj) => setValues(obj)}
                        fieldName={'other'}
                        title={'Комментарий'}
                        type={fieldParams?.['other']?.type as ITextareaTypes}
                        value={componentData?.objInputAndChangedData['other'] as ITextareaValue}
                        placeholder={'Введите комментарий'}
                        skeletonLoading={loadingProcess?.['other']}
                        isRequired={fieldParams?.['other']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['other']}
                        isChanged={!!componentData?.objChangedData?.['other']}
                        rows={6}
                    />
                </ContentBlock>
            </ContentBlock>
        </>)}
    </>)
}


export default KeyExchangeProjectMainData