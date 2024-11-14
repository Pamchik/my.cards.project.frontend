import { useEffect, useState } from "react";
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
import { IBanksData, useGetBanksQuery } from "../../../../store/api/bankApiSlice";
import { useGetCountriesQuery } from "../../../../store/api/countryApiSlice";
import { deleteComponentsAPIUpdate } from "../../../../store/componentsData/componentsAPIUpdateSlice";
import { setModalOpen } from "../../../../store/modalData/modalsSlice";
import { setModalProps } from "../../../../store/modalData/modalsPropsDataSlice";
import { useAllComponentParamsReset } from "../../../hooks/useComponentDataReset";
import useTimeoutManager from "../../../hooks/useTimeoutManager";

interface IBanksList {
    setSelectedID: (id: number | null) => void,
    selectedID: number | null
}

const BanksList = ({
    setSelectedID,
    selectedID
}: IBanksList) => {

    const componentName = "BanksList"
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const {loadingProcess, fieldParams, componentData, componentsAPIUpdate} = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: banksData, isFetching: isFetchingBanksData, error: errorBanksData, refetch: refetchBanksData} = useGetBanksQuery(undefined)
    const {data: countriesData, isFetching: isFetchingCountriesData, error: errorCountriesData, refetch: refetchCountriesData} = useGetCountriesQuery(undefined)
    
    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    useEffect(() => {
        if (componentsAPIUpdate.includes('banksData')) {
            refetchBanksData()
            dispatch(deleteComponentsAPIUpdate(['banksData']))
        } else if (componentsAPIUpdate.includes('countriesData')) {
            refetchCountriesData()
            dispatch(deleteComponentsAPIUpdate(['countriesData']))
        }
    }, [componentsAPIUpdate]);

    const initFieldParams: IFieldParams = {
        'name': { isRequired: false, type: 'text' },
        'country': { isRequired: false, type: 'number' },
        'status': { isRequired: true, type: 'number' }
    }

    useEffect(() => {
        if (!isComponentPrepared) {
            componentPreparing({ loadingFieldsData: ['name', 'country', 'status', 'arrBanks'], fieldsParamsData: initFieldParams });
            setValues({ name: 'status', value: 1 })
            setIsComponentPrepared(true);            
        }
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: Object.keys(initFieldParams)}}))
        if (isComponentPrepared) {
            if (!isFetchingCountriesData) {
                setManagedTimeout(() => {
                    if (!errorCountriesData) {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['name', 'country', 'status']}}))
                    } else {
                        dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: false, fields: ['name', 'country', 'status']}}))
                    }
                }, 1000)
            } else {
                dispatch(setLoadingStatus({ componentName, data: { status: true, fields: ['country']}}))
            }            
        }
    }, [isFetchingCountriesData, isComponentPrepared]);

    useEffect(() => {
        if (isComponentPrepared) {
            if (!isFetchingBanksData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['arrBanks']}}))
                }, 1000)
            } else {
                dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['arrBanks']}}))
            }
        }
    }, [isFetchingBanksData, isComponentPrepared]);

    const [sortedBanksData, setSortedBanksData] = useState<IBanksData[]>([])
    
    useEffect(() => {
        if (banksData && isComponentPrepared) {
            const fieldsCheckValues = [
                {fieldName: 'name_eng', value: componentData?.objInputAndChangedData['name'], required: false},
                {fieldName: 'country', value: componentData?.objInputAndChangedData['country'], required: false},
                {fieldName: 'active', value: componentData?.objInputAndChangedData['status'] === 1 ? true : false, required: false},
            ]
            const newData = funcSortedDataByValue(funcFilteredDataByValues(banksData, fieldsCheckValues), 'name_eng')
            setSortedBanksData(newData)
            if (!newData.find(item => item.id === selectedID)) {
                setSelectedID(null)
            }
        } else {
            setSortedBanksData([])
            setSelectedID(null)
        }
    },[componentData?.objInputAndChangedData, banksData, isComponentPrepared])

    let itemsList;
    if (loadingProcess?.['arrBanks'].status) {
        itemsList = (
            <div style={{position: 'relative', height: '100px'}}>
                <LoadingView myStyleContainer={{backgroundColor: 'rgba(255, 255, 255, 0)'}}/>                            
            </div>            
        )
    } else {
        if (errorBanksData) {
            itemsList = (
                <div style={{marginTop: '20px', marginLeft: '10px', marginBottom: '10px'}}>
                    Ошибка загрузки данных...
                </div>
            )
        } else {
            itemsList = (
                <>{sortedBanksData.map((item) => (
                    <ListBlock
                        key={item.id}
                        title={item.name_eng}
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
            <MainInfoBlock myStyleMain={{maxWidth: '300px', borderRight: '1px solid #bebebe'}}>
                <BtnBlock>
                    <ButtonMain
                        onClick={() => {
                            dispatch(setModalProps({componentName: 'CreateNewBankModal', data: {
                                objChangedData: {active: true},
                                objReadOnlyFields: ['active'],
                                qtyFieldsForSavingBtn: 1
                            }}))
                            dispatch(setModalOpen('CreateNewBankModal'))
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
                    <BlockSelect
                        fieldName={'country'}
                        showName={"name_rus"}
                        title={'Страна'}
                        value={componentData?.objInputAndChangedData['country'] as ISelectValue}
                        options={countriesData}
                        isEmptyOption={true}
                        onChange={(obj) => setValues(obj)}   
                        skeletonLoading={loadingProcess?.['country']}
                        isRequired={fieldParams?.['country']?.isRequired}                                    
                    />
                    {itemsList}           
                </ContentBlock>
            </MainInfoBlock>
        )}
    </>)
}

export default BanksList