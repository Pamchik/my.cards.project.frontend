import { useEffect, useState } from "react";
import ListBlock from "../../../UI/list/ListBlock";
import { useEffectStoreData } from "../../../hooks/useEffectStoreData";
import { useComponentPreparation } from "../../../hooks/useComponentPreparation";
import { useFieldValueChange } from "../../../hooks/useFieldValueChange";
import { useDispatch } from "react-redux";
import { IBankBIDsData, useGetBankBIDsQuery } from "../../../../store/api/bankBIDApiSlice";
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
import { setModalProps } from "../../../../store/modalData/modalsPropsDataSlice";
import { setModalOpen } from "../../../../store/modalData/modalsSlice";
import { useAllComponentParamsReset } from "../../../hooks/useComponentDataReset";
import useTimeoutManager from "../../../hooks/useTimeoutManager";


interface IBankBIDsList {
    setSelectedID: (id: number | null) => void,
    selectedID: number | null
    globalElementID: number
}

const BankBIDsList = ({
    setSelectedID,
    selectedID,
    globalElementID
}: IBankBIDsList) => {

    const componentName = "BankBIDsList"
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const {loadingProcess, fieldParams, componentData, componentsAPIUpdate} = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: bankBIDsData, isFetching: isFetchingBankBIDsData, error: errorBankBIDsData, refetch: refetchBankBIDsData} = useGetBankBIDsQuery({bank: globalElementID})

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    useEffect(() => {
        if (componentsAPIUpdate.includes('bankBIDsData')) {
            refetchBankBIDsData()
            dispatch(deleteComponentsAPIUpdate(['bankBIDsData']))
        }
    }, [componentsAPIUpdate]);

    const initFieldParams: IFieldParams = {
        'number': { isRequired: false, type: 'number' },
        'status': { isRequired: true, type: 'number' }
    }

    useEffect(() => {
        if (!isComponentPrepared) {
            componentPreparing({ loadingFieldsData: ['number', 'status', 'arrBankBIDs'], fieldsParamsData: initFieldParams });
            setValues({ name: 'status', value: 1 })
            setIsComponentPrepared(true);
        }
    }, [globalElementID]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: Object.keys(initFieldParams)}}))
        if (isComponentPrepared) {
            setManagedTimeout(() => {
                dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['number', 'status']}}))
            }, 1000)
        }
    }, [isComponentPrepared, globalElementID]);

    useEffect(() => {
        dispatch(setLoadingStatus({ componentName, data: { status: true, fields: ['arrBankBIDs'] } }))
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: Object.keys(initFieldParams)}}))
        if (isComponentPrepared) {
            setManagedTimeout(() => {
                dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['number', 'status']}}))
            }, 1000)
            if (!isFetchingBankBIDsData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['arrBankBIDs']}}))
                }, 1000)
            } else {
                dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['arrBankBIDs']}}))
            }
        }

    }, [isFetchingBankBIDsData, isComponentPrepared, globalElementID]);

    const [sortedBankBIDsData, setSortedBankBIDsData] = useState<IBankBIDsData[]>([])

    useEffect(() => {
        if (bankBIDsData && isComponentPrepared) {
            const fieldsCheckValues = [
                {fieldName: 'number', value: componentData?.objInputAndChangedData['number'], required: false},
                {fieldName: 'active', value: componentData?.objInputAndChangedData['status'] === 1 ? true : false, required: false},
            ]
            const newData = funcSortedDataByValue(funcFilteredDataByValues(bankBIDsData, fieldsCheckValues), 'number')
            setSortedBankBIDsData(newData)
            if (!newData.find(item => item.id === selectedID)) {
                setSelectedID(null)
            }
        } else {
            setSortedBankBIDsData([])
            setSelectedID(null)
        }
    },[componentData?.objInputAndChangedData, bankBIDsData, isComponentPrepared])
       
    let itemsList;
    if (loadingProcess?.['arrBankBIDs'].status) {
        itemsList = (
            <div style={{position: 'relative', height: '100px'}}>
                <LoadingView myStyleContainer={{backgroundColor: 'rgba(255, 255, 255, 0)'}}/>                            
            </div>            
        )
    } else {
        if (errorBankBIDsData) {
            itemsList = (
                <div style={{marginTop: '20px', marginLeft: '10px', marginBottom: '10px'}}>
                    Ошибка загрузки данных...
                </div>
            )
        } else {
            itemsList = (
                <>{sortedBankBIDsData.map((item) => (
                    <ListBlock
                        key={item.id}
                        title={item.number}
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
                            dispatch(setModalProps({componentName: 'CreateNewBankBIDModal', data: {
                                objChangedData: {active: true, bank: globalElementID},
                                objReadOnlyFields: ['active', 'bank'],
                                qtyFieldsForSavingBtn: 2
                            }}))
                            dispatch(setModalOpen('CreateNewBankBIDModal'))
                        }}
                        type={'other'}
                        title={'Добавить'}  
                        color={'gray'}
                    />
                </BtnBlock>
                <ContentBlock>
                    <BlockInput
                        onChange={(obj) => setValues(obj)}
                        fieldName={'number'}
                        title={'Номер'}
                        type={fieldParams?.['number']?.type as IInputTypes}
                        value={componentData?.objInputAndChangedData['number'] as IInputValue}
                        placeholder={'Начните вводить номер ...'}
                        skeletonLoading={loadingProcess?.['number']}
                        isRequired={fieldParams?.['number']?.isRequired}
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

export default BankBIDsList