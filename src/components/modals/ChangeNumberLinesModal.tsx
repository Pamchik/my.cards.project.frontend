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
import { setChangedData, setInputData } from "../../store/componentsData/componentsDataSlice";
import ProcessFilesMatchingToLinesTable from "../tables/ProcessFilesMatchingToLinesTable";


const ChangeNumberLinesModal = () => {

    const componentName = 'ChangeNumberLinesModal'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const { modalsPropsData, loadingProcess, fieldParams, componentData, componentReadOnly, componentInvalidFields, savingProcess, componentsAPIUpdate } = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValuesAddNewFileModal = useFieldValueChange('AddNewFileModal')    
    const dispatch = useDispatch()

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    const initFieldParams: IFieldParams = {
        'arrOrders': {isRequired: false, type: 'array'},
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

    const [arrNumbersID, setArrNumbersID] = useState<number[]>(modalsPropsData?.other?.['additionalNumbers'] as number[] || []);
    
    useEffect(() => {
        if (isComponentPrepared) {
            setManagedTimeout(() => {
                dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['arrOrders']}}));
            }, 1000);
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

    const [selectedNumberLines, setSelectedNumberLines] = useState<number[] | undefined>(undefined)

    function funcCallBankItemsSelected (arr: number[]) {
        setSelectedNumberLines(arr)
    }

    return (<>
        {isComponentPrepared && (<>
            <ModalViewBase
                myStyleContext={{ }} 
                onClick={() => {
                    dispatch(setModalClose(componentName))
                    dispatch(deleteModalProps({componentName}))
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
                    <MainModalText modalTitle={'Добавление линий для сохранения'}/>
                    <MainModalBtnBlock myStyleBtnBlock={{width: '120px'}}>
                        {
                            selectedNumberLines &&
                            <ButtonMain
                                onClick={() => {
                                    setValuesAddNewFileModal({name: 'numbers', value: selectedNumberLines || []})
                                    dispatch(setModalClose(componentName))
                                    dispatch(deleteModalProps({componentName}))
                                    allComponentParamsReset()
                                }}
                                type="submit"
                                title="Далее"
                                myStyle={{width: '100px'}}
                            />
                        }
                        <ButtonMain 
                            onClick={() => {
                                dispatch(setModalClose(componentName))
                                dispatch(deleteModalProps({componentName}))
                                allComponentParamsReset()
                            }}
                            type="resetIcon" 
                        />
                    </MainModalBtnBlock>
                </MainModalTopBlock>

                <MainModalMainBlock myStyleMainBlock={{ display: 'flex', height: '730px'}}>
                    <ContentBlock myStyleMain={{padding: '0', width: '800px'}} myStyleContent={{display: 'block', height: '100%'}}>
                        <ProcessFilesMatchingToLinesTable
                            arrOrders={modalsPropsData?.other?.['arrOrders'] || []}
                            onItemsSelected={funcCallBankItemsSelected}
                            additionalNumbers={arrNumbersID || []}
                            isLoading={loadingProcess?.['arrOrders']}
                        />
                    </ContentBlock>  
                </MainModalMainBlock>
            </ModalViewBase>
        </>)}
    </>)
}

export default ChangeNumberLinesModal