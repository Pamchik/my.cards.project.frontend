import { useEffect, useState } from "react";
import ListBlock from "../../../UI/list/ListBlock";
import { useEffectStoreData } from "../../../hooks/useEffectStoreData";
import { useComponentPreparation } from "../../../hooks/useComponentPreparation";
import { useFieldValueChange } from "../../../hooks/useFieldValueChange";
import { useDispatch } from "react-redux";
import { IFieldParams, IInputTypes } from "../../../../store/componentsData/fieldsParamsSlice";
import { setLoadingStatus } from "../../../../store/componentsData/loadingProcessSlice";
import { funcSortedDataByValue } from "../../../functions/funcSortedDataByValue";
import { funcFilteredDataByValues } from "../../../functions/funcFilteredDataByValues";
import LoadingView from "../../../loading/LoadingView";
import MainInfoBlock from "../../../blocks/MainInfoBlock";
import BtnBlock from "../../../blocks/BtnBlock";
import ButtonMain from "../../../UI/buttons/ButtonMain";
import ContentBlock from "../../../blocks/ContentBlock";
import BlockInput from "../../../UI/fields/BlockInput";
import { IInputValue, ISelectValue } from "../../../../store/componentsData/componentsDataSlice";
import BlockSelect from "../../../UI/fields/BlockSelect";
import { deleteComponentsAPIUpdate } from "../../../../store/componentsData/componentsAPIUpdateSlice";
import { IMaterialColorsData, useGetMaterialColorsQuery } from "../../../../store/api/materialColorApiSlice";
import { setModalProps } from "../../../../store/modalData/modalsPropsDataSlice";
import { setModalOpen } from "../../../../store/modalData/modalsSlice";
import { useAllComponentParamsReset } from "../../../hooks/useComponentDataReset";
import useTimeoutManager from "../../../hooks/useTimeoutManager";
import { useGetMaterialQuery } from "../../../../store/api/materialApiSlice";
import { useGetProductTypeQuery } from "../../../../store/api/productTypeApiSlice";


interface IMaterialColorsList {
    setSelectedID: (id: number | null) => void,
    selectedID: number | null
    globalElementID: number
}

const MaterialColorsList = ({
    setSelectedID,
    selectedID,
    globalElementID
}: IMaterialColorsList) => {

    const componentName = "MaterialColorsList"
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const {loadingProcess, fieldParams, componentData, componentsAPIUpdate} = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: materialColorsData, isFetching: isFetchingMaterialColorsData, error: errorMaterialColorsData, refetch: refetchMaterialColorsData} = useGetMaterialColorsQuery({material_type: globalElementID})
    const {data: materialData, isFetching: isFetchingMaterialData, error: errorMaterialData, refetch: refetchMaterialData} = useGetMaterialQuery({id: globalElementID})
    const {data: productTypeData, isFetching: isFetchingProductTypeData, error: errorProductTypeData, refetch: refetchProductTypeData} = useGetProductTypeQuery({id: materialData?.[0].product_type})


    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    useEffect(() => {
        if (componentsAPIUpdate.includes('materialColorsData')) {
            refetchMaterialColorsData()
            dispatch(deleteComponentsAPIUpdate(['materialColorsData']))
        }
    }, [componentsAPIUpdate]);

    const initFieldParams: IFieldParams = {
        'name': { isRequired: false, type: 'text' },
        'status': { isRequired: true, type: 'number' }
    }

    useEffect(() => {
        if (!isComponentPrepared) {
            componentPreparing({ loadingFieldsData: ['name', 'status', 'arrMaterialColors'], fieldsParamsData: initFieldParams });
            setValues({ name: 'status', value: 1 })
            setIsComponentPrepared(true);
        }
    }, [globalElementID]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: Object.keys(initFieldParams)}}))
        if (isComponentPrepared) {
            setManagedTimeout(() => {
                dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['name', 'status']}}))
            }, 1000)
        }
    }, [isComponentPrepared, globalElementID]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['arrMaterialColors']}}))
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: Object.keys(initFieldParams)}}))
        if (isComponentPrepared) {
            setManagedTimeout(() => {
                dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['name', 'status']}}))
            }, 1000)
            if (!isFetchingMaterialColorsData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['arrMaterialColors']}}))
                }, 1000)
            } else {
                dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['arrMaterialColors']}}))
            }
        }

    }, [isFetchingMaterialColorsData, isComponentPrepared, globalElementID]);

    const [sortedMaterialColorsData, setSortedMaterialColorsData] = useState<IMaterialColorsData[]>([])

    useEffect(() => {
        if (materialColorsData && isComponentPrepared) {
            const fieldsCheckValues = [
                {fieldName: 'name_rus', value: componentData?.objInputAndChangedData['name'], required: false},
                {fieldName: 'active', value: componentData?.objInputAndChangedData['status'] === 1 ? true : false, required: false},
            ]
            const newData = funcSortedDataByValue(funcFilteredDataByValues(materialColorsData, fieldsCheckValues), 'name_rus')
            setSortedMaterialColorsData(newData)
            if (!newData.find(item => item.id === selectedID)) {
                setSelectedID(null)
            }
        } else {
            setSortedMaterialColorsData([])
            setSelectedID(null)
        }
    },[componentData?.objInputAndChangedData, materialColorsData, isComponentPrepared])
       
    let itemsList;
    if (loadingProcess?.['arrMaterialColors'].status) {
        itemsList = (
            <div style={{position: 'relative', height: '100px'}}>
                <LoadingView myStyleContainer={{backgroundColor: 'rgba(255, 255, 255, 0)'}}/>                            
            </div>            
        )
    } else {
        if (errorMaterialColorsData) {
            itemsList = (
                <div style={{marginTop: '20px', marginLeft: '10px', marginBottom: '10px'}}>
                    Ошибка загрузки данных...
                </div>
            )
        } else {
            itemsList = (
                <>{sortedMaterialColorsData.map((item) => (
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
                            dispatch(setModalProps({componentName: 'CreateNewMaterialColorModal', data: {
                                objChangedData: {
                                    active: true,
                                    vendor: productTypeData?.[0].vendor || null,
                                    product_type: productTypeData?.[0].id || null,
                                    material_type: globalElementID,
                                },
                                objReadOnlyFields: ['active', 'vendor', 'product_type', 'material_type'],
                                qtyFieldsForSavingBtn: 4
                            }}))
                            dispatch(setModalOpen('CreateNewMaterialColorModal'))
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
                        options={[{ id: 1, name: 'Активные' }, { id: 2, name: 'Архив' }]}
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

export default MaterialColorsList