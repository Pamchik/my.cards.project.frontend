import React, { useEffect, useState } from 'react';
import { useComponentPreparation } from '../../hooks/useComponentPreparation';
import { useFieldValueChange } from '../../hooks/useFieldValueChange';
import { useDispatch } from 'react-redux';
import { setLoadingStatus } from '../../../store/componentsData/loadingProcessSlice';
import { deleteComponentsAPIUpdate, setComponentsAPIUpdate } from '../../../store/componentsData/componentsAPIUpdateSlice';
import { IFieldParams } from '../../../store/componentsData/fieldsParamsSlice';
import ButtonMain from '../../UI/buttons/ButtonMain';
import { setResetTableParams } from '../../../store/tableData/tablesResetParamsSlice';
import { useEffectStoreData } from '../../hooks/useEffectStoreData';
import { setModalOpen } from '../../../store/modalData/modalsSlice';
import { useAllComponentParamsReset } from '../../hooks/useComponentDataReset';
import useTimeoutManager from '../../hooks/useTimeoutManager';
import GeneralReportsTable from '../../tables/GeneralReportsTable';
import { useGetReportsNameQuery } from '../../../store/api/reportApiSlice';


const GeneralReportsPage = () => {

    const componentName = 'GeneralReportsPage'
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
    
    const { data: reportsTableData, isFetching: isFetchingReportsTableData, error: errorReportsTableData, refetch: refetchReportsTableData } = useGetReportsNameQuery(undefined)

    useEffect(() => {
        if (componentsAPIUpdate.includes('reportsData')) {
            updateAPIData('reportsData', refetchReportsTableData)
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
        'arrReports': {isRequired: false, type: 'array'},
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['arrReports']}}))
        if (isComponentPrepared) {
            if (!isFetchingReportsTableData) {
                if (errorReportsTableData) {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['arrReports']}}))
                    }, 1000)
                }
                if (!errorReportsTableData && reportsTableData) {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['arrReports']}}))
                    }, 1000)  
                }
            }
        }
    }, [isComponentPrepared, isFetchingReportsTableData, reportsTableData]);

    function funcUpdateData() {
        dispatch(setComponentsAPIUpdate(['reportsData']))
    }

    const [selectedLineComponentName, setSelectedLineComponentName] = useState<string | undefined | null>()

    function funcBackSelectedComponentName (componentName: string | undefined | null) {
        setSelectedLineComponentName(componentName)
    }

    useEffect(() => {
        setSelectedLineComponentName(null)
    },[componentData?.objInputAndChangedData])
    
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
                </div><div className="top-info-block__btn-block">
                    {selectedLineComponentName &&
                        <ButtonMain
                            onClick={() => {dispatch(setModalOpen(selectedLineComponentName))}}
                            type={'other'}
                            title={'Открыть'}
                            color={'gray'}
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
                                onClick: () => {dispatch(setResetTableParams({type: 'filters', tableName: 'GeneralReportsPageTableStateLocalStorage'}))}
                            },
                            {
                                name: "Сбросить настройки таблицы", 
                                onClick: () => {dispatch(setResetTableParams({type: 'allParams', tableName: 'GeneralReportsPageTableStateLocalStorage'}))}
                            },                            
                        ]}
                    />    
                </div>
            </div>

            <div className='bottom-context-block'>
                {isComponentPrepared && (<>
                    <GeneralReportsTable
                        arrData={reportsTableData || []}
                        isLoading={!isResetToPreviousTableParams ? loadingProcess['arrReports'] : {status: true}}
                        funcGetLineComponentName={funcBackSelectedComponentName}
                        savedTableParamsTime={savedTableParamsTime}
                    />
                </>)}
            </div>
        </div>
    );
};

export default GeneralReportsPage;