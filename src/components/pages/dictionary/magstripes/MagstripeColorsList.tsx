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
import { IMagstripeColorsData, useGetMagstripeColorsQuery } from "../../../../store/api/magstripeColorApiSlice";
import { useGetMagstripeTracksQuery } from "../../../../store/api/magstripeTrackApiSlice";
import { setModalProps } from "../../../../store/modalData/modalsPropsDataSlice";
import { setModalOpen } from "../../../../store/modalData/modalsSlice";
import { useAllComponentParamsReset } from "../../../hooks/useComponentDataReset";
import useTimeoutManager from "../../../hooks/useTimeoutManager";

interface IMagstripeColorsList {
    setSelectedID: (id: number | null) => void,
    selectedID: number | null
}

const MagstripeColorsList = ({
    setSelectedID,
    selectedID
}: IMagstripeColorsList) => {

    const componentName = "MagstripeColorsList"
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const {loadingProcess, fieldParams, componentData, componentsAPIUpdate} = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: magstripeColorsData, isFetching: isFetchingMagstripeColorsData, error: errorMagstripeColorsData, refetch: refetchMagstripeColorsData} = useGetMagstripeColorsQuery(undefined)
    const {data: vendorsData, isFetching: isFetchingVendorsData, error: errorVendorsData, refetch: refetchVendorsData} = useGetVendorsQuery(undefined)
    const {data: magstripeTracksData, isFetching: isFetchingMagstripeTracksData, error: errorMagstripeTracksData, refetch: refetchMagstripeTracksData} = useGetMagstripeTracksQuery(undefined)
    
    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);
    
    useEffect(() => {
        if (componentsAPIUpdate.includes('magstripeColorsData')) {
            refetchMagstripeColorsData()
            dispatch(deleteComponentsAPIUpdate(['magstripeColorsData']))
        } else if (componentsAPIUpdate.includes('vendorsData')) {
            refetchVendorsData()
            dispatch(deleteComponentsAPIUpdate(['vendorsData']))
        } else if (componentsAPIUpdate.includes('magstripeTracksData')) {
            refetchMagstripeTracksData()
            dispatch(deleteComponentsAPIUpdate(['magstripeTracksData']))
        }
    }, [componentsAPIUpdate]);

    const initFieldParams: IFieldParams = {
        'name': { isRequired: false, type: 'text' },
        'vendor': { isRequired: true, type: 'number' },
        'magstripe_tracks': { isRequired: true, type: 'number' },
        'status': { isRequired: true, type: 'number' }
    }

    useEffect(() => {
        if (!isComponentPrepared) {
            componentPreparing({ loadingFieldsData: ['name', 'vendor', 'magstripe_tracks', 'status', 'arrMagstripeColors'], fieldsParamsData: initFieldParams });
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
            if (!isFetchingMagstripeTracksData) {
                setManagedTimeout(() => {
                    if (!errorMagstripeTracksData) {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['magstripe_tracks']}}))
                    } else {
                        dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: false, fields: ['magstripe_tracks']}}))
                    }
                }, 1000)
            } else {
                dispatch(setLoadingStatus({ componentName, data: { status: true, fields: ['magstripe_tracks']}}))
            }
        }
    }, [isFetchingVendorsData, isFetchingMagstripeTracksData, isComponentPrepared]);

    useEffect(() => {
        if (isComponentPrepared) {
            if (!isFetchingMagstripeColorsData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['arrMagstripeColors']}}))
                }, 1000)
            } else {
                dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['arrMagstripeColors']}}))
            }
        }
    }, [isFetchingMagstripeColorsData, isComponentPrepared]);

    const [sortedMagstripeColorsData, setSortedMagstripeColorsData] = useState<IMagstripeColorsData[]>([])
    
    useEffect(() => {
        if (magstripeColorsData && isComponentPrepared) {
            const fieldsCheckValues = [
                {fieldName: 'name_eng', value: componentData?.objInputAndChangedData['name'], required: false},
                {fieldName: 'vendor', value: componentData?.objInputAndChangedData['vendor'], required: true},
                {fieldName: 'magstripe_tracks', value: componentData?.objInputAndChangedData['magstripe_tracks'], required: true},
                {fieldName: 'active', value: componentData?.objInputAndChangedData['status'] === 1 ? true : false, required: false},
            ]
            const newData = funcSortedDataByValue(funcFilteredDataByValues(magstripeColorsData, fieldsCheckValues), 'name_eng')
            setSortedMagstripeColorsData(newData)
            if (!newData.find(item => item.id === selectedID)) {
                setSelectedID(null)
            }
        } else {
            setSortedMagstripeColorsData([])
            setSelectedID(null)
        }
    },[componentData?.objInputAndChangedData, magstripeColorsData, isComponentPrepared])

    let itemsList;
    if (loadingProcess?.['arrMagstripeColors'].status) {
        itemsList = (
            <div style={{position: 'relative', height: '100px'}}>
                <LoadingView myStyleContainer={{backgroundColor: 'rgba(255, 255, 255, 0)'}}/>                            
            </div>            
        )
    } else {
        if (errorMagstripeColorsData) {
            itemsList = (
                <div style={{marginTop: '20px', marginLeft: '10px', marginBottom: '10px'}}>
                    Ошибка загрузки данных...
                </div>
            )
        } else {
            itemsList = (
                <>{sortedMagstripeColorsData.map((item) => (
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
                            dispatch(setModalProps({componentName: 'CreateNewMagstripeColorModal', data: {
                                objChangedData: {active: true},
                                objReadOnlyFields: ['active'],
                                qtyFieldsForSavingBtn: 1
                            }}))
                            dispatch(setModalOpen('CreateNewMagstripeColorModal'))
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
                        fieldName={'magstripe_tracks'}
                        showName={"name_rus"}
                        title={'Количество дорожек'}
                        value={componentData?.objInputAndChangedData['magstripe_tracks'] as ISelectValue}
                        options={magstripeTracksData}
                        isEmptyOption={true}
                        onChange={(obj) => setValues(obj)}   
                        skeletonLoading={loadingProcess?.['magstripe_tracks']}
                        isRequired={fieldParams?.['magstripe_tracks']?.isRequired}                                    
                    />
                    {itemsList}           
                </ContentBlock>
            </MainInfoBlock>
        )}
    </>)
}

export default MagstripeColorsList