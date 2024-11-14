import { useEffect, useState } from "react";
import { useEffectStoreData } from "../hooks/useEffectStoreData";
import { useComponentPreparation } from "../hooks/useComponentPreparation";
import { useAllComponentParamsReset } from "../hooks/useComponentDataReset";
import useTimeoutManager from "../hooks/useTimeoutManager";
import { useDispatch } from "react-redux";
import { IFieldParams, IInputTypes } from "../../store/componentsData/fieldsParamsSlice";
import { setLoadingStatus } from "../../store/componentsData/loadingProcessSlice";
import { MainModalBtnBlock, MainModalMainBlock, MainModalText, MainModalTopBlock, ModalViewBase } from "./ModalViewBase";
import { setModalClose } from "../../store/modalData/modalsSlice";
import { deleteModalProps } from "../../store/modalData/modalsPropsDataSlice";
import LoadingView from "../loading/LoadingView";
import ButtonMain from "../UI/buttons/ButtonMain";
import ContentBlock from "../blocks/ContentBlock";
import BlockInput from "../UI/fields/BlockInput";
import { IInputValue, setInputData } from "../../store/componentsData/componentsDataSlice";
import { useNavigate } from "react-router-dom";
import PictureBlock from "../blocks/PictureBlock";
import { useGetProcessNamesQuery } from "../../store/api/processNamesApiSlice";
import ElementSpoiler from "../UI/spoilers/ElementSpoiler";
import { processDataApi, useGetProcessesDataQuery } from "../../store/api/processDataApiSlice";
import { useGetProcessStatusesQuery } from "../../store/api/processStatusApiSlice";
import { funcFindNameByID } from "../functions/funcFindNameByID";
import { fileApi, useGetFilesTableQuery } from "../../store/api/fileApiSlice";
import PreviewProcessTable from "../tables/PreviewProcessTable";


const LinePreviewModal = () => {

    const componentName = 'LinePreviewModal'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const {modalsPropsData, loadingProcess, fieldParams, componentData, componentInvalidFields, savingProcess, componentsAPIUpdate} = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const dispatch = useDispatch()

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    const {data: processNamesData, isFetching: isFetchingProcessNamesData, error: errorProcessNamesData, refetch: refetchProcessNamesData} = useGetProcessNamesQuery(undefined)
    const {data: processStatusesData, isFetching: isFetchingProcessStatusesData, error: errorProcessStatusesData, refetch: refetchProcessStatusesData} = useGetProcessStatusesQuery(undefined)
    const { data: processData, isFetching: isFetchingProcessData, error: errorProcessData, refetch: refetchProcessData } = useGetProcessesDataQuery(
        { line_number: componentData?.objInputAndChangedData['id'] as number },
        {
            skip: !componentData?.objInputAndChangedData['id'],
            selectFromResult: ({ data, ...other }) => ({
                data: componentData?.objInputAndChangedData['id'] ? data : [],
                ...other
            })
        }
    )
    const { data: filesTableData, isFetching: isFetchingFilesTableData, error: errorFilesTableData, refetch: refetchFilesTableData } = useGetFilesTableQuery(
        { model_type: 'ProjectLine', number: componentData?.objInputAndChangedData['id'] as number, active: 'True', deleted: 'False' },
        { 
            skip: !componentData?.objInputAndChangedData['id'],
            selectFromResult: ({ data, ...other }) => ({
                data: componentData?.objInputAndChangedData['id'] ? data : [],
                ...other
            })  
        }
    );

    const initFieldParams: IFieldParams = {
        'preview_image': {isRequired: false, type: 'text'},
        'number': {isRequired: false, type: 'text'},
        'product_qty_from_bank': {isRequired: false, type: 'text'},
        'vendor': {isRequired: false, type: 'text'},
        'bank': {isRequired: false, type: 'text'},
        'product_full_name': {isRequired: false, type: 'text'},
        'product_number': {isRequired: false, type: 'text'},
        'chip_full_name': {isRequired: false, type: 'text'},
        'arrProcessList': {isRequired: false, type: 'array'},
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        // setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: Object.keys(initFieldParams)}}))
        if (isComponentPrepared) {
            setManagedTimeout(() => {
                dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: [
                    'preview_image',
                    'number',
                    'product_qty_from_bank',
                    'vendor',
                    'bank',
                    'product_full_name',
                    'product_number',
                    'chip_full_name',
                ]}}))
            }, 500) 
        }
    }, [isComponentPrepared]);

    useEffect(() => {
        if (isComponentPrepared) {
            if (!isFetchingProcessNamesData && !isFetchingProcessData && !isFetchingProcessStatusesData && !isFetchingFilesTableData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['arrProcessList']}}))
                }, 500)
            } else {
                dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['arrProcessList']}}))
            }
        }
    }, [isFetchingProcessNamesData, isFetchingProcessData, isFetchingProcessStatusesData, isFetchingFilesTableData, isComponentPrepared]);

    useEffect(() => {
        if (modalsPropsData?.objInputData) {
            dispatch(setInputData({componentName, data: modalsPropsData.objInputData}))
            setIsComponentPrepared(true);
        }
    }, [isComponentPrepared]);
    
    // Открытие следующей страницы по кнопке "Детальнее"
    const navigate = useNavigate();
    const funcHandleDetail = () => {
        if (modalsPropsData?.objInputData?.id) {
            dispatch(setModalClose(componentName))
            dispatch(deleteModalProps({componentName}))
            navigate(`projects/${modalsPropsData.objInputData.id}/`);
        }
    };


    function funcStatusDataReturn (id: number | null) {
        if (id) {
            const matchStatus: Record<string, string> = {
                'Not-started': 'transparent',
                'In-progress': '#f7bb4b',
                'Completed': '#37b700',
            }

            const infoWindowTitle = funcFindNameByID(processStatusesData || [], processData?.find(step => step.process_step === id)?.step_status, 'name_rus') || 'Не начато'
            const infoWindowColor = matchStatus[funcFindNameByID(processStatusesData || [], processData?.find(step => step.process_step === id)?.step_status, 'name_eng') || 'Not-started']
        
            return {statusRusName: infoWindowTitle, statusColorField: infoWindowColor}
        }
        return {statusRusName: '', statusColorField: ''}
    }

    let itemsList;
    if (loadingProcess?.['arrProcessList'].status) {
        itemsList = (
            <div style={{position: 'relative', height: '100px'}}>
                <LoadingView myStyleContainer={{backgroundColor: 'rgba(255, 255, 255, 0)'}}/>                            
            </div>            
        )
    } else {
        if (errorProcessNamesData || errorProcessData || errorProcessStatusesData || errorFilesTableData) {
            itemsList = (
                <div style={{marginTop: '20px', marginLeft: '10px', marginBottom: '10px'}}>
                    Ошибка загрузки данных...
                </div>
            )
        } else {
            itemsList = (
                <>{processNamesData && processNamesData.map(item => (
                    <ElementSpoiler 
                        key={item.id}
                        spoilerTitle={item.component_name || ''}
                        infoWindowTitle={funcStatusDataReturn(item.id).statusRusName}
                        infoWindowColor={funcStatusDataReturn(item.id).statusColorField}
                    >
                        <div style={{display: 'block', height: '200px', position: 'relative'}}>
                            <PreviewProcessTable
                                arrData={filesTableData?.filter(step => step.process_step === item.component_name) || []}
                            />     
                        </div>
                    </ElementSpoiler> 
                ))}</>
            )
        }
    }


    return (<>
        {isComponentPrepared && (<>
            <ModalViewBase
                myStyleContext={{ }} 
                onClick={() => {
                    dispatch(setModalClose(componentName))
                    dispatch(deleteModalProps({componentName}))
                    dispatch(processDataApi.util.resetApiState())
                    dispatch(fileApi.util.resetApiState())
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
                    <MainModalText modalTitle={'Предварительный просмотр'}/>
                    <MainModalBtnBlock myStyleBtnBlock={{width: '120px'}}>
                        <ButtonMain
                            onClick={funcHandleDetail}
                            type="other"
                            color="gray"
                            title="Далее"
                        />
                        <ButtonMain
                            onClick={() => {
                                dispatch(setModalClose(componentName))
                                dispatch(deleteModalProps({componentName}))
                                dispatch(processDataApi.util.resetApiState())
                                dispatch(fileApi.util.resetApiState())
                                allComponentParamsReset()
                            }}
                            type="resetIcon" 
                        />
                    </MainModalBtnBlock>
                </MainModalTopBlock>

                <MainModalMainBlock myStyleMainBlock={{height: '800px', width: '1200px'}} >
                    <ContentBlock myStyleContent={{display: 'flex', flexDirection: 'column', height: '790px'}}>
                        <ContentBlock myStyleMain={{maxHeight: '200px'}} myStyleContent={{display: 'flex', flexDirection: 'row'}}>
                            <ContentBlock line={true} myStyleContent={{width: 'auto'}}>
                                <PictureBlock
                                    previewImage={componentData?.objInputAndChangedData['preview_image'] as string || ''}
                                    skeletonLoading={loadingProcess?.['preview_image']}
                                />
                            </ContentBlock>
                            <ContentBlock line={true}>
                                <BlockInput
                                    onChange={() => {}}
                                    fieldName={'number'}
                                    title={'Номер заказа'}
                                    type={fieldParams?.['number']?.type as IInputTypes}
                                    value={componentData?.objInputAndChangedData['number'] as IInputValue}
                                    placeholder={''}
                                    skeletonLoading={loadingProcess?.['number']}
                                    isRequired={false}
                                    isReadOnly={true}
                                />
                                <BlockInput
                                    onChange={() => {}}
                                    fieldName={'product_qty_from_bank'}
                                    title={'Количество в заказе'}
                                    type={fieldParams?.['product_qty_from_bank']?.type as IInputTypes}
                                    value={componentData?.objInputAndChangedData['product_qty_from_bank'] as IInputValue}
                                    placeholder={''}
                                    skeletonLoading={loadingProcess?.['product_qty_from_bank']}
                                    isRequired={false}
                                    isReadOnly={true}
                                />
                                <BlockInput
                                    onChange={() => {}}
                                    fieldName={'vendor'}
                                    title={'Вендор'}
                                    type={fieldParams?.['vendor']?.type as IInputTypes}
                                    value={componentData?.objInputAndChangedData['vendor'] as IInputValue}
                                    placeholder={''}
                                    skeletonLoading={loadingProcess?.['vendor']}
                                    isRequired={false}
                                    isReadOnly={true}
                                />
                            </ContentBlock>
                            <ContentBlock line={true}>
                                <BlockInput
                                    onChange={() => {}}
                                    fieldName={'bank'}
                                    title={'Банк'}
                                    type={fieldParams?.['bank']?.type as IInputTypes}
                                    value={componentData?.objInputAndChangedData['bank'] as IInputValue}
                                    placeholder={''}
                                    skeletonLoading={loadingProcess?.['bank']}
                                    isRequired={false}
                                    isReadOnly={true}
                                />
                                <BlockInput
                                    onChange={() => {}}
                                    fieldName={'product_full_name'}
                                    title={'Название продукта'}
                                    type={fieldParams?.['product_full_name']?.type as IInputTypes}
                                    value={componentData?.objInputAndChangedData['product_full_name'] as IInputValue}
                                    placeholder={''}
                                    skeletonLoading={loadingProcess?.['product_full_name']}
                                    isRequired={false}
                                    isReadOnly={true}
                                />
                                <BlockInput
                                    onChange={() => {}}
                                    fieldName={'product_number'}
                                    title={'Номер продукта'}
                                    type={fieldParams?.['product_number']?.type as IInputTypes}
                                    value={(
                                        !componentData?.objInputAndChangedData['product_code'] ?
                                        '' :
                                        (
                                            (componentData?.objInputAndChangedData['product_code'] || '') as string + ' ' +
                                            (componentData?.objInputAndChangedData['product_revision'] || '') as string
                                        )

                                        ) as IInputValue}
                                    placeholder={''}
                                    skeletonLoading={loadingProcess?.['product_number']}
                                    isRequired={false}
                                    isReadOnly={true}
                                />
                            </ContentBlock>
                            <ContentBlock>
                                <BlockInput
                                    onChange={() => {}}
                                    fieldName={'chip_full_name'}
                                    title={'Номер чипа'}
                                    type={fieldParams?.['chip_full_name']?.type as IInputTypes}
                                    value={componentData?.objInputAndChangedData['chip_full_name'] as IInputValue}
                                    placeholder={''}
                                    skeletonLoading={loadingProcess?.['chip_full_name']}
                                    isRequired={false}
                                    isReadOnly={true}
                                />
                            </ContentBlock>
                        </ContentBlock>
                        <ContentBlock myStyleMain={{overflowY: 'auto', borderTop: '1px solid #bebebe', padding: '0', height: '100%'}} myStyleContent={{display: 'flex', flexDirection: 'column'}}>
                            {itemsList}
                        </ContentBlock>
                    </ContentBlock>
                </MainModalMainBlock>
            </ModalViewBase>
        </>)}
    </>)
}

export default LinePreviewModal