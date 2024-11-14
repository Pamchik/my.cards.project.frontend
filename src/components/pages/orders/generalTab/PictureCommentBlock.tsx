import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useComponentPreparation } from "../../../hooks/useComponentPreparation";
import { useAllComponentParamsReset } from "../../../hooks/useComponentDataReset";
import { useEffectStoreData } from "../../../hooks/useEffectStoreData";
import useTimeoutManager from "../../../hooks/useTimeoutManager";
import { useFieldValueChange } from "../../../hooks/useFieldValueChange";
import { useGetProjectQuery } from "../../../../store/api/projectsApiSlice";
import { IFieldParams, IInputTypes, ITextareaTypes } from "../../../../store/componentsData/fieldsParamsSlice";
import { deleteComponentsAPIUpdate } from "../../../../store/componentsData/componentsAPIUpdateSlice";
import { setLoadingStatus } from "../../../../store/componentsData/loadingProcessSlice";
import { funcConvertToFieldDataType } from "../../../functions/funcConvertToFieldDataType";
import { deleteChangedComponentData, IInputValue, ITextareaValue, setInputData } from "../../../../store/componentsData/componentsDataSlice";
import { deleteFieldInvalid } from "../../../../store/componentsData/fieldsInvalidSlice";
import { changeComponentReadOnly } from "../../../../store/componentsData/componentsReadOnlySlice";
import LoadingView from "../../../loading/LoadingView";
import ContentBlock from "../../../blocks/ContentBlock";
import BlockInput from "../../../UI/fields/BlockInput";
import BlockTextarea from "../../../UI/fields/BlockTextarea";
import MainInfoBlock from "../../../blocks/MainInfoBlock";
import PictureUploadBlock from "../../../blocks/PictureUploadBlock";
import { useGetChangelogQuery } from "../../../../store/api/changelogApiSlice";


interface IPictureCommentBlock {
    selectedID: number,
    funcSetImage: (file: File | null) => void
}

const PictureCommentBlock = ({
    selectedID,
    funcSetImage
}: IPictureCommentBlock) => {

    const componentName = 'PictureCommentBlock'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const { loadingProcess, fieldParams, componentData,  componentReadOnly, componentInvalidFields, savingProcess, componentsAPIUpdate } = useEffectStoreData(componentName)
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: projectData, isFetching: isFetchingProjectData, error: errorProjectData, refetch: refetchProjectData} = useGetProjectQuery({id: selectedID});
    const {data: changelogData, isFetching: isFetchingChangelogData, error: errorChangelogData, refetch: refetchChangelogData} = useGetChangelogQuery({
        model_name: 'ProjectLine',
        id: selectedID
    });

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);
    
    useEffect(() => {
        if (componentsAPIUpdate.includes('projectData')) {
            updateAPIData('projectData', refetchProjectData)
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
        'preview_image': {isRequired: false, type: 'text'},
        'created_by_name': {isRequired: false, type: 'text'},
        'modified_by_name': {isRequired: false, type: 'text'},
        'created_date': {isRequired: false, type: 'text'},
        'modified_date': {isRequired: false, type: 'text'},
        'display_year': {isRequired: true, type: 'number', valueMinMax: {min: 2000, max: 3000}},
        'general_comment': {isRequired: false, type: 'text'},
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['preview_image', 'display_year', 'general_comment']}}))
        if (isComponentPrepared) {
            if (!isFetchingProjectData) {
                if (!errorProjectData && projectData) {
                    const myData = funcConvertToFieldDataType(projectData[0])
                    dispatch(setInputData({componentName, data: myData}))
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['preview_image', 'display_year', 'general_comment']}}))
                    }, 1000)  
                } else {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['preview_image', 'display_year', 'general_comment']}}))
                    }, 1000)
                }
            }
        }
    }, [selectedID, isComponentPrepared, projectData, isFetchingProjectData]); 

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
        if (isFetchingProjectData) {
            funcChangeCancelSet(true)
        }
    }, [isFetchingProjectData]);

    // Коллбек из компонента загрузки превью
        const funcCallBackNewPreview = (file: File | null) => {
            funcSetImage(file)
        }

    function funcChangeCancelSet(newStatus: boolean) {
        dispatch(deleteChangedComponentData({componentName}))
        dispatch(changeComponentReadOnly({componentName, newStatus}))
        dispatch(deleteFieldInvalid({componentName}))        
        funcSetImage(null)
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
            <MainInfoBlock myStyleMain={{}} myStyleContext={{flexDirection: 'row'}}>
                <ContentBlock myStyleContent={{maxWidth: '300px', maxHeight: '200px', overflowY: 'hidden', flex: '0'}}>
                    <PictureUploadBlock
                        onChange={funcCallBackNewPreview}
                        isReadOnly={componentReadOnly?.status} 
                        value={componentData?.objInputAndChangedData['preview_image'] as string}
                        skeletonLoading={loadingProcess?.['preview_image']}
                    />
                </ContentBlock>
                <ContentBlock myStyleMain={{marginLeft: '20px', minWidth: 'calc(100% - 320px)', flex: '0'}} myStyleContent={{flexDirection: 'row', display: 'flex'}}>
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
                        <BlockInput
                            onChange={(obj) => setValues(obj)}
                            fieldName={'display_year'}
                            title={'Отобразить за год'}
                            type={fieldParams?.['display_year']?.type as IInputTypes}
                            value={componentData?.objInputAndChangedData['display_year'] as IInputValue}
                            placeholder={'Введите год'}
                            skeletonLoading={loadingProcess?.['display_year']}
                            isRequired={fieldParams?.['display_year']?.isRequired}
                            isReadOnly={componentReadOnly?.status}
                            isInvalidStatus={componentInvalidFields?.['display_year']}
                            isChanged={!!componentData?.objChangedData?.['display_year']}
                            maxValue={3000}
                            minValue={2000}
                            isBlockChangeFormat={true}
                        />
                    </ContentBlock>
                    <ContentBlock myStyleMain={{marginLeft: '40px'}}>
                        <BlockTextarea
                            onChange={(obj) => setValues(obj)}
                            fieldName={'general_comment'}
                            title={'Комментарий'}
                            type={fieldParams?.['general_comment']?.type as ITextareaTypes}
                            value={componentData?.objInputAndChangedData['general_comment'] as ITextareaValue}
                            placeholder={'Введите комментарий'}
                            skeletonLoading={loadingProcess?.['general_comment']}
                            isRequired={fieldParams?.['general_comment']?.isRequired}
                            isReadOnly={componentReadOnly?.status}
                            isInvalidStatus={componentInvalidFields?.['general_comment']}
                            isChanged={!!componentData?.objChangedData?.['general_comment']}
                            rows={6}
                        />
                    </ContentBlock>
                </ContentBlock>
            </MainInfoBlock>  
        </>)}
    </>)
}


export default PictureCommentBlock