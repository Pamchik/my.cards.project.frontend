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
import { foldersApi, useGetFoldersPathQuery } from "../../store/api/foldersApiSlice";
import { setChangedData, setInputData } from "../../store/componentsData/componentsDataSlice";
import FoldersTable from "../tables/FoldersTable";


const ChangeFolderModal = () => {

    const componentName = 'ChangeFolderModal'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const { modalsPropsData, loadingProcess, fieldParams, componentData, componentReadOnly, componentInvalidFields, savingProcess, componentsAPIUpdate } = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const { data: foldersData, isFetching: isFetchingFoldersData, error: errorFoldersData, refetch: refetchFoldersData } = useGetFoldersPathQuery(undefined)
    
    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    const initFieldParams: IFieldParams = {
        'arrFolders': {isRequired: false, type: 'array'},
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

    function funcFolderSelect () {
        dispatch(setModalClose(componentName))
        dispatch(deleteModalProps({componentName}))
        dispatch(foldersApi.util.resetApiState())
        allComponentParamsReset()
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
                    <MainModalText modalTitle={'Изменение папки для сохранения'}/>
                    <MainModalBtnBlock myStyleBtnBlock={{width: '120px'}}>
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

                <MainModalMainBlock myStyleMainBlock={{ display: 'flex', height: '730px'}}>
                    <ContentBlock myStyleMain={{padding: '0', width: '800px'}} myStyleContent={{display: 'block', height: '600px'}}>
                        <FoldersTable
                            arrFolders={foldersData || []}
                            onItemSelected={funcFolderSelect}
                            isLoading={loadingProcess?.['arrFolders']}
                            action={modalsPropsData?.other?.['action']}
                            folder_name={modalsPropsData?.other?.['folder_name']}
                        />          
                    </ContentBlock>  
                </MainModalMainBlock>
            </ModalViewBase>
        </>)}
    </>)
}

export default ChangeFolderModal