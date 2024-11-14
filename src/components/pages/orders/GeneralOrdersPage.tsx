import React, { useEffect, useState } from 'react';
import ButtonMain from '../../UI/buttons/ButtonMain';
import BlockSelect from '../../UI/fields/BlockSelect';
import { useEffectStoreData } from '../../hooks/useEffectStoreData';
import { useComponentPreparation } from '../../hooks/useComponentPreparation';
import { useFieldValueChange } from '../../hooks/useFieldValueChange';
import { useDispatch } from 'react-redux';
import { ISelectValue } from '../../../store/componentsData/componentsDataSlice';
import { useGetStartYearsQuery } from '../../../store/api/startYearApiSlice';
import { deleteComponentsAPIUpdate, setComponentsAPIUpdate } from '../../../store/componentsData/componentsAPIUpdateSlice';
import { IFieldParams } from '../../../store/componentsData/fieldsParamsSlice';
import {  useGetProjectsTableQuery } from '../../../store/api/projectsApiSlice';
import { setLoadingStatus } from '../../../store/componentsData/loadingProcessSlice';
import GeneralOrderTable from '../../tables/GeneralOrderTable';
import { setResetTableParams } from '../../../store/tableData/tablesResetParamsSlice';
import { useNavigate } from 'react-router-dom';
import { setModalOpen } from '../../../store/modalData/modalsSlice';
import { useAllComponentParamsReset } from '../../hooks/useComponentDataReset';
import useTimeoutManager from '../../hooks/useTimeoutManager';

const GeneralOrdersPage = () => {

    const componentName = 'GeneralOrdersPage'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const { loadingProcess, fieldParams, componentData, componentReadOnly, componentInvalidFields, savingProcess, componentsAPIUpdate } = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()
    
    const {data: startYearsData, isFetching: isFetchingStartYearsData, error: errorStartYearsData, refetch: refetchStartYearsData} = useGetStartYearsQuery(undefined)

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    const currentYear = new Date().getFullYear();
    const [uniqueYears, setUniqueYears] = useState<number[]>([]);
    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['year']}}))
        if (isComponentPrepared && !isFetchingStartYearsData && startYearsData && currentYear) {
            if (!errorStartYearsData) {
                const startYear: number = startYearsData?.length! > 0 ? startYearsData?.[0]?.year_number || currentYear : currentYear
                const years: number[] = [];
                for (let year = startYear; year <= currentYear; year++) {
                    years.push(year);
                }
                setUniqueYears(years);
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['year']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['year']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingStartYearsData, startYearsData]);
    const [arrYears, setArrYears] = useState<{id: number, value: number, active: boolean}[]>([]);
    useEffect(() => {
        setArrYears(uniqueYears.map((year, index) => ({
            id: index + 1,
            value: year,
            active: true,
        })))
    }, [uniqueYears]);
    useEffect(() => {
        if (!componentData?.objInputAndChangedData?.hasOwnProperty('year')) {
            if ( arrYears.find(item => item.value === currentYear)?.id) {
                setValues({name: 'year', value: arrYears.find(item => item.value === currentYear)?.id || null})
            }
        }
    }, [arrYears]);
    const displayYear = arrYears.find(item => item.id === componentData?.objInputAndChangedData['year'])?.value;

    const [arrOrderStatuses, setArrOrderStatuses] = useState([
        {id: 1, value: 'Текущие', active: true},
        {id: 2, value: 'Проекты', active: true},
    ])
    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['status']}}))
        if (isComponentPrepared) {
            setValues({name: 'status', value: 1})
            setManagedTimeout(() => {
                dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['status']}}))
            }, 1000)
        }
    }, [isComponentPrepared]); 
    const isProject = componentData?.objInputAndChangedData['status'] === 1 ? 'False' : 'True';

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
    
    const shouldFetch = (displayYear !== undefined || componentData?.objInputAndChangedData?.hasOwnProperty('year')) && active !== undefined && isProject !== undefined;
    
    const { data: projectsTableData, isFetching: isFetchingProjectsTableData, error: errorProjectsTableData, refetch: refetchProjectsTableData } = useGetProjectsTableQuery(
      { display_year: displayYear, active, isProject },
      { 
        skip: !shouldFetch,
        selectFromResult: ({ data, ...other }) => ({
            data: shouldFetch ? data : undefined,
            ...other
        })  
    }
    );

    useEffect(() => {
        if (componentsAPIUpdate.includes('startYearsData')) {
            updateAPIData('startYearsData', refetchStartYearsData)
        } else if (componentsAPIUpdate.includes('projectsTableData')) {
            updateAPIData('projectsTableData', refetchProjectsTableData)
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
        'status': {isRequired: false, type: 'text'},
        'year': {isRequired: false, type: 'text'},
        'active': {isRequired: false, type: 'text'},
        'arrOrders': {isRequired: false, type: 'array'},
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['arrOrders']}}))
        if (isComponentPrepared) {
            if (!isFetchingProjectsTableData) {
                if (errorProjectsTableData) {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['arrOrders']}}))
                    }, 0)  
                }
                if (!errorProjectsTableData && projectsTableData) {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['arrOrders']}}))
                    }, 0)  
                }
            }
        }
    }, [isComponentPrepared, projectsTableData, isFetchingProjectsTableData]);

    function funcUpdateData() {
        dispatch(setComponentsAPIUpdate(['startYearsData', 'projectsTableData']))
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
                navigate(`/projects/${selectedLineID}/`);
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
                            dispatch(setModalOpen('CreateNewLineModal'))
                        }}
                        type='addNewLine'
                        title='Создать...'
                    />
                    <BlockSelect
                        fieldName={'status'}
                        showName={"value"}
                        value={componentData?.objInputAndChangedData['status'] as ISelectValue}
                        options={arrOrderStatuses || []}
                        isEmptyOption={false}
                        onChange={(obj) => {setValues(obj)}}   
                        skeletonLoading={loadingProcess?.['status']}
                        isRequired={fieldParams?.['status']?.isRequired}  
                        isReadOnly={false} 
                        myStyle={{width: '200px', marginTop: 'auto', marginBottom: 'auto'}}
                    />
                    <BlockSelect
                        fieldName={'year'}
                        showName={"value"}
                        value={componentData?.objInputAndChangedData['year'] as ISelectValue}
                        options={arrYears || []}
                        isEmptyOption={true}
                        onChange={(obj) => setValues(obj)}   
                        skeletonLoading={loadingProcess?.['year']}
                        isRequired={fieldParams?.['year']?.isRequired}  
                        isReadOnly={false} 
                        myStyle={{width: '150px', marginTop: 'auto', marginBottom: 'auto'}} 
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
                                onClick: () => {dispatch(setResetTableParams({type: 'filters', tableName: 'GeneralOrderTableStateLocalStorage'}))}
                            },
                            {
                                name: "Сбросить все настройки таблицы", 
                                onClick: () => {dispatch(setResetTableParams({type: 'allParams', tableName: 'GeneralOrderTableStateLocalStorage'}))}
                            },                            
                        ]}
                    />                          
                </div>
            </div>

            <div className='bottom-context-block'> 
                {isComponentPrepared && (<>
                    <GeneralOrderTable
                        arrData={projectsTableData || []}
                        isLoading={!isResetToPreviousTableParams ? loadingProcess['arrOrders'] : {status: true}}
                        funcGetLineID={funcBackSelectedID}
                        savedTableParamsTime={savedTableParamsTime}
                    />                   
                </>)}
            </div>
        </div>
    );
};

export default GeneralOrdersPage;