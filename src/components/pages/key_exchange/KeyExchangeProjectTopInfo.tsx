import { useEffect, useState } from "react";
import { useEffectStoreData } from "../../hooks/useEffectStoreData";
import { useComponentPreparation } from "../../hooks/useComponentPreparation";
import { useFieldValueChange } from "../../hooks/useFieldValueChange";
import { useDispatch } from "react-redux";
import { useGetKeyExchangeQuery, useUpdateKeyExchangeMutation, useUpdateKeyExchangeWithoutReloadingMutation } from "../../../store/api/keyExchangeApiSlice";
import { useGetKeyExchangeStatusesQuery } from "../../../store/api/keyExchangeStatusApiSlice";
import { deleteComponentsAPIUpdate, setComponentsAPIUpdate } from "../../../store/componentsData/componentsAPIUpdateSlice";
import { IFieldParams, IInputTypes } from "../../../store/componentsData/fieldsParamsSlice";
import { setLoadingStatus } from "../../../store/componentsData/loadingProcessSlice";
import { funcConvertToFieldDataType } from "../../functions/funcConvertToFieldDataType";
import { IInputValue, ISelectValue, deleteAllComponentData, deleteChangedComponentData, setInputData } from "../../../store/componentsData/componentsDataSlice";
import { setSavingStatus } from "../../../store/componentsData/savingProcessSlice";
import { funcValidateFields } from "../../functions/funcValidateFields";
import { deleteFieldInvalid, setFieldInvalid } from "../../../store/componentsData/fieldsInvalidSlice";
import { functionErrorMessage } from "../../functions/functionErrorMessage";
import { changeComponentReadOnly } from "../../../store/componentsData/componentsReadOnlySlice";
import { useGetBankQuery } from "../../../store/api/bankApiSlice";
import UrgentIconButton from "../../UI/buttons/UrgentIconButton";
import BlockSelect from "../../UI/fields/BlockSelect";
import ButtonMain from "../../UI/buttons/ButtonMain";
import BlockInput from "../../UI/fields/BlockInput";
import { useAllComponentParamsReset } from "../../hooks/useComponentDataReset";
import useTimeoutManager from "../../hooks/useTimeoutManager";

interface IKeyExchangeProjectTopInfo {
    selectedID: number
}

const KeyExchangeProjectTopInfo = ({
    selectedID
}: IKeyExchangeProjectTopInfo) => {

    const componentName = 'KeyExchangeProjectTopInfo'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const { loadingProcess, fieldParams, componentData, componentReadOnly, componentInvalidFields, savingProcess, componentsAPIUpdate } = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: keyExchangeData, isFetching: isFetchingKeyExchangeData, error: errorKeyExchangeData, refetch: refetchKeyExchangeData} = useGetKeyExchangeQuery({id: selectedID});
    const {data: bankData, isFetching: isFetchingBankData, error: errorBankData, refetch: refetchBankData} = useGetBankQuery(
        {id: keyExchangeData?.[0].bank},
        { 
            skip: !componentData?.objInputAndChangedData['bank'],
            selectFromResult: ({ data, ...other }) => ({
                data: componentData?.objInputAndChangedData['bank'] ? data : [],
                ...other
            })  
        }
    )
    const {data: keyExchangeStatuses, isFetching: isFetchingKeyExchangeStatuses, error: errorKeyExchangeStatuses, refetch: refetchKeyExchangeStatuses} = useGetKeyExchangeStatusesQuery(undefined)
    const [updateKeyExchange, {}] = useUpdateKeyExchangeWithoutReloadingMutation()

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    function funcUpdateData() {
        dispatch(setComponentsAPIUpdate([
            'keyExchangeData',
            'bankData',
            'keyExchangeStatuses',
            'filesData',
            'fileStatusesData',
            'bankEmployeesData',
            'vendorData',
            'vendorEmployeesData',
            'vendorManufacturiesData',
            'changelogData'
        ]))
    }

    useEffect(() => {
        if (componentsAPIUpdate.includes('keyExchangeData')) {
            updateAPIData('keyExchangeData', refetchKeyExchangeData)
        } else if (componentsAPIUpdate.includes('keyExchangeStatuses')) {
            updateAPIData('keyExchangeStatuses', refetchKeyExchangeStatuses)
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
        'title': {isRequired: false, type: 'text'},
        'status': {isRequired: true, type: 'number'}
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

   useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['title']}}))
        if (isComponentPrepared) {
            if (!isFetchingKeyExchangeData && !isFetchingBankData) {
                if (!errorKeyExchangeData && keyExchangeData && !errorBankData) {
                    const myData = funcConvertToFieldDataType(keyExchangeData[0])
                    dispatch(setInputData({componentName, data: myData}))
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: [
                            'title'
                        ]}}))
                    }, 1000)  
                } else {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['title']}}))
                    }, 1000)
                }
            }
        }
    }, [selectedID, isComponentPrepared, keyExchangeData, isFetchingKeyExchangeData, bankData, isFetchingBankData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['status']}}))
        if (isComponentPrepared && !isFetchingKeyExchangeStatuses && !isFetchingKeyExchangeData && !errorKeyExchangeData ) {
            if (!errorKeyExchangeStatuses) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['status']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['status']}}))
                }, 1000)
            }
        }
    }, [selectedID, isComponentPrepared, isFetchingKeyExchangeData, isFetchingKeyExchangeStatuses]);

    useEffect(() => {
        funcChangeCancelSet(true)
    }, [selectedID]);

    useEffect(() => {
        if (isFetchingKeyExchangeData) {
            funcChangeCancelSet(true)
        }
    }, [isFetchingKeyExchangeData]);

    async function funcSaveFields () {
        dispatch(setSavingStatus({componentName, data: {status: true}}))
        const currentId: number = componentData?.objInputAndChangedData['id'] as number
        if (currentId) {
            const isValid = funcValidateFields(fieldParams, componentData?.objInputAndChangedData, componentData?.objChangedData)
            if (isValid.isAllFieldsValid) {
                dispatch(deleteFieldInvalid({componentName}))
                const myData = componentData.objChangedData
                await updateKeyExchange({...myData, id: currentId}).unwrap()    
                .then((res) => {
                    dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: true}}))
                    // dispatch(deleteAllComponentData({componentName}))
                    setValues({name: 'status', value: componentData.objChangedData['status']})
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
    
    async function funcSaveFieldUrgent () {
        dispatch(setSavingStatus({componentName, data: {status: true}}))
        const currentId: number = componentData?.objInputAndChangedData['id'] as number
        if (currentId) {
                const urgentStatus = componentData?.objInputAndChangedData['isUrgent']
                await updateKeyExchange({...{isUrgent: !urgentStatus}, id: currentId}).unwrap()    
                .then((res) => {
                    dispatch(setSavingStatus({componentName, data: {status: true, isSuccessful: true}}))
                    // dispatch(deleteAllComponentData({componentName}))
                    setValues({name: 'isUrgent', value: !urgentStatus})
                    funcChangeCancelSet(true)
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

    function funcChangeCancelSet(newStatus: boolean) {
        // dispatch(deleteChangedComponentData({componentName}))
        dispatch(changeComponentReadOnly({componentName, newStatus}))
        dispatch(deleteFieldInvalid({componentName}))            
    }

    const [number, setNumber] = useState<string | undefined>(undefined)
    useEffect(() => {
        setNumber(componentData?.objInputAndChangedData?.['number'] as string | undefined)
    }, [componentData?.objInputAndChangedData?.['number']]);

    const [bankName, setBankName] = useState<string | undefined>(undefined)
    useEffect(() => {
        setBankName(bankData?.find(item => item.id === componentData?.objInputAndChangedData?.['bank'])?.name_eng as string | undefined)
    }, [bankData, componentData?.objInputAndChangedData?.['bank']]);

    const [title, setTitle] = useState<string>('')
    useEffect(() => {
        setTitle(`${number ? `${number} : ` : ''}${bankName ? `${bankName} ` : ''}`.trim())
    }, [number, bankName]);

    return (<>
        <div className="top-info-block">
            <div className="top-info-block__info">
                <BlockInput
                    onChange={(obj) => setValues(obj)}
                    fieldName={'title'}
                    type={fieldParams?.['title']?.type as IInputTypes}
                    value={title as IInputValue}
                    skeletonLoading={loadingProcess?.['title']}
                    isReadOnly={true}
                    myStyle={{marginTop: '0', marginBottom: '0', marginLeft: '0', marginRight: '0', width: '100%' }}
                    myStyleInput={{fontWeight: '600',  background: 'transparent'}}
                />
            </div>

            <div className="top-info-block__status">
                <UrgentIconButton
                    value={componentData?.objInputAndChangedData['isUrgent'] as boolean | undefined}
                    onClick={() => funcSaveFieldUrgent()}
                />
                <p>Статус</p>
                <BlockSelect
                    fieldName={'status'}
                    showName={"name"}
                    value={componentData?.objInputAndChangedData['status'] as ISelectValue}
                    options={keyExchangeStatuses || []}
                    isEmptyOption={true}
                    onChange={(obj) => setValues(obj)}   
                    skeletonLoading={loadingProcess?.['status']}
                    isRequired={fieldParams?.['status']?.isRequired}  
                    isReadOnly={componentReadOnly?.status} 
                    isInvalidStatus={componentInvalidFields?.['status']}   
                    isChanged={!!componentData?.objChangedData?.['status']}  
                    myStyle={{ width: '200px', textAlignLast: 'center', marginTop: 'auto', marginBottom: 'auto', marginLeft: '10px' }}
                    isSortDisabled={true}
                />
            </div>
            <div className="top-info-block__btn-block">
                { componentReadOnly?.status
                ? 
                    <ButtonMain
                        type={'changeIcon'}
                        onClick={() => funcChangeCancelSet(false)}
                    /> 
                :
                    <>
                        <ButtonMain
                            type={'submitIcon'}
                            onClick={funcSaveFields}
                        />                    
                        <ButtonMain
                            type={'resetIcon'}
                            onClick={() => funcChangeCancelSet(true)}
                        />  
                    </>  
                }    

                <ButtonMain
                    onClick={funcUpdateData}
                    type={'repeatIcon'}
                />
            </div>            
        </div>
    </>)
}

export default KeyExchangeProjectTopInfo