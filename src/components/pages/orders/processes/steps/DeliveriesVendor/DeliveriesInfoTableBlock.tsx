import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useEffectStoreData } from '../../../../../hooks/useEffectStoreData';
import { useComponentPreparation } from '../../../../../hooks/useComponentPreparation';
import { useAllComponentParamsReset } from '../../../../../hooks/useComponentDataReset';
import useTimeoutManager from '../../../../../hooks/useTimeoutManager';
import { useGetDeliveryInfoQuery, useGetDeliveryTableInfoQuery, useUpdateDeliveryInfoMutation } from '../../../../../../store/api/deliveryInfoApiSlice';
import { deleteComponentsAPIUpdate } from '../../../../../../store/componentsData/componentsAPIUpdateSlice';
import { IFieldParams } from '../../../../../../store/componentsData/fieldsParamsSlice';
import { setLoadingStatus } from '../../../../../../store/componentsData/loadingProcessSlice';
import BtnBlock from '../../../../../blocks/BtnBlock';
import ButtonMain from '../../../../../UI/buttons/ButtonMain';
import { setModalProps } from '../../../../../../store/modalData/modalsPropsDataSlice';
import { setModalOpen } from '../../../../../../store/modalData/modalsSlice';
import ContentBlock from '../../../../../blocks/ContentBlock';
import DeliveriesInfoTable from '../../../../../tables/DeliveriesInfoTable';
import { setSavingStatus } from '../../../../../../store/componentsData/savingProcessSlice';
import { deleteFieldInvalid } from '../../../../../../store/componentsData/fieldsInvalidSlice';
import { deleteAllComponentData } from '../../../../../../store/componentsData/componentsDataSlice';
import { functionErrorMessage } from '../../../../../functions/functionErrorMessage';
import { funcConvertToFieldDataType } from '../../../../../functions/funcConvertToFieldDataType';

interface IDeliveriesInfoTableBlock {
    selectedID: number
    companyType: string
   }

const DeliveriesInfoTableBlock = ({
    selectedID,
    companyType
}: IDeliveriesInfoTableBlock) => {

    const componentName = 'DeliveriesInfoTableBlock'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const { loadingProcess, componentsAPIUpdate } = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const dispatch = useDispatch()

    const [updateDeliveryInfo, {}] = useUpdateDeliveryInfoMutation()

    const {data: deliveriesTableInfoData, isFetching: isFetchingDeliveriesTableInfoData, error: errorDeliveriesTableInfoData, refetch: refetchDeliveriesTableInfoData} = useGetDeliveryTableInfoQuery({line_number: selectedID, company_type: companyType, deleted: 'False'});
    const {data: deliveriesInfoData, isFetching: isFetchingDeliveriesInfoData, error: errorDeliveriesInfoData, refetch: refetchDeliveriesInfoData} = useGetDeliveryInfoQuery({line_number: selectedID, company_type: companyType, deleted: 'False'});

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    useEffect(() => {
        if (componentsAPIUpdate.includes(`deliveriesTableInfoData_${companyType}Table`)) {
            updateAPIData(`deliveriesTableInfoData_${companyType}Table`, refetchDeliveriesTableInfoData)
        } else if (componentsAPIUpdate.includes(`deliveriesInfoData_${companyType}`)) {
            updateAPIData(`deliveriesInfoData_${companyType}`, refetchDeliveriesInfoData)
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
        'arrTransfered': {isRequired: false, type: 'array'},
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['arrTransfered']}}))
        if (isComponentPrepared) {
            if (!isFetchingDeliveriesTableInfoData) {
                if (!errorDeliveriesTableInfoData && deliveriesTableInfoData) {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['arrTransfered']}}))
                    }, 1000)  
                } else {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['arrTransfered']}}))
                    }, 1000)
                }
            }
        }
    }, [isComponentPrepared, deliveriesTableInfoData, isFetchingDeliveriesTableInfoData]);

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
            const myData = {deleted: 'True'}
            await updateDeliveryInfo({...myData, id: currentId}).unwrap()    
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

    return (
        <>
        <BtnBlock>
            {<>
                {selectedLineID && <>
                    <ButtonMain
                        onClick={() => {}}
                        type={'other'}
                        color={'gray'}
                        drop={true}
                        title={'Редактировать'}
                        actions={[
                            {
                                name: "Изменить доставку", 
                                onClick: () => {
                                    const data = deliveriesInfoData?.find(item => item.id === selectedLineID)
                                    if (data) {
                                        dispatch(setModalProps({
                                            componentName: 'AddNewDeliveryModal',
                                            data: {
                                                objInputData: funcConvertToFieldDataType(data),
                                                qtyFieldsForSavingBtn: 0,
                                            }
                                        }))
                                        dispatch(setModalOpen('AddNewDeliveryModal'))
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
                <ButtonMain
                    onClick={() => {
                        dispatch(setModalProps({componentName: 'AddNewDeliveryModal', data: {
                            objChangedData: {
                                line_number: selectedID,
                                company_type: companyType
                            },
                            qtyFieldsForSavingBtn: 2
                        }}))
                        dispatch(setModalOpen('AddNewDeliveryModal'))
                    }}
                    type={'other'}
                    title={'Добавить поставку'}
                    color={'gray'}
                    myStyle={{padding: '0 10px', width: 'auto'}}
                />        
            </>}
        </BtnBlock>

        <ContentBlock myStyleMain={{padding: '0'}} myStyleContent={{display: 'block', height: '300px'}}>
            <DeliveriesInfoTable
                arrData={deliveriesTableInfoData || []}
                isLoading={loadingProcess?.['arrTransfered']}
                funcGetLineID={funcBackSelectedID}
            />               
        </ContentBlock>
    </>
    );
};

export default DeliveriesInfoTableBlock;