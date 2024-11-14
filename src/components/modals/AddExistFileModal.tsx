import { useEffect, useState } from "react";
import { useEffectStoreData } from "../hooks/useEffectStoreData";
import { useComponentPreparation } from "../hooks/useComponentPreparation";
import { useFieldValueChange } from "../hooks/useFieldValueChange";
import { useDispatch } from "react-redux";
import { IFieldParams } from "../../store/componentsData/fieldsParamsSlice";
import { setLoadingStatus } from "../../store/componentsData/loadingProcessSlice";
import { MainModalBtnBlock, MainModalMainBlock, MainModalText, MainModalTopBlock, ModalViewBase } from "./ModalViewBase";
import { setModalClose } from "../../store/modalData/modalsSlice";
import { deleteModalProps } from "../../store/modalData/modalsPropsDataSlice";
import LoadingView from "../loading/LoadingView";
import ButtonMain from "../UI/buttons/ButtonMain";
import { useAllComponentParamsReset } from "../hooks/useComponentDataReset";
import ContentBlock from "../blocks/ContentBlock";
import useTimeoutManager from "../hooks/useTimeoutManager";
import { deleteAllComponentData, setChangedData, setInputData } from "../../store/componentsData/componentsDataSlice";
import { foldersApi, useGetFoldersPathQuery } from "../../store/api/foldersApiSlice";
import FoldersTable from "../tables/FoldersTable";
import { setSavingStatus } from "../../store/componentsData/savingProcessSlice";
import { deleteFieldInvalid } from "../../store/componentsData/fieldsInvalidSlice";
import { useAddExistFileMutation } from "../../store/api/fileApiSlice";
import { functionErrorMessage } from "../functions/functionErrorMessage";


const AddExistFileModal = () => {

    const componentName = 'AddExistFileModal'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const { modalsPropsData, loadingProcess, fieldParams, componentData, componentReadOnly, componentInvalidFields, savingProcess, componentsAPIUpdate } = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const { data: foldersData, isFetching: isFetchingFoldersData, error: errorFoldersData, refetch: refetchFoldersData } = useGetFoldersPathQuery(undefined)

    const [addExistFile, {}] = useAddExistFileMutation()

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    const initFieldParams: IFieldParams = {
        'arrFiles': {isRequired: false, type: 'array'},
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['arrFolders']}}))
        if (isComponentPrepared) {
            if (!isFetchingFoldersData) {
                if (!errorFoldersData && foldersData) {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['arrFolders']}}))
                    }, 1000)  
                } else {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['arrFolders']}}))
                    }, 1000)
                }
            }
        }
    }, [isComponentPrepared, foldersData, isFetchingFoldersData]);

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
        dispatch(deleteFieldInvalid({componentName}))
        const myData = componentData.objChangedData
        await addExistFile(myData).unwrap()    
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
    }

    return (<>
        {isComponentPrepared && (<>
            <ModalViewBase
                myStyleContext={{ }} 
                onClick={() => {
                    dispatch(setModalClose(componentName))
                    dispatch(deleteModalProps({componentName}))
                    dispatch(foldersApi.util.resetApiState())
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
                    <MainModalText modalTitle={'Добавление файла из списка'}/>
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
                                dispatch(foldersApi.util.resetApiState())
                                allComponentParamsReset()
                            }}
                            type="resetIcon" 
                        />
                    </MainModalBtnBlock>
                </MainModalTopBlock>

                <MainModalMainBlock myStyleMainBlock={{ display: 'flex', minHeight: '730px'}}>
                    <ContentBlock myStyleMain={{padding: '0', width: '800px'}} myStyleContent={{display: 'block', height: '600px'}}>
                        <FoldersTable
                            arrFolders={ foldersData|| []}
                            isLoading={loadingProcess?.['arrFolders']}
                            action={modalsPropsData?.other?.['action']}
                        />     
                    </ContentBlock>  
                </MainModalMainBlock>
            </ModalViewBase>
        </>)}
    </>)
}

export default AddExistFileModal