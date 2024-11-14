import { useEffect, useState } from "react";
import { useEffectStoreData } from "../../../hooks/useEffectStoreData";
import { useComponentPreparation } from "../../../hooks/useComponentPreparation";
import { useFieldValueChange } from "../../../hooks/useFieldValueChange";
import { useDispatch } from "react-redux";
import { useAddEffectMatchingMutation, useGetEffectMatchingQuery, useGetEffectsMatchingQuery, useUpdateEffectMatchingMutation } from "../../../../store/api/effectsMatchingApiSlice";
import { IEffectsData, useGetEffectsQuery } from "../../../../store/api/effectApiSlice";
import { deleteComponentsAPIUpdate } from "../../../../store/componentsData/componentsAPIUpdateSlice";
import { IFieldParams } from "../../../../store/componentsData/fieldsParamsSlice";
import { setLoadingStatus } from "../../../../store/componentsData/loadingProcessSlice";
import { funcConvertToFieldDataType } from "../../../functions/funcConvertToFieldDataType";
import { deleteAllComponentData, deleteChangedComponentData, setInputData } from "../../../../store/componentsData/componentsDataSlice";
import { setSavingStatus } from "../../../../store/componentsData/savingProcessSlice";
import { deleteFieldInvalid } from "../../../../store/componentsData/fieldsInvalidSlice";
import { functionErrorMessage } from "../../../functions/functionErrorMessage";
import { changeComponentReadOnly } from "../../../../store/componentsData/componentsReadOnlySlice";
import BtnBlock from "../../../blocks/BtnBlock";
import ButtonMain from "../../../UI/buttons/ButtonMain";
import ContentBlock from "../../../blocks/ContentBlock";
import TotalListBlock from "../../../UI/fields/TotalListBlock";
import BlockCheckBox from "../../../UI/fields/BlockCheckBox";
import MoveIconButton from "../../../UI/buttons/MoveIconButton";
import { useAllComponentParamsReset } from "../../../hooks/useComponentDataReset";
import useTimeoutManager from "../../../hooks/useTimeoutManager";

interface IEffectMatching {
    globalElementID: number
}

const EffectMatching = ({
    globalElementID
}: IEffectMatching) => {

    const componentName = 'EffectMatching'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const { loadingProcess, fieldParams, componentData, componentReadOnly, componentInvalidFields, savingProcess, componentsAPIUpdate } = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: effectMatchingData, isFetching: isFetchingEffectMatchingData, error: errorEffectMatchingData, refetch: refetchEffectMatchingData} = useGetEffectMatchingQuery({effect: globalElementID})
    const {data: effectsMatchingData, isFetching: isFetchingEffectsMatchingData, error: errorEffectsMatchingData, refetch: refetchEffectsMatchingData} = useGetEffectsMatchingQuery(undefined)
    const {data: effectsData, isFetching: isFetchingEffectsData, error: errorEffectsData, refetch: refetchEffectsData} = useGetEffectsQuery(undefined)
    const [updateEffectMatching, {}] = useUpdateEffectMatchingMutation()
    const [addEffectMatching, {}] = useAddEffectMatchingMutation()

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    useEffect(() => {
        if (componentsAPIUpdate.includes('effectMatchingData')) {
            refetchEffectMatchingData()
            funcChangeCancelSet(true)
            dispatch(deleteComponentsAPIUpdate(['effectMatchingData']))
        } else if (componentsAPIUpdate.includes('effectsData')) {
            refetchEffectsData()
            dispatch(deleteComponentsAPIUpdate(['effectsData']))
        } else if (componentsAPIUpdate.includes('effectsMatchingData')) {
            refetchEffectsMatchingData()
            dispatch(deleteComponentsAPIUpdate(['effectsMatchingData']))
        }
    }, [componentsAPIUpdate]);

    const initFieldParams: IFieldParams = {
        'matches': {isRequired: false, type: 'array'},
        'mismatches': {isRequired: false, type: 'array'},
    }

    useEffect(() => {
        if (!isComponentPrepared) {
            componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
            setIsComponentPrepared(true);
        }
    }, []);

    useEffect(() => {
        funcChangeCancelSet(true)
        setSelectedItems([])
        setLocalChangedData([])
    }, [globalElementID]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: Object.keys(initFieldParams)}}))
        if (isComponentPrepared) {
            if (isFetchingEffectMatchingData || isFetchingEffectsData || isFetchingEffectsMatchingData) {
                dispatch(setLoadingStatus({componentName, data: {status: true, fields: Object.keys(initFieldParams)}}))
            } else {
                if (!errorEffectMatchingData && effectMatchingData && !errorEffectsData && !errorEffectsMatchingData && effectsMatchingData) {
                    const myData = funcConvertToFieldDataType(effectMatchingData[0])
                    dispatch(setInputData({componentName, data: myData}))
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: [
                            'matches', 
                            'mismatches',
                        ]}}))
                    }, 1000)  
                } else {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: Object.keys(initFieldParams)}}))
                    }, 1000)
                }
            }
        }
    }, [globalElementID, isComponentPrepared, effectMatchingData, isFetchingEffectMatchingData, isFetchingEffectsData, isFetchingEffectsMatchingData]);

    useEffect(() => {
        funcChangeCancelSet(true)
    }, [globalElementID]);

    async function funcSaveFields () {
        dispatch(setSavingStatus({componentName, data: {status: true}}))
        for (let i = 0; i < localChangedData.length; i++) {
            const currentMatchedItem = effectsMatchingData?.filter(item => item.effect === localChangedData[i].effect)
            const currentID = currentMatchedItem?.length! > 0 ? currentMatchedItem?.[0].id as number : undefined

            if (currentID) {
                dispatch(deleteFieldInvalid({componentName}))
                const myData = localChangedData[i]
                await updateEffectMatching({...myData, id: currentID}).unwrap()    
                .then((res) => {
                    dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: true}}))
                    dispatch(deleteAllComponentData({componentName}))
                    funcChangeCancelSet(true)
                    setManagedTimeout(() => { 
                        dispatch(setSavingStatus({ componentName, data: { status: false } }))
                    }, 1000)  
                }).catch((error) => {
                    const message = functionErrorMessage(error)
                    dispatch(setSavingStatus({ componentName, data: { status: true, isSuccessful: false, message: message} }))
                })
            } else {
                dispatch(deleteFieldInvalid({componentName}))
                const myData = localChangedData[i]
                await addEffectMatching({...myData}).unwrap()    
                .then((res) => {
                    dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: true}}))
                    dispatch(deleteAllComponentData({componentName}))
                    funcChangeCancelSet(true)
                    setManagedTimeout(() => { 
                        dispatch(setSavingStatus({ componentName, data: { status: false } }))
                    }, 1000)  
                }).catch((error) => {
                    const message = functionErrorMessage(error)
                    dispatch(setSavingStatus({ componentName, data: { status: true, isSuccessful: false, message: message} }))
                })
            }
        }
    }   

    function funcChangeCancelSet(newStatus: boolean) {
        dispatch(deleteChangedComponentData({componentName}))
        dispatch(changeComponentReadOnly({componentName, newStatus}))
        dispatch(deleteFieldInvalid({componentName}))            
    }

    const [matchesItems, setMatchesItems] = useState<IEffectsData[]>([])
    const [mismatchesItems, setMismatchesItems] = useState<IEffectsData[]>([])

    useEffect(() => {
        if (componentData?.objInputAndChangedData && effectsData) {
            if (componentData?.objInputAndChangedData['matches']) {
                const currentList: number[] = componentData.objInputAndChangedData['matches'] as number[]
                
                const arr = currentList.map(id => effectsData.find(item => item.id === id)).filter(item => item !== undefined) as any[]

                setMatchesItems(arr)
            } else {
                setMatchesItems([])
            }

            if (componentData?.objInputAndChangedData['mismatches']) {
                const currentList: number[] = componentData.objInputAndChangedData['mismatches'] as number[]
                
                const arr = currentList.map(id => effectsData.find(item => item.id === id)).filter(item => item !== undefined) as any[]

                setMismatchesItems(arr)
            } else {
                setMismatchesItems([])
            }                      
        } else {
            setMatchesItems([])
            setMismatchesItems([])
        }
    }, [componentData?.objInputAndChangedData]);

    const [allEffectsFiltered, setAllEffectsFiltered] = useState<IEffectsData[]>([])

    useEffect(() => {
        const currentLineByID = effectsData?.find(item => item.id === globalElementID)
        if (currentLineByID) {
            const productTypeID = currentLineByID.product_type
            if (effectsData) {
                const filteredByActive = effectsData.filter(item => item.active === true)
                const filteredByProductAndSelectedID = filteredByActive.filter(item => item.product_type === productTypeID && item.id !== globalElementID)
                const filteredMatchesItems = filteredByProductAndSelectedID.filter(item => !matchesItems.some(match => match.id === item.id));
                const filteredMismatchesItems = filteredMatchesItems.filter(item => !mismatchesItems.some(mismatch => mismatch.id === item.id));
                setAllEffectsFiltered(filteredMismatchesItems)
            }                
        }
    },[effectsData, matchesItems, mismatchesItems])

    const [selectedItems, setSelectedItems] = useState<{fieldName: string, data: number[]}[]>([])

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

    function funcMoveToBlockList (direction: 'to' | 'from', state: 'matches' | 'mismatches') {
        let filteredSelectItems = []
        if (direction === 'to') {
            filteredSelectItems = selectedItems.filter(item => item.fieldName === 'all')
        } else {
            filteredSelectItems = selectedItems.filter(item => item.fieldName === state)
        }

        if (filteredSelectItems.length > 0 && filteredSelectItems[0].data) {
            const filteredSelectItemsData: number[] = filteredSelectItems[0].data

            funcSetLocalChangedData(globalElementID, direction, state, filteredSelectItemsData)

            for (let i = 0; i < filteredSelectItemsData.length; i++) {
                funcSetLocalChangedData(filteredSelectItemsData[i], direction, state, [globalElementID])
            }

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

    function funcSetLocalChangedData (id: number, direction: 'to' | 'from', state: 'matches' | 'mismatches', filteredSelectItemsData: number[] ) {

        let previousMatchingData: number[] = [];

        let localPreviousMatchingExist = false
        const localPreviousMatchingIndex = localChangedData.length > 0 ? localChangedData.findIndex(item => item.effect === id) : -1

        if (localPreviousMatchingIndex !== -1) {
            if (localChangedData[localPreviousMatchingIndex].hasOwnProperty(state)) {
                localPreviousMatchingExist = true
            } else {
                localPreviousMatchingExist = false
            }
        } else {
            localPreviousMatchingExist = false
        }

        let globalPreviousMatchingExist = false
        const globalPreviousMatchingIndex = effectsMatchingData?.length! > 0 ? effectsMatchingData?.findIndex(item => item.effect === id) : -1

        if (globalPreviousMatchingIndex !== -1 && globalPreviousMatchingIndex !== undefined) {
            if (effectsMatchingData?.[globalPreviousMatchingIndex].hasOwnProperty(state)) {
                globalPreviousMatchingExist = true
            } else {
                globalPreviousMatchingExist = false
            }
        } else {
            globalPreviousMatchingExist = false
        }

        if (localPreviousMatchingExist) {
            previousMatchingData = localChangedData[localPreviousMatchingIndex][state] as number[]
        } else {
            if (globalPreviousMatchingExist && globalPreviousMatchingIndex !== undefined) {
                previousMatchingData = effectsMatchingData?.[globalPreviousMatchingIndex][state] as number[]
            } else {
                previousMatchingData = []
            }
        }

        let newMatchingData: number[] = [];
        if (direction === 'to') {
            newMatchingData = Array.from(new Set([...filteredSelectItemsData, ...previousMatchingData]))
        } else {
            for (let i = 0; i < previousMatchingData.length; i++) {
                if (!filteredSelectItemsData.includes(previousMatchingData[i])) {
                    newMatchingData.push(+previousMatchingData[i])
                }
            }
        }

        setLocalChangedData((prevData) => {
            const index = prevData.findIndex((item) => item.effect === id);
            if (index !== -1) {
                const updatedData = [...prevData];
                updatedData[index] = {
                    ...updatedData[index],
                    [state]: [...newMatchingData]
                }
                return updatedData;
            } else {
                const updatedData = [...prevData, {effect: id, [state]: [...newMatchingData]}];
                return updatedData;
            }
        })

        if (id === globalElementID) {
            setValues({name: state, value: [...newMatchingData]})
        }
    }

    const [localChangedData, setLocalChangedData] = useState<{effect: number, matches?: number[], mismatches?: number[]}[]>([])



    return (<>
            {isComponentPrepared && (<>
                <BtnBlock>
                    {
                        componentData?.objChangedData && Object.keys(componentData.objChangedData).length > 0 && 
                        <ButtonMain
                            onClick={funcSaveFields} 
                            type={'submit'} 
                            title={'Сохранить'}
                        />
                    }
                    <ButtonMain 
                        onClick={() => funcChangeCancelSet(componentReadOnly?.status ? false : true)} 
                        type={'other'} 
                        color={'gray'}
                        myStyle={{width: '120px'}} 
                        title={!componentReadOnly?.status ? 'Отмена' : 'Редактировать'}
                    />                 
                </BtnBlock>
                <ContentBlock>
                    {componentReadOnly?.status 
                    ?   
                        (
                            <div style={{display: 'flex'}}>
                                <ContentBlock line={true} title={'Сочитающиеся эффекты'}>
                                    <TotalListBlock
                                        fieldName={'matches'}
                                        isReadOnly={true}
                                        skeletonLoading={loadingProcess?.['matches']}
                                        myStyleListBox={{ height: '300px' }}
                                    >
                                        {matchesItems.map((item) => (
                                            item.id && (
                                            <BlockCheckBox
                                                key={item.id} 
                                                id={item.id}
                                                title={item.name_rus}
                                                isReadOnly={true}
                                            />   
                                            )                 
                                        ))}
                                    </TotalListBlock>
                                </ContentBlock>
                                <ContentBlock title={'Несочитающиеся эффекты'}>
                                    <TotalListBlock
                                        fieldName={'mismatches'}
                                        isReadOnly={true}
                                        skeletonLoading={loadingProcess?.['mismatches']}
                                        myStyleListBox={{ height: '300px' }}
                                    >
                                        {mismatchesItems.map((item) => (
                                            item.id && (
                                            <BlockCheckBox
                                                key={item.id} 
                                                id={item.id}
                                                title={item.name_rus}
                                                isReadOnly={true}
                                            />   
                                            )                 
                                        ))}
                                    </TotalListBlock>
                                </ContentBlock>
                            </div>
                        )
                    :  
                        (
                            <div style={{display: 'flex'}}>
                                <ContentBlock>
                                    <TotalListBlock
                                        fieldName={'all'}
                                        title={'Все эффекты'}
                                        isReadOnly={false}
                                        isChanged={false}
                                        skeletonLoading={loadingProcess?.['matches']}
                                        myStyleListBox={{ height: '425px' }}
                                    >
                                        {allEffectsFiltered.map((item) => (
                                            item.id && (
                                                <BlockCheckBox
                                                    checked={selectedItems.find(select => select.fieldName === 'all')?.data}
                                                    key={item.id} 
                                                    fieldName={'all'}
                                                    id={item.id}
                                                    title={item.name_rus}
                                                    isReadOnly={false}
                                                    onChange={handleEffectItem}
                                                />
                                            )
                                        ))}
                                    </TotalListBlock>
                                </ContentBlock>

                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <div style={{height: '50%', paddingTop: '100px'}}>
                                        <MoveIconButton
                                            isListEmpty={selectedItems}
                                            fieldName={'all'}
                                            onClick={() => funcMoveToBlockList('to', 'matches')}
                                            direction={'right'}
                                        />
                                        <div style={{marginBottom: '20px'}}></div>
                                        <MoveIconButton
                                            isListEmpty={selectedItems}
                                            fieldName={'matches'}
                                            onClick={() => funcMoveToBlockList('from', 'matches')}
                                            direction={'left'}
                                        />
                                    </div>
                                    <div style={{height: '50%', paddingTop: '100px'}}>
                                        <MoveIconButton
                                            isListEmpty={selectedItems}
                                            fieldName={'all'}
                                            onClick={() => funcMoveToBlockList('to', 'mismatches')}
                                            direction={'right'}
                                        />
                                        <div style={{marginBottom: '20px'}}></div>
                                        <MoveIconButton
                                            isListEmpty={selectedItems}
                                            fieldName={'mismatches'}
                                            onClick={() => funcMoveToBlockList('from', 'mismatches')}
                                            direction={'left'}
                                        />
                                    </div>
                                </div>  

                                <ContentBlock>
                                    <TotalListBlock
                                        title={'Сочитающиеся эффекты'}
                                        fieldName={'matches'}
                                        isReadOnly={false}
                                        isChanged={!!componentData?.objChangedData?.['matches']}
                                        myStyleListBox={{ height: '200px' }}
                                        skeletonLoading={loadingProcess?.['matches']}
                                    >
                                        {matchesItems.map((item) => (
                                            item.id && (
                                            <BlockCheckBox
                                                    key={item.id} 
                                                    checked={selectedItems.find(select => select.fieldName === 'matches')?.data}
                                                    fieldName={'matches'}
                                                    id={item.id}
                                                    title={item.name_rus}
                                                    isReadOnly={false}
                                                    onChange={handleEffectItem}
                                                />
                                            )
                                        ))}
                                    </TotalListBlock>
                                    <TotalListBlock
                                        title={'Несочитающиеся эффекты'}
                                        fieldName={'mismatches'}
                                        isReadOnly={false}
                                        isChanged={!!componentData?.objChangedData?.['mismatches']}
                                        myStyleListBox={{ height: '200px' }}
                                        skeletonLoading={loadingProcess?.['mismatches']}
                                    >
                                        {mismatchesItems.map((item) => (
                                            item.id && (
                                                <BlockCheckBox
                                                    key={item.id} 
                                                    checked={selectedItems.find(select => select.fieldName === 'mismatches')?.data}
                                                    fieldName={'mismatches'}
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
                        )
                    }
                </ContentBlock>
            </>)}
    </>)
}

export default EffectMatching