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
import { IFieldParams, IInputTypes } from "../../store/componentsData/fieldsParamsSlice";
import { IInputValue, ISelectValue, ITextareaValue, deleteAllComponentData, setChangedData, setInputData } from "../../store/componentsData/componentsDataSlice";
import { setLoadingStatus } from "../../store/componentsData/loadingProcessSlice";
import { deleteModalProps, setModalProps } from "../../store/modalData/modalsPropsDataSlice";
import { setSavingStatus } from "../../store/componentsData/savingProcessSlice";
import { funcValidateFields } from "../functions/funcValidateFields";
import { deleteFieldInvalid, setFieldInvalid } from "../../store/componentsData/fieldsInvalidSlice";
import { functionErrorMessage } from "../functions/functionErrorMessage";
import LoadingView from "../loading/LoadingView";
import BlockSelect from "../UI/fields/BlockSelect";
import { useAllComponentParamsReset } from "../hooks/useComponentDataReset";
import BlockRadioBox from "../UI/fields/BlockRadioBox";
import { IFileStatus } from "../../store/api/fileStatusApiSlice";
import { useUpdateFileMutation } from "../../store/api/fileApiSlice";
import useTimeoutManager from "../hooks/useTimeoutManager";
import BlockTextarea from "../UI/fields/BlockTextarea";
import { useUpdateGalleryMutation } from "../../store/api/galleryApiSlice";


const ChangeFileDataModal = () => {

    const componentName = 'ChangeFileDataModal'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const {modalsPropsData, loadingProcess, fieldParams, componentData, componentInvalidFields, savingProcess, componentsAPIUpdate} = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const [updateFile, {}] = useUpdateFileMutation()
    const [updateGallery, {}] = useUpdateGalleryMutation()

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    useEffect(() => {
    }, [componentsAPIUpdate]);

    const [initFieldParams, setInitFieldParams] = useState<IFieldParams>({})
    const [isFieldParamsSet, setIsFieldParamsSet] = useState<boolean>(false)
    
    useEffect(() => {
        if (componentData?.objChangedData?.action === 'change-name') {
            setInitFieldParams({'name': {isRequired: true, type: 'folder'}})
            setIsFieldParamsSet(true)
        } else if (componentData?.objChangedData?.action === 'change-status') {
            setInitFieldParams({'status': {isRequired: true, type: 'number'}})
            setIsFieldParamsSet(true)
        } else if (componentData?.objChangedData?.action === 'change-comment') {
            setInitFieldParams({'other': {isRequired: false, type: 'text'}})
            setIsFieldParamsSet(true)
        } else if (componentData?.objChangedData?.action === 'change-folder') {
            setInitFieldParams({'folder_name': {isRequired: true, type: 'text'}})
            setIsFieldParamsSet(true)
        } else if (componentData?.objChangedData?.action === 'change-receiver') {
            setInitFieldParams({'received_from': {isRequired: true, type: 'text'}})
            setIsFieldParamsSet(true)
        } else if (componentData?.objChangedData?.action === 'to-archive') {
            setIsFieldParamsSet(true)
        } else if (componentData?.objChangedData?.action === 'from-archive') {
            setIsFieldParamsSet(true)
        } else if (componentData?.objChangedData?.action === 'delete-file') {
            setIsFieldParamsSet(true)
        } else {
        }    
    }, [componentData?.objChangedData?.action]);


    useEffect(() => {
        if (isFieldParamsSet) {
            componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
            setIsComponentPrepared(true);            
        }
    }, [isFieldParamsSet]);

    useEffect(() => {
        if (isFieldParamsSet) {
            dispatch(setLoadingStatus({componentName, data: {status: true, fields: Object.keys(initFieldParams)}}))
            if (isComponentPrepared) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: Object.keys(initFieldParams)}}))
                }, 1000) 
            }
        }
    }, [isComponentPrepared, isFieldParamsSet]);

    useEffect(() => {
        if (modalsPropsData?.objInputData && modalsPropsData?.objChangedData && Object.keys(modalsPropsData.objChangedData).length > 0) {
            dispatch(setInputData({componentName, data: modalsPropsData.objInputData}))

            Object.keys(modalsPropsData.objChangedData).forEach(item => {
                setValues({name: item, value: modalsPropsData.objChangedData?.[item] || null})
            })
        } else if (modalsPropsData?.objInputData) {
            dispatch(setInputData({componentName, data: modalsPropsData.objInputData}))
        } else if (modalsPropsData?.objChangedData) {
            dispatch(setChangedData({componentName, data: modalsPropsData.objChangedData}))
        }
    }, [isComponentPrepared]);
    
    async function funcSaveFields () {
        dispatch(setSavingStatus({componentName, data: {status: true}}))
        const isValid = funcValidateFields(fieldParams, componentData?.objInputAndChangedData, componentData?.objChangedData)

        if (isValid.isAllFieldsValid) {
            dispatch(deleteFieldInvalid({componentName}))
            const myData = componentData.objChangedData
            await (modalsPropsData?.other?.['file_type'] === "gallery" 
                ? updateGallery({...myData}) 
                : updateFile({...myData})
            ).unwrap()
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

    // Список доступных статусов
        const [availableFilesStatuses, setAvailableFilesStatuses] = useState<IFileStatus[]>([])
        useEffect(() => {
            const currentStatusNumber: number | null =  componentData?.objInputData?.['status'] as number | null
            const arrStatuses: IFileStatus[] = (modalsPropsData?.other?.['arrfileStatuses'] as IFileStatus[] || undefined) || []
            if (currentStatusNumber) {
                if (modalsPropsData?.other?.['isLimitUpItems']) {
                    setAvailableFilesStatuses(arrStatuses.filter(item => item.id as number >= currentStatusNumber))
                } else {
                    setAvailableFilesStatuses(arrStatuses)
                }
            } else {
                setAvailableFilesStatuses(arrStatuses)
            }
            
        }, [modalsPropsData?.other?.['arrfileStatuses'], componentData?.objInputData?.['status']]);

    // Список значений для выбора по полю "От кого"
        const arrReceivedFrom = [
            {id: 1, name: 'Клиент'},
            {id: 2, name: 'Вендор'},
            {id: 3, name: 'IBS Project'},
            {id: 4, name: 'Другое'}
        ]
    
    // Функция получения значения по полю "Получено от"
        const [selectedRadioItem, setSelectedRadioItem] = useState<Record<string, string>>({})
        function handleChoseItem (fieldName: string, e: React.ChangeEvent<HTMLInputElement>) {
            setValues({name: fieldName, value: arrReceivedFrom.find(item => item.id === +e.target.value)?.name || ''})
            setSelectedRadioItem({[fieldName]: arrReceivedFrom.find(item => item.id === +e.target.value)?.name || ''})
        }
        useEffect(() => {
            if (modalsPropsData.objInputData?.['received_from'] && 
                modalsPropsData.objInputData?.['received_from'] !== arrReceivedFrom[0].name &&
                modalsPropsData.objInputData?.['received_from'] !== arrReceivedFrom[1].name &&
                modalsPropsData.objInputData?.['received_from'] !== arrReceivedFrom[2].name
            ) {
                setSelectedRadioItem({['received_from']: 'Другое'})
            } else if (modalsPropsData.objInputData?.['received_from'] && typeof modalsPropsData.objInputData?.['received_from'] === 'string') {
                setSelectedRadioItem({['received_from']: modalsPropsData.objInputData?.['received_from']})
            }

        }, [modalsPropsData.objInputData?.['received_from']]);


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
                    <div style={{width: '150px'}}></div>
                    <MainModalText modalTitle={'Изменение данных'}/>
                    <MainModalBtnBlock myStyleBtnBlock={{width: '150px'}}>
                        {
                            componentData?.objChangedData && Object.keys(componentData.objChangedData).length > (modalsPropsData?.qtyFieldsForSavingBtn || 0) && 
                            componentData?.objChangedData?.action !== 'to-archive' &&
                            componentData?.objChangedData?.action !== 'from-archive' &&
                            componentData?.objChangedData?.action !== 'delete-file' &&
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

                <MainModalMainBlock myStyleMainBlock={{width: '800px'}}>
                    <ContentBlock>
                        {
                            componentData?.objChangedData?.['action'] === 'change-name' && 
                            <BlockInput
                                onChange={(obj) => setValues(obj)}
                                fieldName={'name'}
                                title={'Название'}
                                type={fieldParams?.['name']?.type as IInputTypes}
                                value={componentData?.objInputAndChangedData['name'] as IInputValue}
                                placeholder={'Введите название файла'}
                                skeletonLoading={loadingProcess?.['name']}
                                isRequired={fieldParams?.['name']?.isRequired}
                                isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('name')}
                                isInvalidStatus={componentInvalidFields?.['name']}
                                isChanged={!!componentData?.objChangedData?.['name']}
                            />                           
                        }
                        {
                            componentData?.objChangedData?.['action'] === 'change-status' && 
                            <BlockSelect
                                fieldName={'status'}
                                showName={"name"}
                                title={'Статус'}
                                value={componentData?.objInputAndChangedData['status'] as ISelectValue}
                                options={availableFilesStatuses || []}
                                isEmptyOption={true}
                                isSortDisabled={true}
                                onChange={(obj) => setValues(obj)}   
                                skeletonLoading={loadingProcess?.['status']}
                                isRequired={fieldParams?.['status']?.isRequired}  
                                isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('status')}
                                isInvalidStatus={componentInvalidFields?.['status']}   
                                isChanged={!!componentData?.objChangedData?.['status']}  
                            />
                        }
                        {
                            componentData?.objChangedData?.['action'] === 'change-comment' && 
                            <BlockTextarea
                                fieldName={'other'}
                                title={'Комментарий'}
                                onChange={(obj) => setValues(obj)}
                                isRequired={fieldParams?.['other']?.isRequired}
                                isInvalidStatus={componentInvalidFields?.['other']}
                                isChanged={!!componentData?.objChangedData?.['other']}
                                isReadOnly={!!modalsPropsData?.objReadOnlyFields?.includes('name')}
                                value={componentData?.objInputAndChangedData['other'] as ITextareaValue}
                                skeletonLoading={loadingProcess?.['other']}
                                placeholder={'Введите комментарий'}
                            />  
                        }
                        {
                            componentData?.objChangedData?.['action'] === 'change-folder' && 
                            <div style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
                                <BlockInput
                                    title={'Расположение файла'}
                                    fieldName={'folder_name'}
                                    onChange={() => {}}
                                    isRequired={fieldParams?.['folder_name']?.isRequired}
                                    type={fieldParams?.['folder_name']?.type as IInputTypes}
                                    isInvalidStatus={componentInvalidFields?.['folder_name']}
                                    isChanged={!!componentData?.objChangedData?.['folder_name']}
                                    value={componentData?.objInputAndChangedData['folder_name'] as IInputValue}
                                    skeletonLoading={loadingProcess?.['folder_name']}
                                    placeholder={''}
                                    isReadOnly={true}
                                    myStyle={{width: 'calc(100% - 100px)'}}
                                />
                                <ButtonMain
                                    onClick={() => {
                                        dispatch(setModalProps({componentName: 'ChangeFolderModal', data: {
                                            other: {
                                                folder_name: componentData?.objInputAndChangedData['folder_name'],
                                                action: "ChangeFolder"
                                            }
                                        }}))
                                        dispatch(setModalOpen('ChangeFolderModal'))
                                    }}
                                    type="other" 
                                    title="Изменить" 
                                    myStyle={{height: '25px', width: '80px', marginTop: '24px'}}
                                />
                            </div>
                        }
                        {
                            componentData?.objChangedData?.['action'] === 'change-receiver' && 
                            <>
                                <div style={{fontSize: '11pt', fontWeight: 'bold', margin: '15px'}}>
                                От кого получено:   
                                </div>
                                <div style={{marginLeft: '25px', marginRight: '25px'}}>
                                    {arrReceivedFrom.map((item) => (
                                        <BlockRadioBox
                                            key={item.id} 
                                            fieldName={'received_from'}
                                            id={item.id}
                                            name={item.name}
                                            isReadOnly={false}
                                            onChange={handleChoseItem}
                                            defaultChecked={
                                                arrReceivedFrom.find(i => i.name === componentData?.objInputAndChangedData?.['received_from']) ?
                                                arrReceivedFrom.find(i => i.name === componentData?.objInputAndChangedData?.['received_from'])?.id === item.id :
                                                arrReceivedFrom.find(i => i.name === 'Другое')?.id === item.id
                                            }
                                        />
                                    ))}
                                    {(selectedRadioItem['received_from'] !== 'Клиент' && selectedRadioItem['received_from'] !== 'Вендор' && selectedRadioItem['received_from'] !== 'IBS Project') &&
                                        <BlockInput
                                            myStyle={{width: '50%'}}
                                            fieldName={'received_from'}
                                            onChange={(obj) => setValues(obj)}
                                            isRequired={fieldParams?.['received_from']?.isRequired}
                                            type={fieldParams?.['received_from']?.type as IInputTypes}
                                            isInvalidStatus={componentInvalidFields?.['received_from']}
                                            value={componentData?.objInputAndChangedData['received_from'] as IInputValue}
                                            skeletonLoading={loadingProcess?.['received_from']}
                                            placeholder={'Введите текст'}
                                        />
                                    }
                                </div>
                            </>
                        }
                        {
                            componentData?.objChangedData?.action === 'to-archive' && 
                            <>
                                <div style={{display: 'flex', flexDirection: 'column', marginTop: '80px'}}>
                                    <div style={{flex: '1', marginTop: '20px', textAlign: 'center', fontWeight: 'bold'}}>
                                        {modalsPropsData?.other?.['title']}   
                                    </div>
                                    <div style={{flex: '1', margin: '20px', textAlign: 'center', fontWeight: 'bold'}}>
                                        <ButtonMain
                                            onClick={funcSaveFields}
                                            type="other" 
                                            title="Да" 
                                            myStyle={{height: '25px', width: '80px', backgroundColor: '#0cd70c', border: '1 solid #0eb30e'}}
                                        />
                                        <ButtonMain
                                            onClick={() => {
                                                dispatch(setModalClose(componentName))
                                                dispatch(deleteModalProps({componentName}))
                                            }}
                                            type="other" 
                                            title="Нет" 
                                            myStyle={{height: '25px', width: '80px', backgroundColor: '#ff2828'}}
                                        />
                                    </div>
                                </div>
                            </>
                        }
                        {
                            componentData?.objChangedData?.action === 'from-archive' && 
                            <>
                                <div style={{display: 'flex', flexDirection: 'column', marginTop: '80px'}}>
                                    <div style={{flex: '1', marginTop: '20px', textAlign: 'center', fontWeight: 'bold'}}>
                                        {modalsPropsData?.other?.['title']}   
                                    </div>
                                    <div style={{flex: '1', margin: '20px', textAlign: 'center', fontWeight: 'bold'}}>
                                        <ButtonMain
                                            onClick={funcSaveFields}
                                            type="other" 
                                            title="Да" 
                                            myStyle={{height: '25px', width: '80px', backgroundColor: '#0cd70c', border: '1 solid #0eb30e'}}
                                        />
                                        <ButtonMain
                                            onClick={() => {
                                                dispatch(setModalClose(componentName))
                                                dispatch(deleteModalProps({componentName}))
                                            }}
                                            type="other" 
                                            title="Нет" 
                                            myStyle={{height: '25px', width: '80px', backgroundColor: '#ff2828'}}
                                        />
                                    </div>
                                </div>
                            </>
                        }
                        {
                            componentData?.objChangedData?.action === 'delete-file' &&
                            <>
                            <div style={{display: 'flex', flexDirection: 'column', marginTop: '80px'}}>
                                <div style={{flex: '1', marginTop: '20px', textAlign: 'center', fontWeight: 'bold'}}>
                                    {modalsPropsData?.other?.['title']}   
                                </div>
                                <div style={{flex: '1', margin: '20px', textAlign: 'center', fontWeight: 'bold', border: '1 solid #c11616'}}>
                                    <ButtonMain
                                        onClick={funcSaveFields}
                                        type="other" 
                                        title="Да" 
                                        myStyle={{height: '25px', width: '80px', backgroundColor: '#0cd70c', border: '1 solid #0eb30e'}}
                                    />
                                    <ButtonMain
                                        onClick={() => {
                                            dispatch(setModalClose(componentName))
                                            dispatch(deleteModalProps({componentName}))
                                        }}
                                        type="other" 
                                        title="Нет" 
                                        myStyle={{height: '25px', width: '80px', backgroundColor: '#ff2828', border: '1 solid #c11616'}}
                                    />
                                </div>
                            </div>
                        </> 
                        }
                    </ContentBlock>
                </MainModalMainBlock>
            </ModalViewBase>
        </>)}
    </>)
}

export default ChangeFileDataModal