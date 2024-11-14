import React, { useEffect, useState } from 'react';
import { IFiles, useGetFilesQuery, useOpenFileMutation } from '../../../store/api/fileApiSlice';
import BtnBlock from '../../blocks/BtnBlock';
import ButtonMain from '../../UI/buttons/ButtonMain';
import ContentBlock from '../../blocks/ContentBlock';
import { useEffectStoreData } from '../../hooks/useEffectStoreData';
import { useComponentPreparation } from '../../hooks/useComponentPreparation';
import { useDispatch } from 'react-redux';
import { deleteComponentsAPIUpdate } from '../../../store/componentsData/componentsAPIUpdateSlice';
import { IFieldParams } from '../../../store/componentsData/fieldsParamsSlice';
import { setLoadingStatus } from '../../../store/componentsData/loadingProcessSlice';
import { setModalProps } from '../../../store/modalData/modalsPropsDataSlice';
import { setModalOpen } from '../../../store/modalData/modalsSlice';
import { useGetFileStatusesQuery } from '../../../store/api/fileStatusApiSlice';
import CardsTestingFilesTable from '../../tables/CardsTestingFilesTable';
import { useAllComponentParamsReset } from '../../hooks/useComponentDataReset';
import useTimeoutManager from '../../hooks/useTimeoutManager';
import { funcDownloadFile } from '../../functions/funcDownloadFile';
import { functionErrorMessage } from '../../functions/functionErrorMessage';
import { setSavingStatus } from '../../../store/componentsData/savingProcessSlice';

interface ICardsTestingTableBlock {
    selectedID: number
   }

const CardsTestingTableBlock = ({
    selectedID
}: ICardsTestingTableBlock) => {

    const componentName = 'CardsTestingTableBlock'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const { loadingProcess, componentsAPIUpdate } = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const dispatch = useDispatch()

    const [openFile, {}] = useOpenFileMutation()

    const { data: filesData, isFetching: isFetchingFilesData, error: errorFilesData, refetch: refetchFilesData } = useGetFilesQuery(
        { model_type: 'CardTestingProjects', number: selectedID, active: 'True', deleted: 'False' }
    )
    const {data: fileStatusesData, isFetching: isFetchingFileStatusesData, error: errorFileStatusesData, refetch: refetchFileStatusesData} = useGetFileStatusesQuery(undefined)

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    useEffect(() => {
        if (componentsAPIUpdate.includes('filesData')) {
            updateAPIData('filesData', refetchFilesData)
        } else if (componentsAPIUpdate.includes('fileStatusesData')) {
            updateAPIData('fileStatusesData', refetchFileStatusesData)
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
        'arrFiles': {isRequired: false, type: 'array'},
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['arrFiles']}}))
        if (isComponentPrepared) {
            if (!isFetchingFilesData && !isFetchingFileStatusesData) {
                if (!errorFilesData && filesData && !errorFileStatusesData && fileStatusesData) {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['arrFiles']}}))
                    }, 1000)  
                } else {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['arrFiles']}}))
                    }, 1000)
                }
            }
            setCurrentObjData(undefined)
        }
    }, [isComponentPrepared, filesData, isFetchingFilesData, fileStatusesData, isFetchingFileStatusesData]);

    const [currentObjData, setCurrentObjData] = useState<IFiles | undefined>(undefined);
    function funcCallBankItemsSelected (id: number | null) {
        if (id) {
            setCurrentObjData(filesData?.find(item => item.id === id))
        } else {
            setCurrentObjData(undefined)
        }
    }

    function funcDownload () {
        if (currentObjData?.file) {
            funcDownloadFile(currentObjData.file, currentObjData.name + '.' + currentObjData.file_extension)
        }
    }

    async function funcOpenFileLocation () {
        await openFile({
            folder_name: currentObjData?.folder_name,
            action: "open-location"
        }).unwrap()
        .then((res) => {

        }).catch((error) => {
            const message = functionErrorMessage(error)
            dispatch(setSavingStatus({ componentName, data: { status: true, isSuccessful: false, message: message} }))
        })  
    }

    return (
        <>
        <BtnBlock>
            {currentObjData && (<>
                <ButtonMain
                    onClick={() => {}}
                    type={'other'} 
                    color={'gray'}
                    title={'Редактировать'}
                    drop={true}
                    actions={[
                        {
                            name: "Изменить название", 
                            onClick: () => {
                                dispatch(setModalProps({componentName: 'ChangeFileDataModal', data: {
                                    objInputData: {
                                        name: currentObjData.name,
                                    },
                                    objChangedData: {
                                        action: 'change-name',
                                        file: currentObjData.file
                                    },
                                    qtyFieldsForSavingBtn: 2
                                }}))
                                dispatch(setModalOpen('ChangeFileDataModal'))
                            }
                        }, 
                        {
                            name: "Изменить статус", 
                            onClick: () => {
                                dispatch(setModalProps({componentName: 'ChangeFileDataModal', data: {
                                    objInputData: {
                                        status: currentObjData.status,
                                    },
                                    objChangedData: {
                                        action: 'change-status',
                                        file: currentObjData.file
                                    },
                                    other: {
                                        arrfileStatuses: fileStatusesData?.filter(item =>
                                            item.name === "Новый" ||
                                            item.name === "Отправлено (клиент)" ||
                                            item.name === "Получена эл.копия" ||
                                            item.name === "Получен оригинал" ||
                                            item.name === "В архиве"
                                        ) || []
                                    },
                                    qtyFieldsForSavingBtn: 2
                                }}))
                                dispatch(setModalOpen('ChangeFileDataModal'))  
                            }
                        },
                        {
                            name: "Изменить комментарий", 
                            onClick: () => {
                                dispatch(setModalProps({componentName: 'ChangeFileDataModal', data: {
                                    objInputData: {
                                        other: currentObjData.other,
                                    },
                                    objChangedData: {
                                        action: 'change-comment',
                                        file: currentObjData.file
                                    },
                                    qtyFieldsForSavingBtn: 2
                                }}))
                                dispatch(setModalOpen('ChangeFileDataModal'))
                            }
                        },
                        {
                            name: "Изменить расположение", 
                            onClick: () => {
                                dispatch(setModalProps({componentName: 'ChangeFileDataModal', data: {
                                    objInputData: {
                                        folder_name: currentObjData.folder_name,
                                    },
                                    objChangedData: {
                                        action: 'change-folder',
                                        file: currentObjData.file
                                    },
                                    qtyFieldsForSavingBtn: 2
                                }}))
                                dispatch(setModalOpen('ChangeFileDataModal'))
                            }
                        },
                        {
                            name: 'Изменить "Получено от..."', 
                            onClick: () => {
                                dispatch(setModalProps({componentName: 'ChangeFileDataModal', data: {
                                    objInputData: {
                                        received_from: currentObjData.received_from,
                                    },
                                    objChangedData: {
                                        action: 'change-receiver',
                                        file: currentObjData.file
                                    },
                                    qtyFieldsForSavingBtn: 2
                                }}))
                                dispatch(setModalOpen('ChangeFileDataModal'))
                            }
                        },
                        {
                            name: "Удалить для текущей линии", 
                            onClick: () => {
                                dispatch(setModalProps({componentName: 'ChangeFileDataModal', data: {
                                    objChangedData: {
                                        action: 'to-archive',
                                        id: currentObjData.id
                                    },
                                    other: {
                                        title: 'Вы уверены, что хотите скрыть файл для данной линии?'
                                    }
                                }}))
                                dispatch(setModalOpen('ChangeFileDataModal'))                                
                            },
                            myStyle: {color: 'red'}
                        },
                        {
                            name: "Удалить файл", 
                            onClick: () => {
                                dispatch(setModalProps({componentName: 'ChangeFileDataModal', data: {
                                    objChangedData: {
                                        action: 'delete-file',
                                        file: currentObjData.file
                                    },
                                    other: {
                                        title: 'Вы уверены, что хотите полностью удалить файл?'
                                    }
                                }}))
                                dispatch(setModalOpen('ChangeFileDataModal'))    
                            },
                            myStyle: {color: 'red'}
                        },
                    ]}
                    myStyle={{padding: '0 10px', width: '130px'}}
                />   
                {/* <ButtonMain 
                    onClick={funcOpenFileLocation}
                    type={'other'} 
                    color={'gray'}
                    title={'Открыть папку'}
                    myStyle={{padding: '0 10px', width: '130px'}}
                />  */}
                <ButtonMain 
                    onClick={funcDownload}
                    type={'other'} 
                    color={'gray'}
                    title={'Скачать'}
                />                
            </>)}
            <ButtonMain
                onClick={() => {}}
                type={'other'}
                title={'Добавить'}
                color={'gray'}
                drop={true}
                actions={[
                    {
                        name: "Новый файл", 
                        onClick: () => {
                            dispatch(setModalProps({componentName: 'AddNewFileModal', data: {
                                objChangedData: {
                                    model_type: "CardTestingProjects",
                                    number: selectedID,
                                    action: 'add-new-file'
                                },
                                other: {
                                    model_name: 'files',
                                    action: 'AddNewFile',
                                    model_type: 'cardtestingprojects',
                                    file_type: 'file',
                                    number: selectedID,
                                }
                            }}))
                            dispatch(setModalOpen('AddNewFileModal'))
                        }
                    }, 
                    {
                        name: "Выбрать текущий", 
                        onClick: () => {
                            dispatch(setModalProps({componentName: 'AddExistFileModal', data: {
                                objChangedData: {
                                    model_type: "CardTestingProjects",
                                    action: 'add-exist-file',
                                    number: selectedID
                                },
                                qtyFieldsForSavingBtn: 4,
                                other: {
                                    action: 'AddExistFile'
                                }
                            }}))
                            dispatch(setModalOpen('AddExistFileModal'))   
                        }
                    }
                ]}
                myStyle={{padding: '0 10px', width: '100px'}}
            /> 
        </BtnBlock>

        <ContentBlock myStyleMain={{padding: '0'}} myStyleContent={{display: 'block', height: '300px'}}>
            <CardsTestingFilesTable
                arrFiles={filesData || []}
                isLoading={loadingProcess?.['arrFiles']}
                onItemsSelected={funcCallBankItemsSelected}
            />               
        </ContentBlock>
    </>
    );
};

export default CardsTestingTableBlock;