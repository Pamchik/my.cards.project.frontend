import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import BtnBlock from "../../../../../blocks/BtnBlock";
import ButtonMain from "../../../../../UI/buttons/ButtonMain";
import LoadingView from "../../../../../loading/LoadingView";
import ContentBlock from "../../../../../blocks/ContentBlock";
import BlockInput from "../../../../../UI/fields/BlockInput";
import { IFieldParams, IInputTypes, ITextareaTypes } from "../../../../../../store/componentsData/fieldsParamsSlice";
import { deleteAllComponentData, deleteChangedComponentData, IInputValue, ISelectValue, ITextareaValue, setInputData } from "../../../../../../store/componentsData/componentsDataSlice";
import { useEffectStoreData } from "../../../../../hooks/useEffectStoreData";
import { useComponentPreparation } from "../../../../../hooks/useComponentPreparation";
import { useAllComponentParamsReset } from "../../../../../hooks/useComponentDataReset";
import useTimeoutManager from "../../../../../hooks/useTimeoutManager";
import { useFieldValueChange } from "../../../../../hooks/useFieldValueChange";
import { deleteComponentsAPIUpdate } from "../../../../../../store/componentsData/componentsAPIUpdateSlice";
import { setLoadingStatus } from "../../../../../../store/componentsData/loadingProcessSlice";
import { funcConvertToFieldDataType } from "../../../../../functions/funcConvertToFieldDataType";
import { setSavingStatus } from "../../../../../../store/componentsData/savingProcessSlice";
import { funcValidateFields } from "../../../../../functions/funcValidateFields";
import { deleteFieldInvalid, setFieldInvalid } from "../../../../../../store/componentsData/fieldsInvalidSlice";
import { functionErrorMessage } from "../../../../../functions/functionErrorMessage";
import { changeComponentReadOnly } from "../../../../../../store/componentsData/componentsReadOnlySlice";
import BlockTextarea from "../../../../../UI/fields/BlockTextarea";
import BlockSelect from "../../../../../UI/fields/BlockSelect";
import { useGetBankBIDsQuery } from "../../../../../../store/api/bankBIDApiSlice";
import { useGetProjectQuery } from "../../../../../../store/api/projectsApiSlice";
import { useAddPaymentSystemApprovalMutation, useGetPaymentSystemApprovalQuery, useUpdatePaymentSystemApprovalMutation } from "../../../../../../store/api/paymentSystemApprovalApiSlice";



interface IPaymentSystemData {
    selectedID: number
}

const PaymentSystemData = ({
    selectedID,
}: IPaymentSystemData) => {

    const componentName = 'PaymentSystemData'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const { loadingProcess, fieldParams, componentData, componentReadOnly, componentInvalidFields, savingProcess, componentsAPIUpdate } = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: paymentSystemApprovalData, isFetching: isFetchingPaymentSystemApprovalData, error: errorPaymentSystemApprovalData, refetch: refetchPaymentSystemApprovalData} = useGetPaymentSystemApprovalQuery({line_number: selectedID});
    const {data: projectData, isFetching: isFetchingProjectData, error: errorProjectData, refetch: refetchProjectData} = useGetProjectQuery({id: selectedID});
    const {data: bankBIDsData, isFetching: isFetchingBankBIDsData, error: errorBankBIDsData, refetch: refetchBankBIDsData} = useGetBankBIDsQuery(
        { bank: projectData?.[0].bank as number },
        {
            skip: !projectData?.[0].bank,
            selectFromResult: ({ data, ...other }) => ({
                data: projectData?.[0].bank ? data : [],
                ...other
            })
        }
    )

    const [updatePaymentSystemApproval, {}] = useUpdatePaymentSystemApprovalMutation()
    const [addPaymentSystemApproval, {}] = useAddPaymentSystemApprovalMutation()

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);
    
    useEffect(() => {
        if (componentsAPIUpdate.includes('paymentSystemApprovalData')) {
            updateAPIData('paymentSystemApprovalData', refetchPaymentSystemApprovalData)
        } else if (componentsAPIUpdate.includes('bankBIDsData')) {
            updateAPIData('bankBIDsData', refetchBankBIDsData)
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
        'number': {isRequired: false, type: 'text'},
        'approval_date': {isRequired: false, type: 'date'},
        'other': {isRequired: false, type: 'text'},
        'bid': {isRequired: false, type: 'number'},
        'bin': {isRequired: false, type: 'text'},
        'range_low': {isRequired: false, type: 'text'},
        'range_high': {isRequired: false, type: 'text'},
        'program_name': {isRequired: false, type: 'text'},
        'full_name_in_ps': {isRequired: false, type: 'text'},
        'requested_date': {isRequired: false, type: 'date'},
        'received_date': {isRequired: false, type: 'date'},
        'posted_date': {isRequired: false, type: 'date'},
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: Object.keys(initFieldParams)}}))
        if (isComponentPrepared) {
            if (!isFetchingPaymentSystemApprovalData) {
                if (!errorPaymentSystemApprovalData && paymentSystemApprovalData) {
                    const myData = funcConvertToFieldDataType(paymentSystemApprovalData[0])
                    dispatch(setInputData({componentName, data: myData}))
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
    }, [selectedID, isComponentPrepared, paymentSystemApprovalData, isFetchingPaymentSystemApprovalData]); 

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['bid']}}))
        if (isComponentPrepared) {
            if (!isFetchingBankBIDsData && !isFetchingPaymentSystemApprovalData && !errorPaymentSystemApprovalData) {
                if (!errorBankBIDsData && bankBIDsData) {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['bid']}}))
                    }, 1000)  
                } else {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['bid']}}))
                    }, 1000)
                }
            }
        }
    }, [selectedID, isComponentPrepared, bankBIDsData, isFetchingBankBIDsData, isFetchingPaymentSystemApprovalData]); 

    useEffect(() => {
        funcChangeCancelSet(true)
    }, [selectedID]);

    useEffect(() => {
        if (isFetchingBankBIDsData) {
            funcChangeCancelSet(true)
        }
    }, [isFetchingBankBIDsData]);

    async function funcSaveFields () {
        dispatch(setSavingStatus({componentName, data: {status: true}}))
        const currentId: number = componentData?.objInputAndChangedData['id'] as number
        const isValid = funcValidateFields(fieldParams, componentData?.objInputAndChangedData, componentData?.objChangedData)
        if (currentId) {
            if (isValid.isAllFieldsValid) {
                dispatch(deleteFieldInvalid({componentName}))
                const myData = componentData.objChangedData
                await updatePaymentSystemApproval({...myData, id: currentId}).unwrap()    
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
            if (isValid.isAllFieldsValid) {
                dispatch(deleteFieldInvalid({componentName}))
                const myData = componentData.objChangedData
                await addPaymentSystemApproval({...myData, line_number: selectedID}).unwrap()    
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
        }
    }     

    function funcChangeCancelSet(newStatus: boolean) {
        dispatch(deleteChangedComponentData({componentName}))
        dispatch(changeComponentReadOnly({componentName, newStatus}))
        dispatch(deleteFieldInvalid({componentName}))            
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

            {savingProcess?.status && 
                <LoadingView 
                    isSuccessful={savingProcess.isSuccessful} 
                    errorMessage={savingProcess.message} 
                    componentName={componentName} 
                />
            } 
            <ContentBlock myStyleMain={{flex: '0 0 auto'}} myStyleContent={{display: 'flex', flexDirection: 'row'}}>
                <ContentBlock title={'Данные по размещению:'} myStyleMain={{minWidth: '40%'}} line={true}>
                    <BlockInput
                        onChange={(obj) => setValues(obj)}
                        fieldName={'number'}
                        title={'Номер размещения в МПС'}
                        type={fieldParams?.['number']?.type as IInputTypes}
                        value={componentData?.objInputAndChangedData['number'] as IInputValue}
                        placeholder={'Введите номер размещения'}
                        skeletonLoading={loadingProcess?.['number']}
                        isRequired={fieldParams?.['number']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['number']}
                        isChanged={!!componentData?.objChangedData?.['number']}
                    ></BlockInput>
                    <BlockInput
                        onChange={(obj) => setValues(obj)}
                        fieldName={'posted_date'}
                        title={'Дата размещения в МПС'}
                        type={fieldParams?.['posted_date']?.type as IInputTypes}
                        value={componentData?.objInputAndChangedData['posted_date'] as IInputValue}
                        placeholder={''}
                        skeletonLoading={loadingProcess?.['posted_date']}
                        isRequired={fieldParams?.['posted_date']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['posted_date']}
                        isChanged={!!componentData?.objChangedData?.['posted_date']}
                    ></BlockInput>
                    <BlockInput
                        onChange={(obj) => setValues(obj)}
                        fieldName={'approval_date'}
                        title={'Дата согласования'}
                        type={fieldParams?.['approval_date']?.type as IInputTypes}
                        value={componentData?.objInputAndChangedData['approval_date'] as IInputValue}
                        placeholder={''}
                        skeletonLoading={loadingProcess?.['approval_date']}
                        isRequired={fieldParams?.['approval_date']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['approval_date']}
                        isChanged={!!componentData?.objChangedData?.['approval_date']}
                    ></BlockInput>
                    <BlockTextarea
                        onChange={(obj) => setValues(obj)}
                        fieldName={'other'}
                        title={'Комментарий'}
                        type={fieldParams?.['other']?.type as ITextareaTypes}
                        value={componentData?.objInputAndChangedData['other'] as ITextareaValue}
                        placeholder={'Введите комментарий'}
                        skeletonLoading={loadingProcess?.['other']}
                        isRequired={fieldParams?.['other']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['other']}
                        isChanged={!!componentData?.objChangedData?.['other']}
                        rows={6}
                    ></BlockTextarea>
                </ContentBlock>
                <ContentBlock title={'Данные по запросу:'} myStyleMain={{minWidth: '20%'}} line={true}>
                    <BlockInput
                        onChange={(obj) => setValues(obj)}
                        fieldName={'requested_date'}
                        title={'Дата запроса данных'}
                        type={fieldParams?.['requested_date']?.type as IInputTypes}
                        value={componentData?.objInputAndChangedData['requested_date'] as IInputValue}
                        placeholder={''}
                        skeletonLoading={loadingProcess?.['requested_date']}
                        isRequired={fieldParams?.['requested_date']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['requested_date']}
                        isChanged={!!componentData?.objChangedData?.['requested_date']}
                    ></BlockInput>
                    <BlockInput
                        onChange={(obj) => setValues(obj)}
                        fieldName={'received_date'}
                        title={'Дата получения данных'}
                        type={fieldParams?.['received_date']?.type as IInputTypes}
                        value={componentData?.objInputAndChangedData['received_date'] as IInputValue}
                        placeholder={''}
                        skeletonLoading={loadingProcess?.['received_date']}
                        isRequired={fieldParams?.['received_date']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['received_date']}
                        isChanged={!!componentData?.objChangedData?.['received_date']}
                    ></BlockInput>
                </ContentBlock>
                <ContentBlock title={'Данные для размещения:'} myStyleMain={{minWidth: '40%'}}>
                    <BlockSelect
                        fieldName={'bid'}
                        showName={"number"}
                        title={'BID Банка'}
                        value={componentData?.objInputAndChangedData['bid'] as ISelectValue}
                        options={bankBIDsData || []}
                        isEmptyOption={true}
                        onChange={(obj) => setValues(obj)}   
                        skeletonLoading={loadingProcess?.['bid']}
                        isRequired={fieldParams?.['bid']?.isRequired}  
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['bid']}   
                        isChanged={!!componentData?.objChangedData?.['bid']}  
                    ></BlockSelect>
                    <BlockInput
                        onChange={(obj) => setValues(obj)}
                        fieldName={'bin'}
                        title={'BIN Карты'}
                        type={fieldParams?.['bin']?.type as IInputTypes}
                        value={componentData?.objInputAndChangedData['bin'] as IInputValue}
                        placeholder={'Введите BIN карты'}
                        skeletonLoading={loadingProcess?.['bin']}
                        isRequired={fieldParams?.['bin']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['bin']}
                        isChanged={!!componentData?.objChangedData?.['bin']}
                    ></BlockInput>
                    <BlockInput
                        onChange={(obj) => setValues(obj)}
                        fieldName={'range_low'}
                        title={'Самый низкий ранг'}
                        type={fieldParams?.['range_low']?.type as IInputTypes}
                        value={componentData?.objInputAndChangedData['range_low'] as IInputValue}
                        placeholder={'Введите число'}
                        skeletonLoading={loadingProcess?.['range_low']}
                        isRequired={fieldParams?.['range_low']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['range_low']}
                        isChanged={!!componentData?.objChangedData?.['range_low']}
                    ></BlockInput>
                    <BlockInput
                        onChange={(obj) => setValues(obj)}
                        fieldName={'range_high'}
                        title={'Самый высокий ранг'}
                        type={fieldParams?.['range_high']?.type as IInputTypes}
                        value={componentData?.objInputAndChangedData['range_high'] as IInputValue}
                        placeholder={'Введите число'}
                        skeletonLoading={loadingProcess?.['range_high']}
                        isRequired={fieldParams?.['range_high']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['range_high']}
                        isChanged={!!componentData?.objChangedData?.['range_high']}
                    ></BlockInput>
                    <BlockInput
                        onChange={(obj) => setValues(obj)}
                        fieldName={'program_name'}
                        title={'Программа (credit/debit)'}
                        type={fieldParams?.['program_name']?.type as IInputTypes}
                        value={componentData?.objInputAndChangedData['program_name'] as IInputValue}
                        placeholder={'Введите программу'}
                        skeletonLoading={loadingProcess?.['program_name']}
                        isRequired={fieldParams?.['program_name']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['program_name']}
                        isChanged={!!componentData?.objChangedData?.['program_name']}
                    ></BlockInput>
                    <BlockInput
                        onChange={(obj) => setValues(obj)}
                        fieldName={'full_name_in_ps'}
                        title={'Полное название карты, как указано в платежной системе'}
                        type={fieldParams?.['full_name_in_ps']?.type as IInputTypes}
                        value={componentData?.objInputAndChangedData['full_name_in_ps'] as IInputValue}
                        placeholder={'Введите название'}
                        skeletonLoading={loadingProcess?.['full_name_in_ps']}
                        isRequired={fieldParams?.['full_name_in_ps']?.isRequired}
                        isReadOnly={componentReadOnly?.status}
                        isInvalidStatus={componentInvalidFields?.['full_name_in_ps']}
                        isChanged={!!componentData?.objChangedData?.['full_name_in_ps']}
                    ></BlockInput>
                </ContentBlock>
            </ContentBlock>
        </>)}
    </>)
}


export default PaymentSystemData