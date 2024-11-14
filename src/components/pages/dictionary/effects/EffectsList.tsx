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
import { deleteComponentsAPIUpdate } from "../../../../store/componentsData/componentsAPIUpdateSlice";
import { IProductTypesData, useGetProductTypesQuery } from "../../../../store/api/productTypeApiSlice";
import { IEffectsData, useGetEffectsQuery } from "../../../../store/api/effectApiSlice";
import { setModalOpen } from "../../../../store/modalData/modalsSlice";
import { setModalProps } from "../../../../store/modalData/modalsPropsDataSlice";
import { useGetVendorsQuery } from "../../../../store/api/vendorApiSlice";
import { useAllComponentParamsReset } from "../../../hooks/useComponentDataReset";
import useTimeoutManager from "../../../hooks/useTimeoutManager";

interface IEffectsList {
    setSelectedID: (id: number | null) => void,
    selectedID: number | null
}

const EffectsList = ({
    setSelectedID,
    selectedID
}: IEffectsList) => {

    const componentName = "EffectsList"
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const {loadingProcess, fieldParams, componentData, componentsAPIUpdate} = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: effectsData, isFetching: isFetchingEffectsData, error: errorEffectsData, refetch: refetchEffectsData} = useGetEffectsQuery(undefined)
    const {data: vendorsData, isFetching: isFetchingVendorsData, error: errorVendorsData, refetch: refetchVendorsData} = useGetVendorsQuery(undefined)
    const {data: productTypesData, isFetching: isFetchingProductTypesData, error: errorProductTypesData, refetch: refetchProductTypesData} = useGetProductTypesQuery(undefined)
    
    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    useEffect(() => {
        if (componentsAPIUpdate.includes('effectsData')) {
            refetchEffectsData()
            dispatch(deleteComponentsAPIUpdate(['effectsData']))
        } else if (componentsAPIUpdate.includes('vendorsData')) {
            refetchVendorsData()
            dispatch(deleteComponentsAPIUpdate(['vendorsData']))
        } else if (componentsAPIUpdate.includes('productTypesData')) {
            refetchProductTypesData()
            dispatch(deleteComponentsAPIUpdate(['productTypesData']))
        }
    }, [componentsAPIUpdate]);

    const initFieldParams: IFieldParams = {
        'name': { isRequired: false, type: 'text' },
        'vendor': { isRequired: true, type: 'number' },
        'product_type': { isRequired: true, type: 'number' },
        'status': { isRequired: true, type: 'number' }
    }

    useEffect(() => {
        if (!isComponentPrepared) {
            componentPreparing({ loadingFieldsData: ['name', 'vendor', 'product_type', 'status', 'arrEffects'], fieldsParamsData: initFieldParams });
            setValues({ name: 'status', value: 1 })
            setIsComponentPrepared(true);            
        }
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: Object.keys(initFieldParams)}}))
        if (isComponentPrepared) {
            setManagedTimeout(() => {
                dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['name', 'status']}}))
            }, 1000)
            if (!isFetchingVendorsData) {
                setManagedTimeout(() => {
                    if (!errorVendorsData) {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['vendor']}}))
                    } else {
                        dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: false, fields: ['vendor']}}))
                    }
                }, 1000)
            } else {
                dispatch(setLoadingStatus({ componentName, data: { status: true, fields: ['vendor']}}))
            }
            if (!isFetchingProductTypesData) {
                setManagedTimeout(() => {
                    if (!errorProductTypesData) {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['product_type']}}))
                    } else {
                        dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: false, fields: ['product_type']}}))
                    }
                }, 1000)
            } else {
                dispatch(setLoadingStatus({ componentName, data: { status: true, fields: ['product_type']}}))
            }
        }
    }, [isFetchingVendorsData, isFetchingProductTypesData, isComponentPrepared]);

    useEffect(() => {
        if (isComponentPrepared) {
            if (!isFetchingEffectsData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['arrEffects']}}))
                }, 1000)
            } else {
                dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['arrEffects']}}))
            }
        }
    }, [isFetchingEffectsData, isComponentPrepared]);

    const [sortedEffectsData, setSortedEffectsData] = useState<IEffectsData[]>([])
    
    useEffect(() => {
        if (effectsData && isComponentPrepared) {
            const fieldsCheckValues = [
                {fieldName: 'name_rus', value: componentData?.objInputAndChangedData['name'], required: false},
                {fieldName: 'product_type', value: componentData?.objInputAndChangedData['product_type'], required: true},
                {fieldName: 'active', value: componentData?.objInputAndChangedData['status'] === 1 ? true : false, required: true},
            ]
            const newData = funcSortedDataByValue(funcFilteredDataByValues(effectsData, fieldsCheckValues), 'name_rus')
            setSortedEffectsData(newData)
            if (!newData.find(item => item.id === selectedID)) {
                setSelectedID(null)
            }
        } else {
            setSortedEffectsData([])
            setSelectedID(null)
        }
    },[componentData?.objInputAndChangedData, effectsData, isComponentPrepared])

    const [arrFilteredProductTypesNamesData, setArrFilteredProductTypesNamesData] = useState<IProductTypesData[]>([])
    function updateProductTypesNames () {
        const currentVendorID: number | undefined = componentData?.objInputAndChangedData['vendor'] as number
        if (currentVendorID && productTypesData) {
            setArrFilteredProductTypesNamesData(productTypesData.filter(item => item.vendor === +currentVendorID))
        } else {
            setArrFilteredProductTypesNamesData([])
        }            
    }

    useEffect(() => {
        updateProductTypesNames()
        setValues({name: 'product_type', value: null})
    }, [componentData?.objInputAndChangedData['vendor']]);

    useEffect(() => {
        updateProductTypesNames()
    }, [productTypesData]);

    let itemsList;
    if (loadingProcess?.['arrEffects'].status) {
        itemsList = (
            <div style={{position: 'relative', height: '100px'}}>
                <LoadingView myStyleContainer={{backgroundColor: 'rgba(255, 255, 255, 0)'}}/>                            
            </div>            
        )
    } else {
        if (errorEffectsData) {
            itemsList = (
                <div style={{marginTop: '20px', marginLeft: '10px', marginBottom: '10px'}}>
                    Ошибка загрузки данных...
                </div>
            )
        } else {
            itemsList = (
                <>{sortedEffectsData.map((item) => (
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
            <MainInfoBlock myStyleMain={{maxWidth: '300px', borderRight: '1px solid #bebebe'}}>
                <BtnBlock>
                    <ButtonMain
                        onClick={() => {
                            dispatch(setModalProps({componentName: 'CreateNewEffectModal', data: {
                                objChangedData: {active: true},
                                objReadOnlyFields: ['active'],
                                qtyFieldsForSavingBtn: 1
                            }}))
                            dispatch(setModalOpen('CreateNewEffectModal'))
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
                        fieldName={'vendor'}
                        showName={"name"}
                        title={'Вендор'}
                        value={componentData?.objInputAndChangedData['vendor'] as ISelectValue}
                        options={vendorsData}
                        isEmptyOption={true}
                        onChange={(obj) => setValues(obj)}   
                        skeletonLoading={loadingProcess?.['vendor']}
                        isRequired={fieldParams?.['vendor']?.isRequired}                                    
                    />
                    <BlockSelect
                        fieldName={'product_type'}
                        showName={"name_rus"}
                        title={'Тип продукта'}
                        value={componentData?.objInputAndChangedData['product_type'] as ISelectValue}
                        options={arrFilteredProductTypesNamesData}
                        isEmptyOption={true}
                        onChange={(obj) => setValues(obj)}   
                        skeletonLoading={loadingProcess?.['product_type']}
                        isRequired={fieldParams?.['product_type']?.isRequired}                                    
                    />
                    {itemsList}           
                </ContentBlock>
            </MainInfoBlock>
        )}
    </>)
}

export default EffectsList