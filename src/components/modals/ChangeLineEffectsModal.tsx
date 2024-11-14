import { useEffect, useState } from "react";
import { MainModalBtnBlock, MainModalMainBlock, MainModalText, MainModalTopBlock, ModalViewBase } from "./ModalViewBase";
import { setModalClose, setModalOpen } from "../../store/modalData/modalsSlice";
import { deleteModalProps, setModalProps } from "../../store/modalData/modalsPropsDataSlice";
import LoadingView from "../loading/LoadingView";
import ButtonMain from "../UI/buttons/ButtonMain";
import ContentBlock from "../blocks/ContentBlock";
import BlockInput from "../UI/fields/BlockInput";
import { IFieldParams, IInputTypes } from "../../store/componentsData/fieldsParamsSlice";
import { deleteAllComponentData, IInputValue, setChangedData, setInputData } from "../../store/componentsData/componentsDataSlice";
import TotalListBlock from "../UI/fields/TotalListBlock";
import BlockCheckBox from "../UI/fields/BlockCheckBox";
import MoveIconButton from "../UI/buttons/MoveIconButton";
import { useEffectStoreData } from "../hooks/useEffectStoreData";
import { useComponentPreparation } from "../hooks/useComponentPreparation";
import { useAllComponentParamsReset } from "../hooks/useComponentDataReset";
import useTimeoutManager from "../hooks/useTimeoutManager";
import { useFieldValueChange } from "../hooks/useFieldValueChange";
import { useDispatch } from "react-redux";
import { effectApi, IEffectsData, useGetEffectsQuery } from "../../store/api/effectApiSlice";
import { setLoadingStatus } from "../../store/componentsData/loadingProcessSlice";
import { funcFilteredDataByValues } from "../functions/funcFilteredDataByValues";
import { funcSortedDataByValue } from "../functions/funcSortedDataByValue";
import { setSavingStatus } from "../../store/componentsData/savingProcessSlice";



const ChangeLineEffectsModal = () => {

    const componentName = 'ChangeLineEffectsModal'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const {modalsPropsData, loadingProcess, fieldParams, componentData, componentInvalidFields, savingProcess, componentsAPIUpdate} = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)
    const dispatch = useDispatch()
    const componentNameFromProps = modalsPropsData?.other?.['componentName'];
    const setValuesOutside = useFieldValueChange(componentNameFromProps)


    const {data: effectsData, isFetching: isFetchingEffectsData, error: errorEffectsData, refetch: refetchEffectsData} = useGetEffectsQuery(
        { product_type: modalsPropsData?.other?.product_type as number },
        {
            skip: !modalsPropsData?.other?.product_type,
            selectFromResult: ({ data, ...other }) => ({
                data: modalsPropsData?.other?.product_type ? data : [],
                ...other
            })
        }
    )

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    const initFieldParams: IFieldParams = {
        'all_effects_search': {isRequired: false, type: 'text'},
        'all': {isRequired: false, type: 'array'},
        'current_effects_search': {isRequired: false, type: 'text'},
        'current_effects': {isRequired: false, type: 'array'},
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: Object.keys(initFieldParams)}}))
        if (isComponentPrepared) {
            setManagedTimeout(() => {
                dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: Object.keys(initFieldParams)}}))
            }, 1000) 
        }
    }, [isComponentPrepared]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['all_effects_search', 'all']}}))
        if (isComponentPrepared) {
            if (!isFetchingEffectsData) {
                if (!errorEffectsData && effectsData) {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['all_effects_search', 'all']}}))
                    }, 1000)  
                } else {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['all_effects_search', 'all']}}))
                    }, 1000)
                }
            }
        }
    }, [isComponentPrepared, effectsData, isFetchingEffectsData]); 

    useEffect(() => {
        if (modalsPropsData?.objInputData) {
            dispatch(setInputData({componentName, data: modalsPropsData.objInputData}))
        }
        if (modalsPropsData?.objChangedData) {
            dispatch(setChangedData({componentName, data: modalsPropsData.objChangedData}))
        }
    }, [isComponentPrepared]);
    
    // Список текущих эффектов
        const [arrCurrentEffectItems, setArrCurrentEffectItems] = useState<IEffectsData[]>([])
        useEffect(() => {
            const data = componentData?.objInputAndChangedData['current_effects'] || []
            const searchValue: string = componentData?.objChangedData['current_effects_search'] as string || ''
            if (data) {
                if (typeof data === 'object') {
                    const currentList: number[] = data as number[]

                    const convertedArr = currentList.map(id => effectsData?.find(item => item.id === id)).filter(item => item !== undefined) || [] as any[]

                    const checkValues = [
                        {fieldName: 'name_rus', value: searchValue.toLocaleLowerCase(), required: false}
                    ]
                    const effectItemsConverted = funcFilteredDataByValues(convertedArr, checkValues)
                    const sortedItems = funcSortedDataByValue(effectItemsConverted, 'name_rus')

                    setArrCurrentEffectItems(sortedItems)
                } else {
                    setArrCurrentEffectItems([])
                }
            } else {
                setArrCurrentEffectItems([])
            }
        },[componentData?.objInputAndChangedData['current_effects'], componentData?.objChangedData['current_effects_search']])

    // Список всех входных эффектов
        const [arrAllEffectsFiltered, setArrAllEffectsFiltered] = useState<IEffectsData[]>([])
        useEffect(() => {
            if (effectsData?.length! > 0) {
                const searchValue: string = componentData?.objChangedData['all_effects_search'] as string || ''
                const currentEffects = componentData?.objInputAndChangedData['current_effects'] as number[] || []
                    const checkValues = [
                        {fieldName: 'name_rus', value: searchValue.toLocaleLowerCase(), required: false}
                    ]
                    const effectItemsConverted = funcFilteredDataByValues(effectsData || [], checkValues)
                    const filteredByActive = effectItemsConverted.filter(item => item.active === true)
                    const filteredCurrentItems = filteredByActive.filter(item => !currentEffects.some(match => match === item.id));
                    const sortedCurrentItems = funcSortedDataByValue(filteredCurrentItems, 'name_rus')

                    setArrAllEffectsFiltered(sortedCurrentItems)
            } else {
                setArrAllEffectsFiltered([])
            }
        },[
            effectsData, 
            componentData?.objInputAndChangedData['current_effects'], 
            componentData?.objChangedData['all_effects_search']
        ])

    // Список с выбранными эффектами из таблицы
        const [selectedItems, setSelectedItems] = useState<{fieldName: string, data: number[]}[]>([])

    // Функция выбора определенного чекбокса
        function handleEffectItem (fieldName: string, e: React.ChangeEvent<HTMLInputElement>) {
            const isChecked = e.target.checked;

            if (isChecked) {
                setSelectedItems((prevItems) => {
                    const index = prevItems.findIndex((item) => item.fieldName === fieldName);
            
                    if (index !== -1) {
                        const updatedItems = [...prevItems];
                        updatedItems[index] = {
                            ...updatedItems[index],
                            data: [...updatedItems[index].data, +e.target.value]
                        };
                        return updatedItems;
                    } else {
                        return [...prevItems, { fieldName: fieldName, data: [+e.target.value]}];
                    }
                });
            } else {
                setSelectedItems((prevItems) => {
                    const index = prevItems.findIndex((item) => item.fieldName === fieldName);
            
                    if (index !== -1) {
                        const updatedItems = [...prevItems];
                        updatedItems[index] = {
                            ...updatedItems[index],
                            data: updatedItems[index].data.filter((item) => item !== +e.target.value)
                        };
                        return updatedItems;
                    } else {
                        return prevItems;
                    }
                });             
            }
        } 

    // Перемещение из блока в блок
        function funcMoveToBlockList (direction: 'to' | 'from', state: 'current_effects') {
                    
            let filteredSelectItems = []
            if (direction === 'to') {
                filteredSelectItems = selectedItems.filter(item => item.fieldName === 'all')
            } else {
                filteredSelectItems = selectedItems.filter(item => item.fieldName === state)
            }

            if (filteredSelectItems.length > 0 && filteredSelectItems[0].data) {
                const filteredSelectItemsData: number[] = filteredSelectItems[0].data

                funcSetLocalChangedData(direction, filteredSelectItemsData)

                setSelectedItems((prevData) => {

                    let index: number = -1
                    if (direction === 'to') {
                        index = prevData.findIndex((item) => item.fieldName === 'all');
                    } else {
                        index = prevData.findIndex((item) => item.fieldName === state);
                    }

                    if (index !== -1) {
                        const updatedItems = [...prevData];
                        updatedItems[index] = {
                            ...updatedItems[index],
                            data: [],
                        };
                        return updatedItems;
                    } else {
                        return prevData;
                    }
                });
            }
        }

    // Настройка локального хранилища перед сохранением
        function funcSetLocalChangedData (direction: 'to' | 'from', filteredSelectItemsData: number[] ) {

            const previousData: number[] = componentData?.objInputAndChangedData['current_effects'] as number[] || [];
            let newData: number[] = [];

            if (direction === 'to') {
                newData = Array.from(new Set([...filteredSelectItemsData, ...previousData]))
            } else {
                for (let i = 0; i < previousData.length; i++) {
                    if (!filteredSelectItemsData.includes(previousData[i])) {
                        newData.push(+previousData[i])
                    }
                }
            }
            setValues({name: 'current_effects', value: newData})
        }

    // Функция сохранения
        const funcSaveEffect = () => {
            const localData = componentData?.objInputAndChangedData['current_effects'] as number[] || []
            if (componentNameFromProps && localData) {
                dispatch(setSavingStatus({componentName, data: {status: true}}))

                setValuesOutside({name: 'product_effects', value: localData})

                dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: true}}))
                dispatch(deleteAllComponentData({componentName}))
                setManagedTimeout(() => { 
                    dispatch(setSavingStatus({ componentName, data: { status: false } }))
                    dispatch(setModalClose(componentName))
                    dispatch(deleteModalProps({componentName}))
                    dispatch(effectApi.util.resetApiState())
                }, 1000)
            }
        }    


    return (<>
        {isComponentPrepared && (<>
            <ModalViewBase
                myStyleContext={{ }} 
                onClick={() => {
                    dispatch(setModalClose(componentName))
                    dispatch(deleteModalProps({componentName}))
                    dispatch(effectApi.util.resetApiState())
                }}
                 onOverlayClick={false}
            >
                {savingProcess?.status && 
                    <LoadingView
                        isSuccessful={savingProcess.isSuccessful} 
                        errorMessage={savingProcess.message} 
                        componentName={componentName} 
                    />
                } 
                <MainModalTopBlock>
                    <div style={{width: '240px'}}></div>
                    <MainModalText modalTitle={'Изменение списка эффектов'}/>
                    <MainModalBtnBlock myStyleBtnBlock={{width: '240px'}}>
                        <ButtonMain
                            onClick={() => {
                                dispatch(setModalProps({componentName: 'CreateNewEffectModal', data: {
                                    objChangedData: {
                                        active: true,
                                        vendor: modalsPropsData?.other?.vendor || null,
                                        product_type: modalsPropsData?.other?.product_type || null
                                    },
                                    objReadOnlyFields: ['active', 'vendor', 'product_type'],
                                    qtyFieldsForSavingBtn: 1
                                }}))
                                dispatch(setModalOpen('CreateNewEffectModal'))
                            }}
                            type={'other'}
                            title={'Добавить'}  
                            color={'gray'}
                            myStyle={{width: '100px'}}
                        />
                        {
                            componentData?.objChangedData && Object.keys(componentData.objChangedData).length > 0 &&
                            <ButtonMain
                                onClick={funcSaveEffect}
                                type="submit"
                                title="Далее"
                                myStyle={{width: '100px'}}
                            />
                        }
                        <ButtonMain 
                            onClick={() => {
                                dispatch(setModalClose(componentName))
                                dispatch(deleteModalProps({componentName}))
                                dispatch(effectApi.util.resetApiState())
                            }}
                            type="resetIcon" 
                        />
                    </MainModalBtnBlock>
                </MainModalTopBlock>

                <MainModalMainBlock myStyleMainBlock={{ display: 'flex', minHeight: '250px', width: '1000px', overflowY: 'hidden'}}>
                    <div style={{display: 'flex', width: '100%'}}>
                        <ContentBlock title={'Общий список эффектов'} myStyleMain={{}}>
                            <BlockInput
                                onChange={(obj) => setValues(obj)}
                                fieldName={'all_effects_search'}
                                title={'Название для отображения (eng)'}
                                type={fieldParams?.['all_effects_search']?.type as IInputTypes}
                                value={componentData?.objInputAndChangedData['all_effects_search'] as IInputValue}
                                placeholder={'Начните вводить текст...'}
                                skeletonLoading={loadingProcess?.['all_effects_search']}
                                isRequired={false}
                                isReadOnly={false}
                                isChanged={false}
                            >
                                {componentData?.objInputAndChangedData['all_effects_search'] && 
                                    <ButtonMain 
                                        onClick={() => setValues({name: 'all_effects_search', value: ''})} 
                                        type="resetIcon" 
                                    />
                                }
                            </BlockInput>  
                            <TotalListBlock
                                fieldName={'all'}
                                isReadOnly={false}
                                isChanged={false}
                                myStyleListBox={{ height: '300px' }}
                                skeletonLoading={loadingProcess?.['all']}
                            >
                                {arrAllEffectsFiltered.length > 0 && arrAllEffectsFiltered.map((item) => (
                                    item.id && (
                                    <BlockCheckBox
                                        key={item.id} 
                                        fieldName={'all'}
                                        checked={selectedItems.find(select => select.fieldName === 'all')?.data}
                                        id={item.id}
                                        title={item.name_rus}
                                        isReadOnly={false}
                                        onChange={handleEffectItem}
                                    />
                                    )
                                ))}
                            </TotalListBlock>                 
                        </ContentBlock>
                        <div style={{ display: 'block', marginTop: '80px', padding: 'auto' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                                <div style={{height: '70px'}}>
                                    <MoveIconButton
                                        isListEmpty={selectedItems}
                                        fieldName={'all'}
                                        onClick={() => funcMoveToBlockList('to', 'current_effects')}
                                        direction={'right'}
                                    />
                                    <div style={{ marginBottom: '20px' }}></div>
                                    <MoveIconButton
                                        isListEmpty={selectedItems}
                                        fieldName={'current_effects'}
                                        onClick={() => funcMoveToBlockList('from', 'current_effects')}
                                        direction={'left'}
                                    />
                                </div>
                            </div>
                        </div>
                        <ContentBlock title={'Текущие эффекты'} myStyleMain={{}}>
                            <BlockInput
                                onChange={(obj) => setValues(obj)}
                                fieldName={'current_effects_search'}
                                title={'Название для отображения (eng)'}
                                type={fieldParams?.['current_effects_search']?.type as IInputTypes}
                                value={componentData?.objInputAndChangedData['current_effects_search'] as IInputValue}
                                placeholder={'Начните вводить текст...'}
                                skeletonLoading={loadingProcess?.['current_effects_search']}
                                isRequired={false}
                                isReadOnly={false}
                                isChanged={false}
                            >
                                {componentData?.objInputAndChangedData['current_effects_search'] && 
                                    <ButtonMain 
                                        onClick={() => setValues({name: 'current_effects_search', value: ''})} 
                                        type="resetIcon" 
                                    />
                                }
                            </BlockInput> 
                            <TotalListBlock
                                fieldName={'current_effects'}
                                isReadOnly={false}
                                isChanged={false}
                                myStyleListBox={{ height: '300px' }}
                                skeletonLoading={loadingProcess?.['current_effects']}
                            >
                                {arrCurrentEffectItems.length > 0 && arrCurrentEffectItems.map((item) => (
                                    item.id && (
                                    <BlockCheckBox
                                        key={item.id} 
                                        fieldName={'current_effects'}
                                        checked={selectedItems.find(select => select.fieldName === 'current_effects')?.data}
                                        id={item.id}
                                        title={item.name_rus}
                                        isReadOnly={false}
                                        onChange={handleEffectItem}
                                    />
                                    )
                                ))}
                            </TotalListBlock> 
                        </ContentBlock>
                    </div>
                </MainModalMainBlock>
            </ModalViewBase>
        </>)}
    </>)
}

export default ChangeLineEffectsModal