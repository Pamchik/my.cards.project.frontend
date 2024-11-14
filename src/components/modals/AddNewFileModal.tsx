import { useEffect, useState } from "react";
import { useComponentPreparation } from "../hooks/useComponentPreparation";
import { useEffectStoreData } from "../hooks/useEffectStoreData";
import { useFieldValueChange } from "../hooks/useFieldValueChange";
import { useDispatch } from "react-redux";
import { MainModalBtnBlock, MainModalMainBlock, MainModalText, MainModalTopBlock, ModalViewBase } from "./ModalViewBase";
import LoadingView from "../loading/LoadingView";
import ButtonMain from "../UI/buttons/ButtonMain";
import { setModalClose, setModalOpen } from "../../store/modalData/modalsSlice";
import { deleteModalProps, setModalProps } from "../../store/modalData/modalsPropsDataSlice";
import ContentBlock from "../blocks/ContentBlock";
import FileAddForm from "../UI/loadingFile/FileAddForm";
import BlockInput from "../UI/fields/BlockInput";
import { IFieldParams, IInputTypes } from "../../store/componentsData/fieldsParamsSlice";
import { IInputValue, ITextareaValue, deleteAllComponentData, setChangedData, setInputData } from "../../store/componentsData/componentsDataSlice";
import { setLoadingStatus } from "../../store/componentsData/loadingProcessSlice";
import { setSavingStatus } from "../../store/componentsData/savingProcessSlice";
import { funcValidateFields } from "../functions/funcValidateFields";
import { deleteFieldInvalid, setFieldInvalid } from "../../store/componentsData/fieldsInvalidSlice";
import { useAddExistFileMutation, useAddFileMutation } from "../../store/api/fileApiSlice";
import { functionErrorMessage } from "../functions/functionErrorMessage";
import BlockRadioBox from "../UI/fields/BlockRadioBox";
import { useAllComponentParamsReset } from "../hooks/useComponentDataReset";
import useTimeoutManager from "../hooks/useTimeoutManager";
import BlockTextarea from "../UI/fields/BlockTextarea";
import { folderPathApi, useGetFolderPathQuery } from "../../store/api/folderPathApiSlice";
import { useAddGalleryMutation } from "../../store/api/galleryApiSlice";
import { useGetFileFormatsQuery } from "../../store/api/fileFormatApiSlice";
import { useGetShortProjectsTableQuery } from "../../store/api/projectsApiSlice";


const AddNewFileModal = () => {

    const componentName = 'AddNewFileModal'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const {modalsPropsData, loadingProcess, fieldParams, componentData, componentInvalidFields, savingProcess, componentsAPIUpdate} = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const { data: folderPath, isFetching: isFetchingFolderPath, error: errorFolderPath, refetch: refetchFolderPath } = useGetFolderPathQuery(
        {
            model_name: modalsPropsData?.other?.['model_name'] || '',
            model_type: modalsPropsData?.other?.['model_type'] || '',
            component_name: modalsPropsData?.other?.['component_name'] || '',
            number: modalsPropsData?.other?.['number'] || ''
        }
    );
    const {data: fileFormats, isFetching: isFetchingFileFormats, error: errorFileFormats, refetch: refetchFileFormats} = useGetFileFormatsQuery(undefined)
    const {data: shortProjectsTableData, isFetching: isFetchingShortProjectsTableData, error: errorShortProjectsTableData, refetch: refetchShortProjectsTableData} = useGetShortProjectsTableQuery(
        {
            id: "!" + modalsPropsData?.other?.['number'],
            active: 'True',
        },
        { 
            skip: (modalsPropsData?.other?.['model_type'] !== 'projectline' || !modalsPropsData?.other?.['number']),
            selectFromResult: ({ data, ...other }) => ({
                data: (modalsPropsData?.other?.['model_type'] === 'projectline' && modalsPropsData?.other?.['number']) ? data : [],
                ...other
            })  
        }
    )
    const {data: shortProjectsTableCurrentLine, isFetching: isFetchingShortProjectsTableCurrentLine, error: errorShortProjectsTableCurrentLine, refetch: refetchShortProjectsTableCurrentLinea} = useGetShortProjectsTableQuery(
        {
            id: modalsPropsData?.other?.['number']
        },
        { 
            skip: (modalsPropsData?.other?.['model_type'] !== 'projectline' || !modalsPropsData?.other?.['number']),
            selectFromResult: ({ data, ...other }) => ({
                data: (modalsPropsData?.other?.['model_type'] === 'projectline' && modalsPropsData?.other?.['number']) ? data : [],
                ...other
            })  
        }
    )

    const [addFile, {}] = useAddFileMutation()
    const [addGallery, {}] = useAddGalleryMutation()
    const [addExistFile, {}] = useAddExistFileMutation()

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    const initFieldParams: IFieldParams = {
        'name': {isRequired: true, type: 'folder'},
        'other': {isRequired: false, type: 'text'},
        'received_from': {isRequired: false, type: 'text'},
        'folder_name': {isRequired: true, type: 'text'},
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
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['folder_name']}}))
        if (isComponentPrepared && !isFetchingFolderPath && !isFetchingShortProjectsTableData && !isFetchingShortProjectsTableCurrentLine) {
            if (!errorFolderPath && !errorShortProjectsTableData && !errorShortProjectsTableCurrentLine) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['folder_name']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['folder_name']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingFolderPath, isFetchingShortProjectsTableData, isFetchingShortProjectsTableCurrentLine]);

    useEffect(() => {
        if (modalsPropsData?.objInputData) {
            dispatch(setInputData({componentName, data: modalsPropsData.objInputData}))
        }
        if (modalsPropsData?.objChangedData) {
            dispatch(setChangedData({componentName, data: modalsPropsData.objChangedData}))
        }
    }, [isComponentPrepared]);

    // Доступные расширения
        const [availableExtensions, setAvailableExtensions] = useState<string[]>([])
        useEffect(() => {
            if (fileFormats && fileFormats.length > 0) {
                if (modalsPropsData?.other?.['file_type'] === 'gallery') {
                    setAvailableExtensions(fileFormats
                        .filter(item => item.available_for_image_gallery === true || item.available_for_video_gallery === true)
                        .map(item => item.file_extension)
                    )
                } else {
                    setAvailableExtensions(fileFormats.map(item => item.file_extension))
                }
            } else {
                setAvailableExtensions([])
            }
        }, [fileFormats]);

    // Функция отображение выбранного файла
        const [fileName, setFileName] = useState<string>('Нет выбранных файлов');
        const [file, setFile] = useState<File | null>(null);

        const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.files) {
                const file = event.target.files[0];
                if (file) {
                    if (modalsPropsData?.other?.['file_type'] === 'gallery') {
                        const fileExtension = file.name.split('.').pop()?.toLocaleLowerCase()
                        if (fileExtension && availableExtensions.includes(fileExtension)) {
                            setFileName(file.name);
                            setFile(file)
                            setValues({name: 'name', value: file.name.substring(0, file.name.lastIndexOf('.'))}) 
                        } else {
                            setFileName('Неверный формат файла');
                            setFile(null);
                            setValues({name: 'name', value: ''}) 
                        }
                    } else {
                        setFileName(file.name);
                        setFile(file)
                        setValues({name: 'name', value: file.name.substring(0, file.name.lastIndexOf('.'))}) 
                    }
                } else {
                    setFileName('Нет выбранных файлов');
                    setFile(null);
                    setValues({name: 'name', value: ''}) 
                }
            }
        };

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

    // Выбранная линия
        const [currentNumber, setCurrentNumber] = useState<string | undefined>(undefined)
        useEffect(() => {
            if (shortProjectsTableCurrentLine && shortProjectsTableCurrentLine.length !== 0) {
                setCurrentNumber(shortProjectsTableCurrentLine[0].number as string)
            } else {
                setCurrentNumber(undefined)
            }
        }, [shortProjectsTableCurrentLine]);

        const [additionalNumbers, setAdditionalNumbers] = useState<number[]>([])
        useEffect(() => {
            const numbers: number[] | undefined = componentData?.objInputAndChangedData['numbers'] as number[] | undefined
            if (numbers && numbers.length !== 0) {
                setAdditionalNumbers(numbers)
            } else {
                setAdditionalNumbers([])
            }
        }, [componentData?.objInputAndChangedData['numbers']]);

        const [numberLines, setNumberLines] = useState<string>('')
        useEffect(() => {
            if (shortProjectsTableData) {
                const filteredNumbers = shortProjectsTableData
                    .filter(order => order.id && additionalNumbers.includes(order.id))
                    .map(order => order.number);
                setNumberLines('Текущая: ' + currentNumber + '. Дополнительные: ' + filteredNumbers.join(' ,'))                
            }
        }, [currentNumber, additionalNumbers, shortProjectsTableData]);

    // Пусть для сохранения
        useEffect(() => {
            if (folderPath) {
                setValues({name: 'folder_name', value: folderPath})    
            } else {
                setValues({name: 'folder_name', value: null})
            }
        }, [folderPath]);

        async function funcSaveFields () {
            dispatch(setSavingStatus({componentName, data: {status: true}}))
            if (file) {
                const isValid = funcValidateFields(fieldParams, componentData?.objInputAndChangedData, componentData?.objChangedData)
                if (isValid.isAllFieldsValid) {
                    dispatch(deleteFieldInvalid({componentName}))
                    const myData = componentData.objChangedData
                    await (modalsPropsData?.other?.['file_type'] === "gallery" 
                        ? addGallery({file, data: myData}) 
                        : addFile({file, data: myData})
                    ).unwrap()
                        .then((res) => {
                            let qtyNumbers = additionalNumbers.length
                            if (qtyNumbers > 0) {
                                additionalNumbers.forEach(id => {
                                    const myData = {
                                        action: "add-exist-file",
                                        file: res?.['file'],
                                        folder_name: res?.['folder_name'],
                                        model_type: res?.['model_type'],
                                        number: id,
                                        process_step: res?.['process_step'],
                                    }
    
                                    addExistFile(myData).unwrap()    
                                        .then((res) => {
                                            qtyNumbers = qtyNumbers - 1
                                        }).catch((error) => {
                                            const message = functionErrorMessage(error)
                                            dispatch(setSavingStatus({ componentName, data: { status: true, isSuccessful: false, message: message} }))
                                        })                        
                                })
                                dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: true}}))
                                dispatch(deleteAllComponentData({componentName}))
                                setManagedTimeout(() => { 
                                    dispatch(setSavingStatus({ componentName, data: { status: false } }))
                                    dispatch(setModalClose(componentName))
                                    dispatch(deleteModalProps({componentName}))
                                    dispatch(folderPathApi.util.resetApiState())
                                    allComponentParamsReset()
                                }, 1000)
    
                            } else {
                                dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: true}}))
                                dispatch(deleteAllComponentData({componentName}))
                                setManagedTimeout(() => { 
                                    dispatch(setSavingStatus({ componentName, data: { status: false } }))
                                    dispatch(setModalClose(componentName))
                                    dispatch(deleteModalProps({componentName}))
                                    dispatch(folderPathApi.util.resetApiState())
                                    allComponentParamsReset()
                                }, 1000)
                            }
    
                    }).catch((error) => {
                        const message = functionErrorMessage(error)
                        if (typeof message !== 'string' && message?.['file-exist']) {
                            dispatch(setFieldInvalid({componentName, data: {'name': {status: true, message: 'Имя в данной папке уже существует.'}}}))
                            dispatch(setSavingStatus({componentName, data: {status: false}}))
                        } else {
                            dispatch(setSavingStatus({ componentName, data: { status: true, isSuccessful: false, message: message} }))
                        }
                    })             
                } else {
                    dispatch(setFieldInvalid({componentName, data: isValid.data}))
                    dispatch(setSavingStatus({componentName, data: {status: false}}))
                }
            } else {
                const message = functionErrorMessage('Отсутствует файл')
                dispatch(setSavingStatus({ componentName, data: { status: true, isSuccessful: false, message: message} }))
            }
        }  

    return (<>
        {isComponentPrepared && (<>
            <ModalViewBase
                myStyleContext={{ }} 
                onClick={() => {
                    dispatch(setModalClose(componentName))
                    dispatch(deleteModalProps({componentName}))
                    dispatch(folderPathApi.util.resetApiState())
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
                    <MainModalText modalTitle={'Добавление нового файла'}/>
                    <MainModalBtnBlock myStyleBtnBlock={{width: '120px'}}>
                        {file
                            && (
                                <ButtonMain
                                    onClick={funcSaveFields}
                                    type="submit" 
                                    title="Сохранить" 
                                />
                            )
                        }
                        <ButtonMain 
                            onClick={() => {
                                dispatch(setModalClose(componentName))
                                dispatch(deleteModalProps({componentName}))
                                dispatch(folderPathApi.util.resetApiState())
                                allComponentParamsReset()
                            }}
                            type="resetIcon" 
                        />
                    </MainModalBtnBlock>
                </MainModalTopBlock>
                <MainModalMainBlock myStyleMainBlock={{width: '800px'}}>
                    <ContentBlock>
                        <ContentBlock>
                            <FileAddForm
                                onChange={handleFileChange}
                                fileName={fileName}
                                description={modalsPropsData?.other?.['file_type'] === 'gallery' ? `доступный формат: ${availableExtensions.join(', ')}` : undefined}
                            />
                        </ContentBlock>
                        {file &&
                            <div style={{padding: '0 15px 15px 15px'}}>
                                <div style={{display: 'flex'}}>
                                    <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                                        <div style={{fontSize: '11pt', fontWeight: 'bold'}}>
                                            Название файла: <span style={{color: 'red'}}>*</span>
                                        </div>
                                        <BlockInput
                                            fieldName={'name'}
                                            onChange={(obj) => setValues(obj)}
                                            isRequired={fieldParams?.['name']?.isRequired}
                                            type={fieldParams?.['name']?.type as IInputTypes}
                                            isInvalidStatus={componentInvalidFields?.['name']}
                                            isChanged={!!componentData?.objChangedData?.['name']}
                                            value={componentData?.objInputAndChangedData['name'] as IInputValue}
                                            skeletonLoading={loadingProcess?.['name']}
                                            placeholder={'Введите название файла'}
                                        />
                                    </div>
                                </div>

                                <div style={{fontSize: '11pt', fontWeight: 'bold', marginTop: '25px'}}>
                                    Комментарий:
                                </div>
                                <BlockTextarea
                                    fieldName={'other'}
                                    onChange={(obj) => setValues(obj)}
                                    isRequired={fieldParams?.['other']?.isRequired}
                                    isInvalidStatus={componentInvalidFields?.['other']}
                                    isChanged={!!componentData?.objChangedData?.['other']}
                                    value={componentData?.objInputAndChangedData['other'] as ITextareaValue}
                                    skeletonLoading={loadingProcess?.['other']}
                                    placeholder={'Введите комментарий'}
                                />
                                {modalsPropsData?.other?.['file_type'] === "file" && 
                                (componentData?.objChangedData?.['model_type'] !== 'Instructions' && componentData?.objChangedData?.['model_type'] !== 'DocTemplates') &&
                                (<>
                                    <div style={{fontSize: '11pt', fontWeight: 'bold', marginTop: '25px'}}>
                                        От кого получено:   
                                    </div>
                                    <div>
                                        {arrReceivedFrom.map((item) => (
                                            <BlockRadioBox
                                                key={item.id} 
                                                fieldName={'received_from'}
                                                id={item.id}
                                                name={item.name}
                                                isReadOnly={false}
                                                onChange={handleChoseItem}
                                            />
                                        ))}
                                        {selectedRadioItem['received_from'] === 'Другое' &&
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
                                </>)
                                }
                                <div style={{fontSize: '11pt', fontWeight: 'bold', marginTop: '25px'}}>
                                    Путь для сохранения: <span style={{color: 'red'}}>*</span> 
                                </div>
                                <div style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
                                    <BlockInput
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
                                                    action: modalsPropsData?.other?.['action']
                                                }
                                            }}))
                                            dispatch(setModalOpen('ChangeFolderModal'))
                                        }}
                                        type="other" 
                                        title="Изменить" 
                                        myStyle={{height: '25px', width: '80px', marginTop: '10px'}}
                                    />
                                </div>
                                {(modalsPropsData?.other?.['file_type'] === "file" && modalsPropsData?.other?.['model_type'] === 'projectline') && (<>
                                    <div style={{fontSize: '11pt', fontWeight: 'bold', marginTop: '25px'}}>
                                        Для каких линий используется:   
                                    </div>
                                    <div style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
                                        <BlockInput
                                            fieldName={'number'}
                                            value={numberLines}
                                            isReadOnly={true}
                                            onChange={()=>{}}
                                            myStyle={{width: 'calc(100% - 100px)'}}
                                        />
                                        <ButtonMain
                                            onClick={() => {
                                                dispatch(setModalProps({componentName: 'ChangeNumberLinesModal', data: {
                                                    other: {
                                                        arrOrders: shortProjectsTableData,
                                                        additionalNumbers: additionalNumbers
                                                    }
                                                }}))
                                                dispatch(setModalOpen('ChangeNumberLinesModal'))
                                            }}
                                            type="other" 
                                            title="Изменить" 
                                            myStyle={{height: '25px', width: '80px', marginTop: '10px'}}
                                        />
                                    </div>
                                </>)}                                                            
                            </div>
                        }                        
                    </ContentBlock>

                </MainModalMainBlock>
            </ModalViewBase>
        </>)}
    </>)

}

export default AddNewFileModal