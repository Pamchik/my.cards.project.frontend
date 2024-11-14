import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useEffectStoreData } from '../../../../../hooks/useEffectStoreData';
import { useComponentPreparation } from '../../../../../hooks/useComponentPreparation';
import { useAllComponentParamsReset } from '../../../../../hooks/useComponentDataReset';
import useTimeoutManager from '../../../../../hooks/useTimeoutManager';
import { deleteComponentsAPIUpdate } from '../../../../../../store/componentsData/componentsAPIUpdateSlice';
import { IFieldParams } from '../../../../../../store/componentsData/fieldsParamsSlice';
import { setLoadingStatus } from '../../../../../../store/componentsData/loadingProcessSlice';
import BtnBlock from '../../../../../blocks/BtnBlock';
import ButtonMain from '../../../../../UI/buttons/ButtonMain';
import { setModalProps } from '../../../../../../store/modalData/modalsPropsDataSlice';
import { setModalOpen } from '../../../../../../store/modalData/modalsSlice';
import ContentBlock from '../../../../../blocks/ContentBlock';
import { useGetPaymentsInfoQuery, useGetPaymentsInfoTableQuery, useUpdatePaymentInfoMutation } from '../../../../../../store/api/paymentInfoApiSlice';
import PaymentsInfoTable from '../../../../../tables/PaymentsInfoTable';
import { funcConvertToFieldDataType } from '../../../../../functions/funcConvertToFieldDataType';
import { setSavingStatus } from '../../../../../../store/componentsData/savingProcessSlice';
import { deleteFieldInvalid } from '../../../../../../store/componentsData/fieldsInvalidSlice';
import { deleteAllComponentData } from '../../../../../../store/componentsData/componentsDataSlice';
import { functionErrorMessage } from '../../../../../functions/functionErrorMessage';

interface IPaymentsInfoTableBlock {
    selectedID: number
    companyType: string
}

const PaymentsInfoTableBlock = ({
    selectedID,
    companyType,
}: IPaymentsInfoTableBlock) => {

    const componentName = 'PaymentsInfoTableBlock'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const { loadingProcess, componentsAPIUpdate } = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const dispatch = useDispatch()

    const [updatePaymentInfo, {}] = useUpdatePaymentInfoMutation()

    const {data: paymentsInfoTableData, isFetching: isFetchingPaymentsInfoTableData, error: errorPaymentsInfoTableData, refetch: refetchPaymentsInfoTableData} = useGetPaymentsInfoTableQuery({line_number: selectedID, company_type: companyType, deleted: 'False'});
    const {data: paymentsInfoData, isFetching: isFetchingPaymentsInfoData, error: errorPaymentsInfoData, refetch: refetchPaymentsInfoData} = useGetPaymentsInfoQuery({line_number: selectedID, company_type: companyType, deleted: 'False'});

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    useEffect(() => {
        if (componentsAPIUpdate.includes(`paymentsInfoTableData_${companyType}Table`)) {
            updateAPIData(`paymentsInfoTableData_${companyType}Table`, refetchPaymentsInfoTableData)
        } else if (componentsAPIUpdate.includes(`paymentsInfoData_${companyType}`)) {
            updateAPIData(`paymentsInfoData_${companyType}`, refetchPaymentsInfoData)
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
        'arrPayments': {isRequired: false, type: 'array'},
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['arrPayments']}}))
        if (isComponentPrepared) {
            if (!isFetchingPaymentsInfoTableData) {
                if (!errorPaymentsInfoTableData && paymentsInfoTableData) {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['arrPayments']}}))
                    }, 1000)  
                } else {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['arrPayments']}}))
                    }, 1000)
                }
            }
        }
    }, [isComponentPrepared, paymentsInfoTableData, isFetchingPaymentsInfoTableData]);

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
            await updatePaymentInfo({...myData, id: currentId}).unwrap()    
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
                                name: "Изменить оплату", 
                                onClick: () => {
                                    const data = paymentsInfoData?.find(item => item.id === selectedLineID)
                                    if (data) {
                                        dispatch(setModalProps({
                                            componentName: 'AddNewPaymentModal',
                                            data: {
                                                objInputData: funcConvertToFieldDataType(data),
                                                qtyFieldsForSavingBtn: 0,
                                            }
                                        }))
                                        dispatch(setModalOpen('AddNewPaymentModal'))
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
                        dispatch(setModalProps({componentName: 'AddNewPaymentModal', data: {
                            objChangedData: {
                                line_number: selectedID,
                                company_type: companyType,
                            },
                            qtyFieldsForSavingBtn: 2,
                        }}))
                        dispatch(setModalOpen('AddNewPaymentModal'))
                    }}
                    type={'other'}
                    title={'Добавить оплату'}
                    color={'gray'}
                    myStyle={{padding: '0 10px', width: 'auto'}}
                />        
            </>}
        </BtnBlock>

        <ContentBlock myStyleMain={{padding: '0'}} myStyleContent={{display: 'block', height: '300px'}}>
            <PaymentsInfoTable
                arrData={paymentsInfoTableData || []}
                isLoading={loadingProcess?.['arrPayments']}
                funcGetLineID={funcBackSelectedID}
            />               
        </ContentBlock>
    </>
    );
};

export default PaymentsInfoTableBlock;