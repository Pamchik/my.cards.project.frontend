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
import { useGetVendorsQuery } from "../../../../store/api/vendorApiSlice";
import { IProductTypesData, useGetProductTypesQuery } from "../../../../store/api/productTypeApiSlice";
import { setModalProps } from "../../../../store/modalData/modalsPropsDataSlice";
import { setModalOpen } from "../../../../store/modalData/modalsSlice";
import { useAllComponentParamsReset } from "../../../hooks/useComponentDataReset";
import useTimeoutManager from "../../../hooks/useTimeoutManager";

interface IProductTypesList {
    setSelectedID: (id: number | null) => void,
    selectedID: number | null
}

const ProductTypesList = ({
    setSelectedID,
    selectedID
}: IProductTypesList) => {

    const componentName = "ProductTypesList"
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const {loadingProcess, fieldParams, componentData, componentsAPIUpdate} = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: productTypesData, isFetching: isFetchingProductTypesData, error: errorProductTypesData, refetch: refetchProductTypesData} = useGetProductTypesQuery(undefined)
    const {data: vendorsData, isFetching: isFetchingVendorsData, error: errorVendorsData, refetch: refetchVendorsData} = useGetVendorsQuery(undefined)
    
    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    useEffect(() => {
        if (componentsAPIUpdate.includes('productTypesData')) {
            refetchProductTypesData()
            dispatch(deleteComponentsAPIUpdate(['productTypesData']))
        } else if (componentsAPIUpdate.includes('vendorsData')) {
            refetchVendorsData()
            dispatch(deleteComponentsAPIUpdate(['vendorsData']))
        }
    }, [componentsAPIUpdate]);

    const initFieldParams: IFieldParams = {
        'name': { isRequired: false, type: 'text' },
        'vendor': { isRequired: true, type: 'number' },
        'status': { isRequired: true, type: 'number' }
    }

    useEffect(() => {
        if (!isComponentPrepared) {
            componentPreparing({ loadingFieldsData: ['name', 'vendor', 'status', 'arrProductTypes'], fieldsParamsData: initFieldParams });
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
        }
    }, [isFetchingVendorsData, isComponentPrepared]);

    useEffect(() => {
        if (isComponentPrepared) {
            if (!isFetchingProductTypesData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['arrProductTypes']}}))
                }, 1000)
            } else {
                dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['arrProductTypes']}}))
            }
        }
    }, [isFetchingProductTypesData, isComponentPrepared]);

    const [sortedProductTypesData, setSortedProductTypesData] = useState<IProductTypesData[]>([])
    
    useEffect(() => {
        if (productTypesData && isComponentPrepared) {
            const fieldsCheckValues = [
                {fieldName: 'name_eng', value: componentData?.objInputAndChangedData['name'], required: false},
                {fieldName: 'vendor', value: componentData?.objInputAndChangedData['vendor'], required: true},
                {fieldName: 'active', value: componentData?.objInputAndChangedData['status'] === 1 ? true : false, required: false},
            ]
            const newData = funcSortedDataByValue(funcFilteredDataByValues(productTypesData, fieldsCheckValues), 'name_eng')
            setSortedProductTypesData(newData)
            if (!newData.find(item => item.id === selectedID)) {
                setSelectedID(null)
            }
        } else {
            setSortedProductTypesData([])
            setSelectedID(null)
        }
    },[componentData?.objInputAndChangedData, productTypesData, isComponentPrepared])

    let itemsList;
    if (loadingProcess?.['arrProductTypes'].status) {
        itemsList = (
            <div style={{position: 'relative', height: '100px'}}>
                <LoadingView myStyleContainer={{backgroundColor: 'rgba(255, 255, 255, 0)'}}/>                            
            </div>            
        )
    } else {
        if (errorProductTypesData) {
            itemsList = (
                <div style={{marginTop: '20px', marginLeft: '10px', marginBottom: '10px'}}>
                    Ошибка загрузки данных...
                </div>
            )
        } else {
            itemsList = (
                <>{sortedProductTypesData.map((item) => (
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
                            dispatch(setModalProps({componentName: 'CreateNewProductTypeModal', data: {
                                objChangedData: {active: true},
                                objReadOnlyFields: ['active'],
                                qtyFieldsForSavingBtn: 1
                            }}))
                            dispatch(setModalOpen('CreateNewProductTypeModal'))
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
                    {itemsList}           
                </ContentBlock>
            </MainInfoBlock>
        )}
    </>)
}

export default ProductTypesList