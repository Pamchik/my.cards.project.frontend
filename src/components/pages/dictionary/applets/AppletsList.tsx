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
import { IAppletsData, useGetAppletsQuery } from "../../../../store/api/appletApiSlice";
import { setModalProps } from "../../../../store/modalData/modalsPropsDataSlice";
import { setModalOpen } from "../../../../store/modalData/modalsSlice";
import { useAllComponentParamsReset } from "../../../hooks/useComponentDataReset";
import useTimeoutManager from "../../../hooks/useTimeoutManager";
import { useGetPaymentSystemsQuery } from "../../../../store/api/paymentSystemApiSlice";

interface IAppletsList {
    setSelectedID: (id: number | null) => void,
    selectedID: number | null
}

const AppletsList = ({
    setSelectedID,
    selectedID
}: IAppletsList) => {

    const componentName = "AppletsList"
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const {loadingProcess, fieldParams, componentData, componentsAPIUpdate} = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: appletsData, isFetching: isFetchingAppletsData, error: errorAppletsData, refetch: refetchAppletsData} = useGetAppletsQuery(undefined)
    const {data: paymentSystemsData, isFetching: isFetchingPaymentSystemsData, error: errorPaymentSystemsData, refetch: refetchPaymentSystemsData} = useGetPaymentSystemsQuery(undefined)

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    useEffect(() => {
        if (componentsAPIUpdate.includes('appletsData')) {
            refetchAppletsData()
            dispatch(deleteComponentsAPIUpdate(['appletsData']))
        } else if (componentsAPIUpdate.includes('paymentSystemsData')) {
            refetchPaymentSystemsData()
            dispatch(deleteComponentsAPIUpdate(['paymentSystemsData']))
        }
    }, [componentsAPIUpdate]);

    const initFieldParams: IFieldParams = {
        'name': { isRequired: false, type: 'text' },
        'payment_system': {isRequired: true, type: 'number'},
        'status': { isRequired: true, type: 'number' }
    }

    useEffect(() => {
        if (!isComponentPrepared) {
            componentPreparing({ loadingFieldsData: ['name', 'status', 'payment_system', 'arrApplets'], fieldsParamsData: initFieldParams });
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
            if (!isFetchingPaymentSystemsData) {
                setManagedTimeout(() => {
                    if (!errorPaymentSystemsData) {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['payment_system']}}))
                    } else {
                        dispatch(setLoadingStatus({ componentName, data: { status: false, isSuccessful: false, fields: ['payment_system']}}))
                    }
                }, 1000)
            } else {
                dispatch(setLoadingStatus({ componentName, data: { status: true, fields: ['payment_system']}}))
            }
        }
    }, [isFetchingPaymentSystemsData, isComponentPrepared]);

    useEffect(() => {
        if (isComponentPrepared) {
            if (!isFetchingAppletsData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['arrApplets']}}))
                }, 1000)
            } else {
                dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['arrApplets']}}))
            }
        }
    }, [isFetchingAppletsData, isComponentPrepared]);

    const [sortedAppletsData, setSortedAppletsData] = useState<IAppletsData[]>([])
    
    useEffect(() => {
        if (appletsData && isComponentPrepared) {
            const fieldsCheckValues = [
                {fieldName: 'name', value: componentData?.objInputAndChangedData['name'], required: false},
                {fieldName: 'payment_system', value: componentData?.objInputAndChangedData['payment_system'], required: true},
                {fieldName: 'active', value: componentData?.objInputAndChangedData['status'] === 1 ? true : false, required: false},
            ]
            const newData = funcSortedDataByValue(funcFilteredDataByValues(appletsData, fieldsCheckValues), 'name')
            setSortedAppletsData(newData)
            if (!newData.find(item => item.id === selectedID)) {
                setSelectedID(null)
            }
        } else {
            setSortedAppletsData([])
            setSelectedID(null)
        }
    },[componentData?.objInputAndChangedData, appletsData, isComponentPrepared])

    let itemsList;
    if (loadingProcess?.['arrApplets'].status) {
        itemsList = (
            <div style={{position: 'relative', height: '100px'}}>
                <LoadingView myStyleContainer={{backgroundColor: 'rgba(255, 255, 255, 0)'}}/>                            
            </div>            
        )
    } else {
        if (errorAppletsData) {
            itemsList = (
                <div style={{marginTop: '20px', marginLeft: '10px', marginBottom: '10px'}}>
                    Ошибка загрузки данных...
                </div>
            )
        } else {
            itemsList = (
                <>{sortedAppletsData.map((item) => (
                    <ListBlock
                        key={item.id}
                        title={item.name}
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
                            dispatch(setModalProps({componentName: 'CreateNewAppletModal', data: {
                                objChangedData: {active: true},
                                objReadOnlyFields: ['active'],
                                qtyFieldsForSavingBtn: 1
                            }}))
                            dispatch(setModalOpen('CreateNewAppletModal'))
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
                        fieldName={'payment_system'}
                        showName={"name"}
                        title={'Платежная система'}
                        value={componentData?.objInputAndChangedData['payment_system'] as ISelectValue}
                        options={paymentSystemsData}
                        isEmptyOption={true}
                        onChange={(obj) => setValues(obj)}   
                        skeletonLoading={loadingProcess?.['payment_system']}
                        isRequired={fieldParams?.['payment_system']?.isRequired}                                    
                    />
                    {itemsList}           
                </ContentBlock>
            </MainInfoBlock>
        )}
    </>)
}

export default AppletsList