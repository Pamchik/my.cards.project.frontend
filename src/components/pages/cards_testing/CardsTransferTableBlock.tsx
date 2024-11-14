import { useEffect, useState } from "react";
import { useEffectStoreData } from "../../hooks/useEffectStoreData";
import { useComponentPreparation } from "../../hooks/useComponentPreparation";
import { useDispatch } from "react-redux";
import { useGetCardTestingQuery } from "../../../store/api/cardTestingApiSlice";
import { useGetTestCardTransfersQuery, useUpdateTestCardTransferMutation } from "../../../store/api/testCardTransferApiSlice";
import { deleteComponentsAPIUpdate } from "../../../store/componentsData/componentsAPIUpdateSlice";
import { IFieldParams } from "../../../store/componentsData/fieldsParamsSlice";
import { setLoadingStatus } from "../../../store/componentsData/loadingProcessSlice";
import BtnBlock from "../../blocks/BtnBlock";
import ButtonMain from "../../UI/buttons/ButtonMain";
import ContentBlock from "../../blocks/ContentBlock";
import { setModalProps } from "../../../store/modalData/modalsPropsDataSlice";
import { setModalOpen } from "../../../store/modalData/modalsSlice";
import CardsTransferTable from "../../tables/CardsTransferTable";
import { useAllComponentParamsReset } from "../../hooks/useComponentDataReset";
import useTimeoutManager from "../../hooks/useTimeoutManager";
import { setSavingStatus } from "../../../store/componentsData/savingProcessSlice";
import { deleteFieldInvalid } from "../../../store/componentsData/fieldsInvalidSlice";
import { deleteAllComponentData } from "../../../store/componentsData/componentsDataSlice";
import { functionErrorMessage } from "../../functions/functionErrorMessage";
import { funcConvertToFieldDataType } from "../../functions/funcConvertToFieldDataType";


interface ICardsTransferTableBlock {
    selectedID: number
}

const CardsTransferTableBlock = ({
    selectedID
}: ICardsTransferTableBlock) => {

    const componentName = 'CardsTransferTableBlock'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const { loadingProcess, componentsAPIUpdate } = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const dispatch = useDispatch()

    const [updateTestCardTransfer, {}] = useUpdateTestCardTransferMutation()

    const { data: cardTestingData, isFetching: isFetchingCardTestingData, error: errorCardTestingData, refetch: refetchCardTestingData } = useGetCardTestingQuery({ id: selectedID });
    const { data: testCardTransfersData, isFetching: isFetchingTestCardTransfersData, error: errorTestCardTransfersData, refetch: refetchTestCardTransfersData } = useGetTestCardTransfersQuery(
        { card_testing_project: selectedID, deleted: 'False' },
        {
            skip: !selectedID,
            selectFromResult: ({ data, ...other }) => ({
                data: selectedID ? data : [],
                ...other
            })
        }
    )

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);
    
    useEffect(() => {
        if (componentsAPIUpdate.includes('cardTestingData')) {
            updateAPIData('cardTestingData', refetchCardTestingData)
        } else if (componentsAPIUpdate.includes('testCardTransfersData')) {
            updateAPIData('testCardTransfersData', refetchTestCardTransfersData)
        }
    }, [componentsAPIUpdate]);

    function updateAPIData (name: string, refetchFunc: () => void) {
        try {
            refetchFunc();
        } catch (error) {} finally {
            dispatch(deleteComponentsAPIUpdate([name])) 
        } 
    }

    
    const initFieldParams: IFieldParams = {
        'testCardTransfersData': { isRequired: false, type: 'array' },
    }

    useEffect(() => {
        componentPreparing({ loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams });
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({ componentName, data: { status: true, fields: ['testCardTransfersData'] } }))
        if (isComponentPrepared) {
            if (!isFetchingTestCardTransfersData && !isFetchingCardTestingData) {
                if (!errorTestCardTransfersData && testCardTransfersData && !errorCardTestingData && cardTestingData) {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: true, fields: ['testCardTransfersData'] } }))
                    }, 1000)
                } else {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: false, fields: ['testCardTransfersData'] } }))
                    }, 1000)
                }
            }
            // setCurrentObjData(undefined)
        }
    }, [isComponentPrepared, testCardTransfersData, isFetchingTestCardTransfersData, cardTestingData, isFetchingCardTestingData]);

    const arrBtnActions: {id: number, title: string}[] = [
        {id: 1, title: "Добавление новых карт"},
        {id: 2, title: "Добавление из существующего проекта"},
        {id: 3, title: "Передача в новый проект"},
        {id: 4, title: "Передача в существующий проект"},
        {id: 5, title: "Передача клиенту"},
        {id: 6, title: "Списать"},
    ]

    const btnList = {
        "Add": [
            {
                name: "Из новой поставки", 
                onClick: () => {
                    dispatch(setModalProps({
                        componentName: 'TransferTestCardModal', data: {
                            objChangedData: {
                                card_testing_project: selectedID,
                                action: 1
                            },
                            qtyFieldsForSavingBtn: 2,
                            other: {
                                action: arrBtnActions[0],
                                card_testing_project: selectedID
                            }
                        }
                    }))
                    dispatch(setModalOpen('TransferTestCardModal'))
                }
            }, 
            {
                name: "Из существующего проекта", 
                onClick: () => {
                    dispatch(setModalProps({
                        componentName: 'TransferTestCardModal', data: {
                            objChangedData: {
                                to_card_testing_project: selectedID,
                                action: 2
                            },
                            qtyFieldsForSavingBtn: 2,
                            other: {
                                action: arrBtnActions[1],
                                to_card_testing_project: selectedID
                            }
                        }
                    }))
                    dispatch(setModalOpen('TransferTestCardModal'))
                }
            }
        ],
        "Send": [
            {
                name: "В новый проект", 
                onClick: () => {
                    dispatch(setModalProps({
                        componentName: 'TransferTestCardModal', data: {
                            objChangedData: {
                                card_testing_project: selectedID,
                                bank: null,
                                action: 3
                            },
                            qtyFieldsForSavingBtn: 3,
                            other: {
                                action: arrBtnActions[2],
                                card_testing_project: selectedID
                            }
                        }
                    }))
                    dispatch(setModalOpen('TransferTestCardModal'))
                }
            }, 
            {
                name: "В существующий проект", 
                onClick: () => {
                    dispatch(setModalProps({
                        componentName: 'TransferTestCardModal', data: {
                            objChangedData: {
                                card_testing_project: selectedID,
                                action: 4
                            },
                            qtyFieldsForSavingBtn: 2,
                            other: {
                                action: arrBtnActions[3],
                                card_testing_project: selectedID
                            }
                        }
                    }))
                    dispatch(setModalOpen('TransferTestCardModal'))
                }
            }, 
            {
                name: "Клиенту", 
                onClick: () => {
                    dispatch(setModalProps({
                        componentName: 'TransferTestCardModal', data: {
                            objChangedData: {
                                card_testing_project: selectedID,
                                action: 5,
                                is_for_bank: true
                            },
                            qtyFieldsForSavingBtn: 3,
                            other: {
                                action: arrBtnActions[4],
                                card_testing_project: selectedID,
                                bank: cardTestingData?.[0].bank
                            }
                        }
                    }))
                    dispatch(setModalOpen('TransferTestCardModal'))
                }
            }
        ],
        "Delete": [
            {
                name: "Списать", 
                onClick: () => {
                    dispatch(setModalProps({
                        componentName: 'TransferTestCardModal', data: {
                            objChangedData: {
                                card_testing_project: selectedID,
                                action: 5
                            },
                            qtyFieldsForSavingBtn: 1,
                            other: {
                                action: arrBtnActions[5],
                                card_testing_project: selectedID
                            }
                        }
                    }))
                    dispatch(setModalOpen('TransferTestCardModal'))
                }
            }
        ],  
    }

    const [currentBtnList, setCurrentBtnList] = useState<{"Add": any[], "Send": any[], "Delete": any[]}>({"Add": [], "Send": [], "Delete": []})
    useEffect(() => {
        if (cardTestingData?.length! > 0) {
            const data = cardTestingData?.[0]
            if (data?.type_card === 1 && !data?.bank) {
                setCurrentBtnList({
                    "Add": [btnList.Add[0], btnList.Add[1]],
                    "Send": [btnList.Send[0], btnList.Send[1]],
                    "Delete": [btnList.Delete[0]]
                })
            } else if (data?.type_card === 1 && data?.bank) {
                setCurrentBtnList({
                    "Add": [btnList.Add[0], btnList.Add[1]],
                    "Send": [btnList.Send[0], btnList.Send[1], btnList.Send[2]],
                    "Delete": [btnList.Delete[0]]
                })
            } else if (data?.type_card === 2) {
                setCurrentBtnList({
                    "Add": [btnList.Add[0]],
                    "Send": [btnList.Send[2]],
                    "Delete": [btnList.Delete[0]]
                })  
            }
        } else {
            setCurrentBtnList({"Add": [], "Send": [], "Delete": []})
        }
    }, [cardTestingData]);

    const [selectedLineID, setSelectedLineID] = useState<number | undefined | null>()
    function funcBackSelectedID (id: number | undefined | null) {
        setSelectedLineID(id)
    }

    useEffect(() => {
        setSelectedLineID(null)
    },[])

    async function funcSaveFields () {
        dispatch(setSavingStatus({componentName, data: {status: true}}))
        const currentId: number | undefined | null = selectedLineID
        if (currentId) {
            dispatch(deleteFieldInvalid({componentName}))
            const myData = {action: 8, deleted: 'True'}
            await updateTestCardTransfer({...myData, id: currentId}).unwrap()    
            .then((res) => {
                dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: true}}))
                dispatch(deleteAllComponentData({componentName}))
                setManagedTimeout(() => { 
                    dispatch(setSavingStatus({ componentName, data: { status: false } }))
                }, 1000)  
            }).catch((error) => {
                const message = functionErrorMessage(error)
                dispatch(setSavingStatus({ componentName, data: { status: true, isSuccessful: false, message: message} }))
            })             
        } else {
            dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: false, message: "Ошибка! Обновите страницу и попробуйте заново."}}))
        }
    } 


    return (<>
        <BtnBlock>
            {
                <>
                    {selectedLineID && <>
                        <ButtonMain
                            onClick={() => {}}
                            type={'other'}
                            color={'gray'}
                            drop={true}
                            title={'Редактировать'}
                            actions={[
                                {
                                    name: "Изменить", 
                                    onClick: () => {
                                        const data = testCardTransfersData?.find(item => item.id === selectedLineID)
                                        if (data) {
                                            dispatch(setModalProps({
                                                componentName: 'TransferTestCardModal',
                                                data: {
                                                    objInputData: {...funcConvertToFieldDataType(data), action: 7},
                                                    qtyFieldsForSavingBtn: 0,
                                                    other: {action: {id: 7, title: "Изменить данные"}}
                                                }
                                            }))
                                            dispatch(setModalOpen('TransferTestCardModal'))
                                        } else {
                                            return {}
                                        }
                                    }
                                },
                                {
                                    name: "Удалить", 
                                    onClick: funcSaveFields,
                                    myStyle: {color: 'red'}
                                },
                            ]}
                            myStyle={{padding: '0 10px', width: '130px'}}
                        />                
                    </>}                  
                    {currentBtnList.Add.length > 0 &&
                        <ButtonMain
                            onClick={() => {}}
                            type={'other'}
                            title={'Добавить'}
                            color={'gray'}
                            drop={true}
                            actions={currentBtnList.Add}
                            myStyle={{padding: '0 10px', width: 'auto'}}
                        />      
                    }    
                    {currentBtnList.Send.length > 0 &&
                        <ButtonMain
                            onClick={() => {}}
                            type={'other'}
                            title={'Передать'}
                            color={'gray'}
                            drop={true}
                            actions={currentBtnList.Send}
                            myStyle={{padding: '0 10px', width: 'auto'}}
                        />  
                    }     
                    {currentBtnList.Delete.length > 0 &&
                        <ButtonMain
                            onClick={() => currentBtnList.Delete[0].onClick()}
                            type={'other'}
                            title={'Списать'}
                            color={'gray'}
                            myStyle={{padding: '0 10px', width: '100px'}}
                        />  
                    }     
                    
                </>            
            }

        </BtnBlock>

        <ContentBlock myStyleMain={{padding: '0'}} myStyleContent={{display: 'block', height: '350px'}}>
            <CardsTransferTable
                arrData={testCardTransfersData || []}
                isLoading={loadingProcess?.['testCardTransfersData']}
                funcGetLineID={funcBackSelectedID}
            />   
        </ContentBlock>
    </>);        

};

export default CardsTransferTableBlock;