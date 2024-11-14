import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComponentPreparation } from '../../hooks/useComponentPreparation';
import { useFieldValueChange } from '../../hooks/useFieldValueChange';
import { useDispatch } from 'react-redux';
import { setLoadingStatus } from '../../../store/componentsData/loadingProcessSlice';
import { deleteComponentsAPIUpdate, setComponentsAPIUpdate } from '../../../store/componentsData/componentsAPIUpdateSlice';
import { IFieldParams } from '../../../store/componentsData/fieldsParamsSlice';
import ButtonMain from '../../UI/buttons/ButtonMain';
import { ISelectValue } from '../../../store/componentsData/componentsDataSlice';
import BlockSelect from '../../UI/fields/BlockSelect';
import { setResetTableParams } from '../../../store/tableData/tablesResetParamsSlice';
import { useEffectStoreData } from '../../hooks/useEffectStoreData';
import GeneralKeyExchangeTable from '../../tables/GeneralKeyExchangeTable';
import { setModalOpen } from '../../../store/modalData/modalsSlice';
import { useAllComponentParamsReset } from '../../hooks/useComponentDataReset';
import useTimeoutManager from '../../hooks/useTimeoutManager';
import { useGetKeyExchangesTableQuery } from '../../../store/api/keyExchangeApiSlice';



const GeneralKeyExchangePage = () => {

    const componentName = 'GeneralKeyExchangePage'
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
    
    const { data: keyExchangesTableData, isFetching: isFetchingKeyExchangesTableData, error: errorKeyExchangesTableData, refetch: refetchKeyExchangesTableData } = useGetKeyExchangesTableQuery(
        {active},
        {
            skip: !shouldFetch,
            selectFromResult: ({ data, ...other }) => ({
                data: shouldFetch ? data : undefined,
                ...other
            })  
        }
    );

    useEffect(() => {
        if (componentsAPIUpdate.includes('keyExchangesData')) {
            updateAPIData('keyExchangesData', refetchKeyExchangesTableData)
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
        'active': {isRequired: false, type: 'text'},
        'arrKeyExchanges': {isRequired: false, type: 'array'},
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['arrKeyExchanges']}}))
        if (isComponentPrepared) {
            if (!isFetchingKeyExchangesTableData) {
                if (errorKeyExchangesTableData) {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['arrKeyExchanges']}}))
                    }, 1000)
                }
                if (!errorKeyExchangesTableData && keyExchangesTableData) {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['arrKeyExchanges']}}))
                    }, 1000)  
                }
            }
        }
    }, [isComponentPrepared, isFetchingKeyExchangesTableData, keyExchangesTableData]);

    function funcUpdateData() {
        dispatch(setComponentsAPIUpdate(['keyExchangesData']))
    }

    const [selectedLineID, setSelectedLineID] = useState<number | undefined | null>()

    function funcBackSelectedID (id: number | undefined | null) {
        setSelectedLineID(id)
    }

    useEffect(() => {
        setSelectedLineID(null)
    },[componentData?.objInputAndChangedData])

    // Открытие страницы в текущей вкладке
        const navigate = useNavigate();
        const funcOpenInCurrentTab = () => {
            if (selectedLineID) {
                navigate(`/key-exchange/${selectedLineID}/`);
            }
        };

    // Открытие страницы в новой вкладке
        const funcOpenInNewTab = () => {
            if (selectedLineID) {
                const currentUrl = window.location.href
                window.open(`${currentUrl}${selectedLineID}/`, '_blank');
            }
        };       

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
                    <ButtonMain
                        onClick={() => {
                            dispatch(setModalOpen('CreateNewKeyExchangeModal'))
                        }}
                        type='addNewLine'
                        title='Создать...'
                    />
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
                    {selectedLineID &&
                        <ButtonMain
                            onClick={() => {}}
                            type={'other'}
                            title={'Открыть'}
                            color={'gray'}
                            drop={true}
                            actions={[
                                {
                                    name: "В новой вкладке", 
                                    onClick: funcOpenInNewTab
                                }, 
                                {
                                    name: "В текущей вкладке", 
                                    onClick: funcOpenInCurrentTab
                                }
                            ]}
                            myStyle={{padding: '0 10px', width: 'auto'}}
                        />    
                    }      
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
                                onClick: () => {dispatch(setResetTableParams({type: 'filters', tableName: 'GeneralKeyExchangeTableStateLocalStorage'}))}
                            },
                            {
                                name: "Сбросить настройки таблицы", 
                                onClick: () => {dispatch(setResetTableParams({type: 'allParams', tableName: 'GeneralKeyExchangeTableStateLocalStorage'}))}
                            },                            
                        ]}
                    />    
                </div>
            </div>

            <div className='bottom-context-block'>
                {isComponentPrepared && (<>
                    <GeneralKeyExchangeTable
                        arrData={keyExchangesTableData || []}
                        isLoading={!isResetToPreviousTableParams ? loadingProcess['arrKeyExchanges'] : {status: true}}
                        funcGetLineID={funcBackSelectedID}
                        savedTableParamsTime={savedTableParamsTime}
                    />
                </>)}
            </div>
        </div>
    );
};

export default GeneralKeyExchangePage;