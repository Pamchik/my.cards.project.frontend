import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useGetProjectQuery } from "../../../../../../store/api/projectsApiSlice";
import { useGetDeliveriesInfoQuery } from "../../../../../../store/api/deliveryInfoApiSlice";
import { useComponentPreparation } from "../../../../../hooks/useComponentPreparation";
import { useAllComponentParamsReset } from "../../../../../hooks/useComponentDataReset";
import useTimeoutManager from "../../../../../hooks/useTimeoutManager";
import { useFieldValueChange } from "../../../../../hooks/useFieldValueChange";
import { IFieldParams, IInputTypes } from "../../../../../../store/componentsData/fieldsParamsSlice";
import { useEffectStoreData } from "../../../../../hooks/useEffectStoreData";
import { deleteChangedComponentData, IInputValue } from "../../../../../../store/componentsData/componentsDataSlice";
import { changeComponentReadOnly } from "../../../../../../store/componentsData/componentsReadOnlySlice";
import { deleteFieldInvalid } from "../../../../../../store/componentsData/fieldsInvalidSlice";
import BtnBlock from "../../../../../blocks/BtnBlock";
import ContentBlock from "../../../../../blocks/ContentBlock";
import BlockInput from "../../../../../UI/fields/BlockInput";
import { setLoadingStatus } from "../../../../../../store/componentsData/loadingProcessSlice";
import { deleteComponentsAPIUpdate } from "../../../../../../store/componentsData/componentsAPIUpdateSlice";
import { funcNumberWithThousandSeparator } from "../../../../../functions/funcNumberWithThousandSeparator";


interface IDeliveryToBankInfoData {
    selectedID: number
}

const DeliveryToBankInfo = ({
    selectedID,
}: IDeliveryToBankInfoData) => {

    const componentName = 'DeliveryToBankInfo'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const { loadingProcess, fieldParams, componentData, componentReadOnly, componentInvalidFields, savingProcess, componentsAPIUpdate } = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()


    const {data: projectData, isFetching: isFetchingProjectData, error: errorProjectData, refetch: refetchProjectData} = useGetProjectQuery({id: selectedID});
    const {data: deliveriesInfoData, isFetching: isFetchingDeliveriesInfoData, error: errorDeliveriesInfoData, refetch: refetchDeliveriesInfoData} = useGetDeliveriesInfoQuery({line_number: selectedID, company_type: 'bank', deleted: 'False'});

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);
    
    useEffect(() => {
        if (componentsAPIUpdate.includes('projectData')) {
            updateAPIData('projectData', refetchProjectData)
        }  else if (componentsAPIUpdate.includes('deliveriesBankInfoData')) {
            updateAPIData('deliveriesBankInfoData', refetchDeliveriesInfoData)
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
        'qty': {isRequired: false, type: 'text'},
        'qty_sent': {isRequired: false, type: 'text'},
        'deviation': {isRequired: false, type: 'number'},
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: Object.keys(initFieldParams)}}))
        if (isComponentPrepared) {
            if (!isFetchingProjectData && !isFetchingDeliveriesInfoData) {
                if (!errorProjectData && projectData && !errorDeliveriesInfoData && deliveriesInfoData) {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: Object.keys(initFieldParams)}}))
                    }, 1000)  
                } else {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: Object.keys(initFieldParams)}}))
                    }, 1000)
                }
            }
        }
    }, [selectedID, isComponentPrepared, projectData, deliveriesInfoData, isFetchingProjectData, isFetchingDeliveriesInfoData]); 

    useEffect(() => {
        funcChangeCancelSet(true)
    }, [selectedID]);

    useEffect(() => {
        if (isFetchingProjectData || isFetchingDeliveriesInfoData) {
            funcChangeCancelSet(true)
        }
    }, [isFetchingProjectData, isFetchingDeliveriesInfoData]);

    function funcChangeCancelSet(newStatus: boolean) {
        dispatch(deleteChangedComponentData({componentName}))
        dispatch(changeComponentReadOnly({componentName, newStatus}))
        dispatch(deleteFieldInvalid({componentName}))            
    }

    const [totalSentQty, setTotalSentQty] = useState<string>('0')
    const [totalSentIntQty, setTotalSentIntQty] = useState<number>(0)
    useEffect(() => {
        if (deliveriesInfoData && deliveriesInfoData.length > 0) {
            const totalQty = deliveriesInfoData.filter(item => (
                                item.quantity !== null
                            )).reduce((total, payment) => total + (payment.quantity || 0), 0)
            setTotalSentIntQty(totalQty)
            setTotalSentQty(
                funcNumberWithThousandSeparator(totalQty)
            ) 
                          
        } else {
            setTotalSentQty('0')
        }
  
    }, [deliveriesInfoData]);

    const [deviation, setDeviation] = useState<number | ''>('')
    useEffect(() => {
        if (projectData && projectData.length > 0 && projectData[0].product_qty_from_bank) {
            const percent = Math.round(+totalSentIntQty / +projectData[0].product_qty_from_bank * 100)
            setDeviation((100 - percent) * -1)
        }
    }, [totalSentIntQty, projectData]);

    const [bankQty, setBankQty] = useState<string>('0')
    useEffect(() => {
        if (projectData && projectData[0]?.product_qty_from_bank) {
            setBankQty(funcNumberWithThousandSeparator(projectData[0].product_qty_from_bank))
        } else {
            setBankQty('0')
        }
    }, [projectData]);

    return (<>
        {isComponentPrepared && (<>
            <BtnBlock>
            </BtnBlock>

            <ContentBlock myStyleMain={{flex: '0 0 auto'}} myStyleContent={{display: 'flex', flexDirection: 'row'}}>
                <ContentBlock title={'Данные по количеству:'} myStyleMain={{maxWidth: '50%'}} line={true}>
                    <BlockInput
                        onChange={() => {}}
                        fieldName={'qty'}
                        title={'Количество запрошенных карт'}
                        type={fieldParams?.['qty']?.type as IInputTypes}
                        value={bankQty}
                        placeholder={''}
                        skeletonLoading={loadingProcess?.['qty']}
                        isReadOnly={true}
                    />   
                    <BlockInput
                        onChange={() => {}}
                        fieldName={'qty_sent'}
                        title={'Количество отправленных карт'}
                        type={fieldParams?.['qty_sent']?.type as IInputTypes}
                        value={totalSentQty}
                        placeholder={''}
                        skeletonLoading={loadingProcess?.['qty_sent']}
                        isReadOnly={true}
                    />   
                    <BlockInput
                        onChange={() => {}}
                        fieldName={'deviation'}
                        title={'Фактическое отклонение %'}
                        type={fieldParams?.['deviation']?.type as IInputTypes}
                        value={deviation}
                        placeholder={''}
                        skeletonLoading={loadingProcess?.['deviation']}
                        isReadOnly={true}
                    />                  
                </ContentBlock>
            </ContentBlock>
        </>)}
    </>)
}


export default DeliveryToBankInfo