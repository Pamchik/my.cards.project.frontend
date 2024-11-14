import BtnBlock from "../../../blocks/BtnBlock";
import ButtonMain from "../../../UI/buttons/ButtonMain";
import ContentBlock from "../../../blocks/ContentBlock";
import { useEffect, useState } from "react";
import MoveIconButton from "../../../UI/buttons/MoveIconButton";
import { useComponentPreparation } from "../../../hooks/useComponentPreparation";
import { useFieldValueChange } from "../../../hooks/useFieldValueChange";
import { useDispatch } from "react-redux";
import { useGetChipQuery, useUpdateChipMutation } from "../../../../store/api/chipApiSlice";
import { useEffectStoreData } from "../../../hooks/useEffectStoreData";
import { deleteAllComponentData, deleteChangedComponentData, setInputData } from "../../../../store/componentsData/componentsDataSlice";
import { changeComponentReadOnly } from "../../../../store/componentsData/componentsReadOnlySlice";
import { deleteFieldInvalid, setFieldInvalid } from "../../../../store/componentsData/fieldsInvalidSlice";
import { deleteComponentsAPIUpdate } from "../../../../store/componentsData/componentsAPIUpdateSlice";
import { IFieldParams } from "../../../../store/componentsData/fieldsParamsSlice";
import { setLoadingStatus } from "../../../../store/componentsData/loadingProcessSlice";
import { funcConvertToFieldDataType } from "../../../functions/funcConvertToFieldDataType";
import TotalListBlock from "../../../UI/fields/TotalListBlock";
import { IMifaresData, useGetMifaresQuery } from "../../../../store/api/mifareApiSlice";
import { setSavingStatus } from "../../../../store/componentsData/savingProcessSlice";
import { funcValidateFields } from "../../../functions/funcValidateFields";
import { functionErrorMessage } from "../../../functions/functionErrorMessage";
import BlockCheckBox from "../../../UI/fields/BlockCheckBox";
import { useAllComponentParamsReset } from "../../../hooks/useComponentDataReset";
import useTimeoutManager from "../../../hooks/useTimeoutManager";

interface IMifareMatchingMainInfo {
    selectedID: number
}

const MifareMatchingMainInfo = ({
    selectedID
}: IMifareMatchingMainInfo) => {

    const componentName = 'MifareMatchingMainInfo'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const { loadingProcess, fieldParams, componentData, componentReadOnly, componentInvalidFields, savingProcess, componentsAPIUpdate } = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: chipData, isFetching: isFetchingChipData, error: errorChipData, refetch: refetchChipData} = useGetChipQuery({id: selectedID})
    const {data: mifaresData, isFetching: isFetchingMifaresData, error: errorMifaresData, refetch: refetchMifaresData} = useGetMifaresQuery(undefined)
    const [updateChip, {}] = useUpdateChipMutation()

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    useEffect(() => {
        if (componentsAPIUpdate.includes('chipData')) {
            refetchChipData()
            funcChangeCancelSet(true)
            dispatch(deleteComponentsAPIUpdate(['chipData']))
        } else if (componentsAPIUpdate.includes('mifaresData')) {
            refetchMifaresData()
            dispatch(deleteComponentsAPIUpdate(['mifaresData']))
        }
    }, [componentsAPIUpdate]);

    const initFieldParams: IFieldParams = {
        'mifare_available': {isRequired: false, type: 'array'},
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
    }, [selectedID]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: Object.keys(initFieldParams)}}))
        if (isComponentPrepared) {
            if (isFetchingChipData || isFetchingMifaresData) {
                dispatch(setLoadingStatus({componentName, data: {status: true, fields: Object.keys(initFieldParams)}}))
            } else {
                if (!errorChipData && !errorMifaresData && chipData) {
                    const myData = funcConvertToFieldDataType(chipData[0])
                    dispatch(setInputData({componentName, data: myData}))
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: [
                            'mifare_available'
                        ]}}))
                    }, 1000)  
                } else {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: Object.keys(initFieldParams)}}))
                    }, 1000)
                }
            }
        }
    }, [selectedID, isComponentPrepared, chipData, isFetchingChipData, isFetchingMifaresData]);

    useEffect(() => {
        funcChangeCancelSet(true)
    }, [selectedID]);

    async function funcSaveFields () {
        dispatch(setSavingStatus({componentName, data: {status: true}}))
        const currentId: number = componentData?.objInputAndChangedData['id'] as number
        if (currentId) {
            const isValid = funcValidateFields(fieldParams, componentData?.objInputAndChangedData, componentData?.objChangedData)
            if (isValid.isAllFieldsValid) {
                dispatch(deleteFieldInvalid({componentName}))
                const myData = componentData.objChangedData
                await updateChip({...myData, id: currentId}).unwrap()    
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
                dispatch(setFieldInvalid({componentName, data: isValid.data}))
                dispatch(setSavingStatus({componentName, data: {status: false}}))
            }
        } else {
            dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: false, message: "Ошибка! Обновите страницу и попробуйте заново."}}))
        }
    }    

    function funcChangeCancelSet(newStatus: boolean) {
        dispatch(deleteChangedComponentData({componentName}))
        dispatch(changeComponentReadOnly({componentName, newStatus}))
        dispatch(deleteFieldInvalid({componentName}))            
    }

    const [arrCurrentMifare, setArrCurrentMifare] = useState<IMifaresData[]>([]);
    useEffect(() => {
        if (isComponentPrepared && chipData && mifaresData) {
            setArrCurrentMifare(mifaresData.filter(item => 
                chipData.length > 0 &&  
                item.id &&
                chipData[0].mifare_available.includes(+item.id)
            ))
        } else {
            setArrCurrentMifare([])
        }
    }, [chipData, mifaresData]);

    const [arrCurrentMifareForUpdate, setArrCurrentMifareForUpdate] = useState<IMifaresData[]>([]);
    useEffect(() => {
        if (mifaresData) {
            const data = componentData?.objInputAndChangedData['mifare_available']
            if (data && typeof data === 'object' && data.length > 0) {
                setArrCurrentMifareForUpdate(mifaresData.filter(item => 
                    item.id &&
                    data.includes(item.id) 
                ))            
            } else {
                setArrCurrentMifareForUpdate([])
            }
        } else {
            setArrCurrentMifareForUpdate([])
        }
    }, [mifaresData, componentData?.objInputAndChangedData['mifare_available']]);

    const [allMifareFiltered, setAllMifareFiltered] = useState<IMifaresData[]>([])
    useEffect(() => {
        if (mifaresData) {
            const data = componentData?.objInputAndChangedData['mifare_available']
            if (data && typeof data === 'object' && data.length > 0) {
                setAllMifareFiltered(mifaresData.filter(item => 
                    item.id &&
                    !data.includes(item.id) 
                ))                
            } else {
                setAllMifareFiltered(mifaresData)
            }
        } else {
            setAllMifareFiltered([])
        }
    }, [mifaresData, componentData?.objInputAndChangedData['mifare_available']]);

    const [selectedItems, setSelectedItems] = useState<{fieldName: string, data: number[]}[]>([])
    function handleItems (fieldName: string, e: React.ChangeEvent<HTMLInputElement>) {
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

    function funcMoveToBlockList (direction: 'from', state: 'current_items' | 'all') {
        if (selectedID) {
            let filteredSelectItems = []
            filteredSelectItems = selectedItems.filter(item => item.fieldName === state)

            if (filteredSelectItems.length > 0 && filteredSelectItems[0].data) {
                const filteredSelectItemsData: number[] = filteredSelectItems[0].data

                funcSetLocalChangedData(state, filteredSelectItemsData)

                setSelectedItems((prevData) => {

                    let index: number = -1
                    index = prevData.findIndex((item) => item.fieldName === state);

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
    }

    function funcSetLocalChangedData (state: 'current_items' | 'all', filteredSelectItemsData: number[] ) {

        let previousMatchingData: number[] = []

        const data = componentData?.objInputAndChangedData['mifare_available']
        if (data && typeof data === 'object' && data.length > 0) {
            previousMatchingData = data
        }

        let newMatchingData: number[] = [];
        if (state === 'all') {
            newMatchingData = Array.from(new Set([...filteredSelectItemsData, ...previousMatchingData]))
        } else {
            for (let i = 0; i < previousMatchingData.length; i++) {
                if (!filteredSelectItemsData.includes(previousMatchingData[i])) {
                    newMatchingData.push(+previousMatchingData[i])
                }
            }
        }

        setValues({name: 'mifare_available', value: newMatchingData})
    }

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
                            <TotalListBlock
                                fieldName={'mifare_available'}
                                isReadOnly={true}
                                skeletonLoading={loadingProcess?.['mifare_available']}
                                myStyleListBox={{ height: '230px' }}
                            >
                                {arrCurrentMifare.map((item) => (
                                    item.id && (
                                    <BlockCheckBox
                                        key={item.id} 
                                        id={item.id}
                                        title={item.name}
                                        isReadOnly={true}
                                    />   
                                    )                 
                                ))}
                            </TotalListBlock>
                        )
                    :  
                        (
                            <div style={{display: 'flex'}}>
                                <ContentBlock title={'Общий список типов Mifare'}>
                                    <TotalListBlock
                                        fieldName={'all'}
                                        isReadOnly={false}
                                        isChanged={false}
                                        myStyleListBox={{ height: '300px' }}
                                        skeletonLoading={loadingProcess?.['mifare_available']}
                                    >
                                        {allMifareFiltered.length > 0 && allMifareFiltered.map((item) => (
                                            item.id && (
                                            <BlockCheckBox
                                                key={item.id} 
                                                fieldName={'all'}
                                                checked={selectedItems.find(select => select.fieldName === 'all')?.data}
                                                id={item.id}
                                                title={item.name}
                                                isReadOnly={false}
                                                onChange={handleItems}
                                            />
                                            )
                                        ))}
                                    </TotalListBlock>
                                </ContentBlock>

                                <div style={{display: 'flex', flexDirection: 'column', height: '100%', margin: 'auto'}}>
                                    <MoveIconButton
                                        isListEmpty={selectedItems}
                                        fieldName={'all'}
                                        onClick={() => funcMoveToBlockList('from', 'all')}
                                        direction={'right'}
                                    />
                                    <div style={{marginBottom: '20px'}}></div>
                                    <MoveIconButton
                                        isListEmpty={selectedItems}
                                        fieldName={'current_items'}
                                        onClick={() => funcMoveToBlockList('from', 'current_items')}
                                        direction={'left'}
                                    />
                                </div>

                                <ContentBlock title={'Поддерживаемые типы Mifare'}>
                                    <TotalListBlock
                                        fieldName={'current'}
                                        isReadOnly={false}
                                        isChanged={!!componentData?.objChangedData?.['mifare_available']}
                                        myStyleListBox={{ height: '300px' }}
                                        skeletonLoading={loadingProcess?.['mifare_available']}
                                    >
                                        {arrCurrentMifareForUpdate.length > 0 && arrCurrentMifareForUpdate.map((item) => (
                                            item.id && (
                                            <BlockCheckBox
                                                key={item.id} 
                                                fieldName={'current_items'}
                                                checked={selectedItems.find(select => select.fieldName === 'current_items')?.data}
                                                id={item.id}
                                                title={item.name}
                                                isReadOnly={false}
                                                onChange={handleItems}
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


export default MifareMatchingMainInfo