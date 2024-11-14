import React, { useEffect, useState } from "react";
import ListBlock from "../../../UI/list/ListBlock";
import MainInfoBlock from "../../../blocks/MainInfoBlock";
import BtnBlock from "../../../blocks/BtnBlock";
import ButtonMain from "../../../UI/buttons/ButtonMain";
import ContentBlock from "../../../blocks/ContentBlock";
import BlockInput from "../../../UI/fields/BlockInput";
import { useDispatch } from "react-redux";
import { useFieldValueChange } from "../../../hooks/useFieldValueChange";
import { IInputValue, ISelectValue } from "../../../../store/componentsData/componentsDataSlice";
import { setLoadingStatus } from "../../../../store/componentsData/loadingProcessSlice";
import BlockSelect from "../../../UI/fields/BlockSelect";
import { IFieldParams, IInputTypes } from "../../../../store/componentsData/fieldsParamsSlice";
import LoadingView from "../../../loading/LoadingView";
import { funcSortedDataByValue } from "../../../functions/funcSortedDataByValue";
import { funcFilteredDataByValues } from "../../../functions/funcFilteredDataByValues";
import { useEffectStoreData } from "../../../hooks/useEffectStoreData";
import { useComponentPreparation } from "../../../hooks/useComponentPreparation";
import { deleteComponentsAPIUpdate } from "../../../../store/componentsData/componentsAPIUpdateSlice";
import { setModalProps } from "../../../../store/modalData/modalsPropsDataSlice";
import { setModalOpen } from "../../../../store/modalData/modalsSlice";
import { ICountryNames, useGetCountriesQuery } from "../../../../store/api/countryApiSlice";
import { useAllComponentParamsReset } from "../../../hooks/useComponentDataReset";
import useTimeoutManager from "../../../hooks/useTimeoutManager";

interface ICountriesList {
    setSelectedID: (id: number | null) => void,
    selectedID: number | null
}

const CountriesList = ({
    setSelectedID,
    selectedID
}: ICountriesList) => {

    const componentName = "CountriesList"
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const {loadingProcess, fieldParams, componentData, componentsAPIUpdate} = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: countriesData, isFetching: isFetchingCountriesData, error: errorCountriesData, refetch: refetchCountriesData} = useGetCountriesQuery(undefined)
    
    useEffect(() => {
        if (componentsAPIUpdate.includes('countriesData')) {
            refetchCountriesData()
            dispatch(deleteComponentsAPIUpdate(['countriesData']))
        }
    }, [componentsAPIUpdate]);

    const initFieldParams: IFieldParams = {
        'name': { isRequired: false, type: 'text' },
        'status': { isRequired: true, type: 'number' }
    }

    useEffect(() => {
        if (!isComponentPrepared) {
            componentPreparing({ loadingFieldsData: ['name', 'status', 'arrCountries'], fieldsParamsData: initFieldParams });
            setValues({ name: 'status', value: 1 })
            setIsComponentPrepared(true);            
        }
    }, []);

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: Object.keys(initFieldParams)}}))
        if (isComponentPrepared) {
            setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['name', 'status']}}))
            }, 1000)
        }
    }, [isComponentPrepared, isFetchingCountriesData]);

    useEffect(() => {
        if (isComponentPrepared) {
            if (!isFetchingCountriesData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['arrCountries']}}))
                }, 1000)
            } else {
                dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['arrCountries']}}))
            }
        }
    }, [isFetchingCountriesData, isComponentPrepared]);

    const [sortedCountriesData, setSortedCountriesData] = useState<ICountryNames[]>([])
    
    useEffect(() => {
        if (countriesData && isComponentPrepared) {
            const fieldsCheckValues = [
                {fieldName: 'name', value: componentData?.objInputAndChangedData['name'], required: false},
                {fieldName: 'active', value: componentData?.objInputAndChangedData['status'] === 1 ? true : false, required: false},
            ]
            const newData = funcSortedDataByValue(funcFilteredDataByValues(countriesData, fieldsCheckValues), 'name')
            setSortedCountriesData(newData)
            if (!newData.find(item => item.id === selectedID)) {
                setSelectedID(null)
            }
        } else {
            setSortedCountriesData([])
            setSelectedID(null)
        }
    },[componentData?.objInputAndChangedData, countriesData, isComponentPrepared])

    let itemsList;
    if (loadingProcess?.['arrCountries'].status) {
        itemsList = (
            <div style={{position: 'relative', height: '100px'}}>
                <LoadingView myStyleContainer={{backgroundColor: 'rgba(255, 255, 255, 0)'}}/>                            
            </div>            
        )
    } else {
        if (errorCountriesData) {
            itemsList = (
                <div style={{marginTop: '20px', marginLeft: '10px', marginBottom: '10px'}}>
                    Ошибка загрузки данных...
                </div>
            )
        } else {
            itemsList = (
                <>{sortedCountriesData.map((item) => (
                    <ListBlock
                        key={item.id}
                        title={item.name_rus}
                        onClick={() => {
                            setSelectedID(item.id)
                        }}
                        isActive={item.id === selectedID}
                    />                        
                ))}</>
            )
        }
    }
    
    return (<>
        {isComponentPrepared && (
            <MainInfoBlock myStyleMain={{maxWidth: '300px', borderRight: '1px solid #bebebe'}} key={'CountriesList'}>
                <BtnBlock>
                    <ButtonMain
                        onClick={() => {
                            dispatch(setModalProps({componentName: 'CreateNewCountryModal', data: {
                                objChangedData: {active: true},
                                objReadOnlyFields: ['active'],
                                qtyFieldsForSavingBtn: 1
                            }}))
                            dispatch(setModalOpen('CreateNewCountryModal'))
                        }}
                        type={'other'}
                        title={'Добавить'}  
                        color={'gray'}
                    />
                </BtnBlock>
                <ContentBlock>
                    <BlockInput
                        onChange={(obj) => setValues(obj)}
                        fieldName={'name'}
                        title={'Название'}
                        type={fieldParams?.['name']?.type as IInputTypes}
                        value={componentData?.objInputAndChangedData['name'] as IInputValue}
                        placeholder={'Начните вводить текст ...'}
                        skeletonLoading={loadingProcess?.['name']}
                        isRequired={fieldParams?.['name']?.isRequired}
                    />
                    <BlockSelect
                        fieldName={'status'}
                        showName={"name"}
                        title={'Статус'}
                        value={componentData?.objInputAndChangedData['status'] as ISelectValue}
                        options={[{id: 1, name: 'Активные'}, {id: 2, name: 'Архив'}]}
                        isEmptyOption={false}
                        onChange={(obj) => setValues(obj)}
                        skeletonLoading={loadingProcess?.['status']}
                        isRequired={fieldParams?.['status']?.isRequired}
                    />
                    {itemsList}           
                </ContentBlock>
            </MainInfoBlock>
        )}
    </>)
}

export default CountriesList