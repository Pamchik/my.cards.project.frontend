import { useEffect, useState } from "react";
import { MainModalBtnBlock, MainModalMainBlock, MainModalText, MainModalTopBlock, ModalViewBase } from "./ModalViewBase";
import { setModalClose } from "../../store/modalData/modalsSlice";
import { deleteModalProps } from "../../store/modalData/modalsPropsDataSlice";
import LoadingView from "../loading/LoadingView";
import ButtonMain from "../UI/buttons/ButtonMain";
import ContentBlock from "../blocks/ContentBlock";
import BlockInput from "../UI/fields/BlockInput";
import { IFieldParams, IInputTypes } from "../../store/componentsData/fieldsParamsSlice";
import { deleteAllComponentData, IInputValue, setChangedData, setInputData } from "../../store/componentsData/componentsDataSlice";
import TotalListBlock, { IListBlock } from "../UI/fields/TotalListBlock";
import BlockCheckBox from "../UI/fields/BlockCheckBox";
import MoveIconButton from "../UI/buttons/MoveIconButton";
import { useEffectStoreData } from "../hooks/useEffectStoreData";
import { useComponentPreparation } from "../hooks/useComponentPreparation";
import { useAllComponentParamsReset } from "../hooks/useComponentDataReset";
import useTimeoutManager from "../hooks/useTimeoutManager";
import { useFieldValueChange } from "../hooks/useFieldValueChange";
import { useDispatch } from "react-redux";
import { effectApi } from "../../store/api/effectApiSlice";
import { setLoadingStatus } from "../../store/componentsData/loadingProcessSlice";
import { funcFilteredDataByValues } from "../functions/funcFilteredDataByValues";
import { funcSortedDataByValue } from "../functions/funcSortedDataByValue";
import { setSavingStatus } from "../../store/componentsData/savingProcessSlice";
import { functionErrorMessage } from "../functions/functionErrorMessage";



const ChangeLineItemsModal = () => {

    const componentName = 'ChangeLineItemsModal'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const {modalsPropsData, loadingProcess, fieldParams, componentData, componentInvalidFields, savingProcess, componentsAPIUpdate} = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)
    const dispatch = useDispatch()
    const componentNameFromProps = modalsPropsData?.other?.['componentName'];
    const setValuesOutside = useFieldValueChange(componentNameFromProps)

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    const initFieldParams: IFieldParams = {
        'all_items_search': {isRequired: false, type: 'text'},
        'all_items': {isRequired: false, type: 'array'},
        'current_items_search': {isRequired: false, type: 'text'},
        'current_items': {isRequired: false, type: 'array'},
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
        if (modalsPropsData?.objInputData) {
            dispatch(setInputData({componentName, data: modalsPropsData.objInputData}))
        }
        if (modalsPropsData?.objChangedData) {
            dispatch(setChangedData({componentName, data: modalsPropsData.objChangedData}))
        }
    }, [isComponentPrepared]);
    
    // Список текущих позиций
        const [arrCurrentItems, setArrCurrentItems] = useState<IListBlock[]>([])
        useEffect(() => {
            const data = componentData?.objInputAndChangedData['current_items'] || []
            const searchValue: string = componentData?.objChangedData['current_items_search'] as string || ''
            if (data) {
                if (typeof data === 'object') {
                    const checkValues = [
                        {fieldName: 'name', value: searchValue.toLocaleLowerCase(), required: false}
                    ]
                    const filteredItemsBySearch = funcFilteredDataByValues(data, checkValues)
                    const sortedItems = funcSortedDataByValue(filteredItemsBySearch, 'name')
                    setArrCurrentItems(sortedItems)
                } else {
                    setArrCurrentItems([])
                }
            } else {
                setArrCurrentItems([])
            }
        },[componentData?.objInputAndChangedData['current_items'], componentData?.objChangedData['current_items_search']])

    // Список всех входных эффектов
        const [arrAllItemsFiltered, setArrAllItemsFiltered] = useState<IListBlock[]>([])
        useEffect(() => {
            const allData = modalsPropsData?.other?.['all_items'] || []
            if (allData.length! > 0) {
                const searchValue: string = componentData?.objChangedData['all_items_search'] as string || ''
                const currentEffects = componentData?.objInputAndChangedData['current_items'] as IListBlock[] || []
                const checkValues = [
                    {fieldName: 'name', value: searchValue.toLocaleLowerCase(), required: false}
                ]
                const filteredItemsBySearch = funcFilteredDataByValues(allData || [], checkValues)
                const filteredCurrentItems = filteredItemsBySearch.filter(item => !currentEffects.some(match => match.id === item.id));
                const sortedCurrentItems = funcSortedDataByValue(filteredCurrentItems, 'name')

                setArrAllItemsFiltered(sortedCurrentItems)
            } else {
                setArrAllItemsFiltered([])
            }
        },[
            componentData?.objInputAndChangedData['all_items'], 
            componentData?.objInputAndChangedData['current_items'], 
            componentData?.objChangedData['all_items_search']
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
        function funcMoveToBlockList (direction: 'to' | 'from', state: 'current_items') {
                    
            let filteredSelectItems = []
            if (direction === 'to') {
                filteredSelectItems = selectedItems.filter(item => item.fieldName === 'all_items')
            } else {
                filteredSelectItems = selectedItems.filter(item => item.fieldName === state)
            }

            if (filteredSelectItems.length > 0 && filteredSelectItems[0].data) {
                const filteredSelectItemsData: number[] = filteredSelectItems[0].data

                funcSetLocalChangedData(direction, filteredSelectItemsData)

                setSelectedItems((prevData) => {

                    let index: number = -1
                    if (direction === 'to') {
                        index = prevData.findIndex((item) => item.fieldName === 'all_items');
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
            const previousDataObject: IListBlock[] = componentData?.objInputAndChangedData['current_items'] as IListBlock[] || []
            const previousData: number[] = previousDataObject.map(item => item.id)
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
            const allData = modalsPropsData?.other?.['all_items'] as IListBlock[] || []
            const allDataObj = allData.filter(item => newData.includes(item.id))
            setValues({name: 'current_items', value: allDataObj})
        }

    // Функция сохранения
        const funcSaveEffect = () => {
            const localData = componentData?.objInputAndChangedData['current_items'] as IListBlock[] || []
            const isEmpty = localData.length === 0
            const receivedData = modalsPropsData?.objInputData?.['current_items'] as IListBlock[] || []
            const receivedIDs: number[] = receivedData?.map(item => item.id)
            const localDataIDs: number[] = localData.map(item => item.id)
            const isAll = receivedIDs.length === localDataIDs.length && receivedIDs.sort().toString() === localDataIDs.sort().toString()
            
            dispatch(setSavingStatus({componentName, data: {status: true}}))
            if (isEmpty) {
                const message = functionErrorMessage({data: 'Не выбрано ни одно поле'})
                dispatch(setSavingStatus({ componentName, data: { status: true, isSuccessful: false, message: message} }))
            } else {
                if (componentNameFromProps && localData && modalsPropsData?.other?.['field']) {
                    dispatch(setSavingStatus({componentName, data: {status: true}}))
                    if (isAll) {
                        setValuesOutside({name: modalsPropsData?.other?.['field'], value: 'all'})  
                    } else {
                        setValuesOutside({name: modalsPropsData?.other?.['field'], value: localData})    
                    }
                    dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: true}}))
                    dispatch(deleteAllComponentData({componentName}))
                    setManagedTimeout(() => { 
                        dispatch(setSavingStatus({ componentName, data: { status: false } }))
                        dispatch(setModalClose(componentName))
                        dispatch(deleteModalProps({componentName}))
                    }, 1000)
                } else {
                    const message = functionErrorMessage({data: 'Неверно переданы поля, обновите страницу'})
                    dispatch(setSavingStatus({ componentName, data: { status: true, isSuccessful: false, message: message} }))
                }            
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
                    <MainModalText modalTitle={modalsPropsData?.other?.['title']}/>
                    <MainModalBtnBlock myStyleBtnBlock={{width: '240px'}}>
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
                        <ContentBlock title={'Общий список'} myStyleMain={{}}>
                            <BlockInput
                                onChange={(obj) => setValues(obj)}
                                fieldName={'all_items_search'}
                                title={'Название'}
                                type={fieldParams?.['all_effects_search']?.type as IInputTypes}
                                value={componentData?.objInputAndChangedData['all_items_search'] as IInputValue}
                                placeholder={'Начните вводить текст...'}
                                skeletonLoading={loadingProcess?.['all_items_search']}
                                isRequired={false}
                                isReadOnly={false}
                                isChanged={false}
                            >
                                {componentData?.objInputAndChangedData['all_items_search'] && 
                                    <ButtonMain 
                                        onClick={() => setValues({name: 'all_items_search', value: ''})} 
                                        type="resetIcon" 
                                    />
                                }
                            </BlockInput>  
                            <TotalListBlock
                                fieldName={'all_items'}
                                isReadOnly={false}
                                isChanged={false}
                                myStyleListBox={{ height: '300px' }}
                                skeletonLoading={loadingProcess?.['all_items']}
                            >
                                {arrAllItemsFiltered.length > 0 && arrAllItemsFiltered.map((item) => (
                                    item.id && (
                                    <BlockCheckBox
                                        key={item.id} 
                                        fieldName={'all_items'}
                                        checked={selectedItems.find(select => select.fieldName === 'all_items')?.data}
                                        id={item.id}
                                        title={item.name}
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
                                        fieldName={'all_items'}
                                        onClick={() => funcMoveToBlockList('to', 'current_items')}
                                        direction={'right'}
                                    />
                                    <div style={{ marginBottom: '20px' }}></div>
                                    <MoveIconButton
                                        isListEmpty={selectedItems}
                                        fieldName={'current_items'}
                                        onClick={() => funcMoveToBlockList('from', 'current_items')}
                                        direction={'left'}
                                    />
                                </div>
                            </div>
                        </div>
                        <ContentBlock title={'Текущий список'} myStyleMain={{}}>
                            <BlockInput
                                onChange={(obj) => setValues(obj)}
                                fieldName={'current_items_search'}
                                title={'Название'}
                                type={fieldParams?.['current_items_search']?.type as IInputTypes}
                                value={componentData?.objInputAndChangedData['current_items_search'] as IInputValue}
                                placeholder={'Начните вводить текст...'}
                                skeletonLoading={loadingProcess?.['current_items_search']}
                                isRequired={false}
                                isReadOnly={false}
                                isChanged={false}
                            >
                                {componentData?.objInputAndChangedData['current_items_search'] && 
                                    <ButtonMain 
                                        onClick={() => setValues({name: 'current_items_search', value: ''})} 
                                        type="resetIcon" 
                                    />
                                }
                            </BlockInput> 
                            <TotalListBlock
                                fieldName={'current_items'}
                                isReadOnly={false}
                                isChanged={false}
                                myStyleListBox={{ height: '300px' }}
                                skeletonLoading={loadingProcess?.['current_items']}
                            >
                                {arrCurrentItems.length > 0 && arrCurrentItems.map((item) => (
                                    item.id && (
                                    <BlockCheckBox
                                        key={item.id} 
                                        fieldName={'current_items'}
                                        checked={selectedItems.find(select => select.fieldName === 'current_items')?.data}
                                        id={item.id}
                                        title={item.name}
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

export default ChangeLineItemsModal