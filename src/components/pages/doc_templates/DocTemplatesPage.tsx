import React, { useContext, useEffect, useState } from 'react';
import BlockSelect from '../../UI/fields/BlockSelect';
import ButtonMain from '../../UI/buttons/ButtonMain';
import { useEffectStoreData } from '../../hooks/useEffectStoreData';
import { useComponentPreparation } from '../../hooks/useComponentPreparation';
import { useDispatch } from 'react-redux';
import { useFieldValueChange } from '../../hooks/useFieldValueChange';
import { setLoadingStatus } from '../../../store/componentsData/loadingProcessSlice';
import { IFiles, useGetFilesQuery, useGetFilesTableQuery } from '../../../store/api/fileApiSlice';
import { deleteComponentsAPIUpdate, setComponentsAPIUpdate } from '../../../store/componentsData/componentsAPIUpdateSlice';
import { IFieldParams } from '../../../store/componentsData/fieldsParamsSlice';
import { ISelectValue } from '../../../store/componentsData/componentsDataSlice';
import { setResetTableParams } from '../../../store/tableData/tablesResetParamsSlice';
import DocTemplateFilesTable from '../../tables/DocTemplateFilesTable';
import { setModalProps } from '../../../store/modalData/modalsPropsDataSlice';
import { setModalOpen } from '../../../store/modalData/modalsSlice';
import { useGetFileStatusesQuery } from '../../../store/api/fileStatusApiSlice';
import { useAllComponentParamsReset } from '../../hooks/useComponentDataReset';
import useTimeoutManager from '../../hooks/useTimeoutManager';
import { funcDownloadFile } from '../../functions/funcDownloadFile';

const DocTemplatesPage = () => {

    const componentName = 'DocTemplatesPage'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const { loadingProcess, fieldParams, componentData, componentReadOnly, componentInvalidFields, savingProcess, componentsAPIUpdate } = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    const {data: fileStatusesData, isFetching: isFetchingFileStatusesData, error: errorFileStatusesData, refetch: refetchFileStatusesData} = useGetFileStatusesQuery(undefined)

    const [arrActiveStatuses, setArrActiveStatuses] = useState([
        {id: 1, value: 'Активные', active: true},
        {id: 2, value: 'В архиве', active: true},
    ])
    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['active']}}))
        if (isComponentPrepared) {
            setValues({name: 'active', value: 1})
            setManagedTimeout(() => {
                dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['active']}}))
            }, 1000)
        }
    }, [isComponentPrepared]); 
    const active = componentData?.objInputAndChangedData['active'] === 2 ? 'False' : 'True';

    const shouldFetch = active !== undefined;
    
    const { data: filesTableData, isFetching: isFetchingFilesTableData, error: errorFilesTableData, refetch: refetchFilesTableData } = useGetFilesTableQuery(
        { active, model_type: 'DocTemplates', deleted: 'False' },
        { 
            skip: !shouldFetch,
            selectFromResult: ({ data, ...other }) => ({
                data: shouldFetch ? data : undefined,
                ...other
            })  
        }
    );

    const { data: filesData, isFetching: isFetchingFilesData, error: errorFilesData, refetch: refetchFilesData } = useGetFilesQuery(
        { active, model_type: 'DocTemplates', deleted: 'False' },
        { 
            skip: !shouldFetch,
            selectFromResult: ({ data, ...other }) => ({
                data: shouldFetch ? data : undefined,
                ...other
            })  
        }
    );

    useEffect(() => {
        if (componentsAPIUpdate.includes('filesData')) {
            try {
                refetchFilesTableData()
                refetchFilesData()
            } catch (error) {} finally {
                dispatch(deleteComponentsAPIUpdate(['filesData'])) 
            }
        }
    }, [componentsAPIUpdate]);

    const initFieldParams: IFieldParams = {
        'active': {isRequired: false, type: 'text'},
        'arrFiles': {isRequired: false, type: 'array'},
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['arrFiles']}}))
        if (isComponentPrepared) {
            if (!isFetchingFilesTableData) {
                if (errorFilesTableData) {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['arrFiles']}}))
                    }, 1000)  
                }
                if (!errorFilesTableData && filesTableData) {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['arrFiles']}}))
                    }, 1000)  
                }
            }
        }
    }, [isComponentPrepared, filesTableData, isFetchingFilesTableData]);

    function funcUpdateData() {
        dispatch(setComponentsAPIUpdate(['filesData']))
    }

    const [selectedItemID, setSelectedItemID] = useState<number | null>(null)

    function funcCallBankItemsSelected (id: number | null) {
        if (id) {
            setSelectedItemID(id)
        } else {
            setSelectedItemID(null)
        }
    }

    useEffect(() => {
        setSelectedItemID(null)
    },[componentData?.objInputAndChangedData])

    const [currentObjData, setCurrentObjData] = useState<IFiles | undefined>(undefined);
    useEffect(() => {
        if (selectedItemID) {
            setCurrentObjData(filesData?.find(item => item.id === selectedItemID))    
        } else {
            setCurrentObjData(undefined)  
        }
        
    }, [selectedItemID, filesData, isFetchingFilesData]);

    function funcDownload () {
        if (currentObjData?.file) {
            funcDownloadFile(currentObjData.file, currentObjData.name + '.' + currentObjData.file_extension)
        }
    }

    // Сохранение параметров
        const [savedTableParamsTime, setSavedTableParamsTime] = useState<string>('')
        const funcChangedSave = () => {
            setSavedTableParamsTime(new Date().toLocaleString())
        }

    // Откат до сохраненных параметров
        const [isResetToPreviousTableParams, setIsResetToPreviousTableParams] = useState<boolean>(false)
        const funcPreviousReset = () => {
            setIsResetToPreviousTableParams(true)
            setTimeout(() => {
                setIsResetToPreviousTableParams(false)
            }, 1500)
        }
        useEffect(() => {
            funcPreviousReset()
        }, []);



    return (
        <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
            <div className="top-info-block">
                <div className="top-info-block__fields">
                    <BlockSelect
                        fieldName={'active'}
                        showName={"value"}
                        value={componentData?.objInputAndChangedData['active'] as ISelectValue}
                        options={arrActiveStatuses || []}
                        isEmptyOption={false}
                        onChange={(obj) => setValues(obj)}   
                        skeletonLoading={loadingProcess?.['active']}
                        isRequired={fieldParams?.['active']?.isRequired}  
                        isReadOnly={false} 
                        myStyle={{width: '200px', marginTop: 'auto', marginBottom: 'auto'}}
                    />                  
                </div> 
                <div className="top-info-block__btn-block"> 
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
                                // {
                                //     name: 'Изменить "Получено от..."', 
                                //     onClick: () => {
                                //         dispatch(setModalProps({componentName: 'ChangeFileDataModal', data: {
                                //             objInputData: {
                                //                 received_from: currentObjData.received_from,
                                //             },
                                //             objChangedData: {
                                //                 action: 'change-receiver',
                                //                 file: currentObjData.file
                                //             },
                                //             qtyFieldsForSavingBtn: 2
                                //         }}))
                                //         dispatch(setModalOpen('ChangeFileDataModal'))
                                //     }
                                // },
                                {
                                    name: active === 'True' ? "Отправить в архив" : "Вернуть из архива", 
                                    onClick: () => {
                                        dispatch(setModalProps({componentName: 'ChangeFileDataModal', data: {
                                            objChangedData: {
                                                action: active === 'True' ? 
                                                    'to-archive' : 
                                                    'from-archive',
                                                id: currentObjData.id
                                            },
                                            other: {
                                                title: active === 'True' ? 
                                                    'Вы уверены, что хотите отправить файл в архив' :
                                                    'Вы уверены, что хотите достать файл из архива'
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
                                            model_type: "DocTemplates",
                                            action: 'add-new-file'
                                        },
                                        other: {
                                            action: 'AddNewFile',
                                            file_type: 'file',
                                            model_name: 'files',
                                            model_type: 'doctemplates',    
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
                                            model_type: "DocTemplates",
                                            action: 'add-exist-file'
                                        },
                                        qtyFieldsForSavingBtn: 3,
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
                    <ButtonMain
                        type={'repeatIcon'}
                        onClick={funcUpdateData}
                    />
                    <ButtonMain
                        onClick={() => {}}
                        type={'empty'}
                        title={''}
                        color={'gray'}
                        drop={true}
                        drop_image={'ellipsis'}
                        actions={[
                            {
                                name: "Сохранить изменения", 
                                onClick: () => funcChangedSave()
                            },
                            {
                                name: "Отменить изменения", 
                                onClick: () => funcPreviousReset()
                            },
                            {
                                name: "Сбросить фильтры", 
                                onClick: () => {dispatch(setResetTableParams({type: 'filters', tableName: 'DocTemplateFilesTableStateLocalStorage'}))}
                            },
                            {
                                name: "Сбросить настройки таблицы", 
                                onClick: () => {dispatch(setResetTableParams({type: 'allParams', tableName: 'DocTemplateFilesTableStateLocalStorage'}))}
                            },                            
                        ]}
                    />       
                </div>
            </div>

            <div className='bottom-context-block'>
                {isComponentPrepared && (<>
                    <DocTemplateFilesTable
                        arrFiles={filesTableData || []}
                        isLoading={!isResetToPreviousTableParams ? loadingProcess['arrFiles'] : {status: true}}
                        onItemsSelected={funcCallBankItemsSelected}
                        savedTableParamsTime={savedTableParamsTime}
                    />
                </>)}
            </div>
        </div>
    );
};

export default DocTemplatesPage;