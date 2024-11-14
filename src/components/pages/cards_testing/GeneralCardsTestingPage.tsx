import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComponentPreparation } from '../../hooks/useComponentPreparation';
import { useEffectStoreData } from '../../hooks/useEffectStoreData';
import { useFieldValueChange } from '../../hooks/useFieldValueChange';
import { useDispatch } from 'react-redux';
import { setLoadingStatus } from '../../../store/componentsData/loadingProcessSlice';
import { useGetCardsTestingTableQuery } from '../../../store/api/cardTestingApiSlice';
import { useGetCardTestTypesQuery } from '../../../store/api/cardTestTypeApiSlice';
import { deleteComponentsAPIUpdate, setComponentsAPIUpdate } from '../../../store/componentsData/componentsAPIUpdateSlice';
import { IFieldParams } from '../../../store/componentsData/fieldsParamsSlice';
import ButtonMain from '../../UI/buttons/ButtonMain';
import BlockSelect from '../../UI/fields/BlockSelect';
import { ISelectValue } from '../../../store/componentsData/componentsDataSlice';
import { setResetTableParams } from '../../../store/tableData/tablesResetParamsSlice';
import GeneralCardTestingDataTable from '../../tables/GeneralCardTestingDataTable';
import { setModalOpen } from '../../../store/modalData/modalsSlice';
import { useAllComponentParamsReset } from '../../hooks/useComponentDataReset';
import useTimeoutManager from '../../hooks/useTimeoutManager';

const GeneralCardsTestingPage = () => {

    const componentName = 'GeneralCardsTestingPage'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const { loadingProcess, fieldParams, componentData, componentReadOnly, componentInvalidFields, savingProcess, componentsAPIUpdate } = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()
    
    const {data: cardTestTypesData, isFetching: isFetchingCardTestTypesData, error: errorCardTestTypesData, refetch: refetchCardTestTypesData} = useGetCardTestTypesQuery(undefined)

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
    
    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['test_card_type']}}))
        if (isComponentPrepared && !isFetchingCardTestTypesData && cardTestTypesData) {
            if (!errorCardTestTypesData) {
                if (cardTestTypesData.length > 0) {
                    setValues({name: 'test_card_type', value: 1})
                } else {
                    setValues({name: 'test_card_type', value: null})
                }
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['test_card_type']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['test_card_type']}}))
                }, 1000)
            }
        }
    }, [isComponentPrepared, isFetchingCardTestTypesData, cardTestTypesData]);
    const testCardType = cardTestTypesData?.find(item => item.id === componentData?.objInputAndChangedData['test_card_type'])?.id;

    const shouldFetch = (active !== undefined && testCardType);
    
    const { data: cardsTestingTable, isFetching: isFetchingCardsTestingTable, error: errorCardsTestingTable, refetch: refetchCardsTestingTable } = useGetCardsTestingTableQuery(
        {active, type_card: testCardType},
        {
            skip: !shouldFetch,
            selectFromResult: ({ data, ...other }) => ({
                data: shouldFetch ? data : undefined,
                ...other
            })  
        }
    );

    useEffect(() => {
        if (componentsAPIUpdate.includes('cardsTestingTable')) {
            updateAPIData('cardsTestingTable', refetchCardsTestingTable)
        } else if (componentsAPIUpdate.includes('cardTestTypesData')) {
            updateAPIData('cardTestTypesData', refetchCardTestTypesData)
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
        'test_card_type': {isRequired: false, type: 'text'},
        'arrCardsTesting': {isRequired: false, type: 'array'},
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['arrCardsTesting']}}))
        if (isComponentPrepared) {
            if (!isFetchingCardsTestingTable) {
                if (errorCardsTestingTable) {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['arrCardsTesting']}}))
                    }, 1000)
                }
                if (!errorCardsTestingTable && cardsTestingTable) {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['arrCardsTesting']}}))
                    }, 1000)  
                }
            }
        }
    }, [isComponentPrepared, cardsTestingTable, isFetchingCardsTestingTable]); 

    function funcUpdateData() {
        dispatch(setComponentsAPIUpdate(['cardTestTypesData', 'cardsTestingTable']))
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
                navigate(`/cards-testing/${selectedLineID}/`);
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
                            dispatch(setModalOpen('CreateNewCardTestingProjectModal'))
                        }}
                        type='addNewLine'
                        title='Создать...'
                    />
                    <BlockSelect
                        fieldName={'test_card_type'}
                        showName={"name"}
                        value={componentData?.objInputAndChangedData['test_card_type'] as ISelectValue}
                        options={cardTestTypesData || []}
                        isEmptyOption={false}
                        onChange={(obj) => setValues(obj)}   
                        skeletonLoading={loadingProcess?.['test_card_type']}
                        isRequired={fieldParams?.['test_card_type']?.isRequired}  
                        isReadOnly={false} 
                        myStyle={{width: '200px', marginTop: 'auto', marginBottom: 'auto'}} 
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
                                onClick: () => {dispatch(setResetTableParams({type: 'filters', tableName: 'GeneralCardTestingDataTableStateLocalStorage'}))}
                            },
                            {
                                name: "Сбросить настройки таблицы", 
                                onClick: () => {dispatch(setResetTableParams({type: 'allParams', tableName: 'GeneralCardTestingDataTableStateLocalStorage'}))}
                            },                             
                        ]}
                    />   
                </div>
            </div>

            <div className='bottom-context-block'>
                {isComponentPrepared && (<>
                    <GeneralCardTestingDataTable
                        arrData={cardsTestingTable || []}
                        isLoading={!isResetToPreviousTableParams ? loadingProcess['arrCardsTesting'] : {status: true}}
                        funcGetLineID={funcBackSelectedID}
                        savedTableParamsTime={savedTableParamsTime}
                    />
                </>)}
            </div>
        </div>
    );
};

export default GeneralCardsTestingPage;