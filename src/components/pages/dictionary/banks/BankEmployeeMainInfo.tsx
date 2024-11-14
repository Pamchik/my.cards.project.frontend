import BtnBlock from "../../../blocks/BtnBlock";
import ButtonMain from "../../../UI/buttons/ButtonMain";
import ContentBlock from "../../../blocks/ContentBlock";
import { useEffect, useState } from "react";
import { useEffectStoreData } from "../../../hooks/useEffectStoreData";
import { useComponentPreparation } from "../../../hooks/useComponentPreparation";
import { useFieldValueChange } from "../../../hooks/useFieldValueChange";
import { useDispatch } from "react-redux";
import { IFieldParams, IInputTypes, ITextareaTypes } from "../../../../store/componentsData/fieldsParamsSlice";
import { setLoadingStatus } from "../../../../store/componentsData/loadingProcessSlice";
import { funcConvertToFieldDataType } from "../../../functions/funcConvertToFieldDataType";
import { IInputValue, ISelectValue, ITextareaValue, deleteAllComponentData, deleteChangedComponentData, setInputData } from "../../../../store/componentsData/componentsDataSlice";
import { setSavingStatus } from "../../../../store/componentsData/savingProcessSlice";
import { funcValidateFields } from "../../../functions/funcValidateFields";
import { deleteFieldInvalid, setFieldInvalid } from "../../../../store/componentsData/fieldsInvalidSlice";
import { functionErrorMessage } from "../../../functions/functionErrorMessage";
import { changeComponentReadOnly } from "../../../../store/componentsData/componentsReadOnlySlice";
import LoadingView from "../../../loading/LoadingView";
import BlockInput from "../../../UI/fields/BlockInput";
import BlockTextarea from "../../../UI/fields/BlockTextarea";
import { deleteComponentsAPIUpdate } from "../../../../store/componentsData/componentsAPIUpdateSlice";
import { useGetBankEmployeeQuery, useUpdateBankEmployeeMutation } from "../../../../store/api/bankEmployeeApiSlice";
import BlockSelect from "../../../UI/fields/BlockSelect";
import { useAllComponentParamsReset } from "../../../hooks/useComponentDataReset";
import useTimeoutManager from "../../../hooks/useTimeoutManager";


interface IBankEmployeeMainInfo {
    selectedID: number,
}

const BankEmployeeMainInfo = ({
    selectedID,
}: IBankEmployeeMainInfo) => {

    const componentName = 'BankEmployeeMainInfo'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const {loadingProcess, fieldParams, componentData, componentReadOnly, componentInvalidFields, savingProcess, componentsAPIUpdate} = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: bankEmployeeData, isFetching: isFetchingBankEmployeeData, error: errorBankEmployeeData, refetch: refetchBankEmployeeData} = useGetBankEmployeeQuery({id: selectedID})
    const [updateBankEmployee, {}] = useUpdateBankEmployeeMutation()

    useEffect(() => {
        return () => {
            allComponentParamsReset()
        }
    }, []);

    useEffect(() => {
        if (componentsAPIUpdate.includes('bankEmployeeData')) {
            refetchBankEmployeeData()
            funcChangeCancelSet(true)
            dispatch(deleteComponentsAPIUpdate(['bankEmployeeData']))
        }
    }, [componentsAPIUpdate]);

    const initFieldParams: IFieldParams = {
        'name': {isRequired: true, type: 'text'},
        'email': {isRequired: false, type: 'email'},
        'phone': {isRequired: false, type: 'phone'},
        'other': {isRequired: false, type: 'text'},
        'active': {isRequired: true, type: 'boolean'},
    }

    useEffect(() => {
        componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
        setIsComponentPrepared(true);
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: Object.keys(initFieldParams)}}))
        if (isComponentPrepared) {
            if (!isFetchingBankEmployeeData) {
                if (!errorBankEmployeeData && bankEmployeeData) {
                    const myData = funcConvertToFieldDataType(bankEmployeeData[0])
                    dispatch(setInputData({componentName, data: myData}))
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: [
                            'name', 
                            'email',
                            'phone',
                            'other',
                            'active'
                        ]}}))
                    }, 1000)  
                } else {
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: Object.keys(initFieldParams)}}))
                    }, 1000)
                }
            }
        }
    }, [selectedID, isComponentPrepared, bankEmployeeData, isFetchingBankEmployeeData]);

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
                await updateBankEmployee({...myData, id: currentId}).unwrap()    
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

    function funcChangeCancelSet (newStatus: boolean) {
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

            <ContentBlock>
                <BlockInput
                    onChange={(obj) => setValues(obj)}
                    fieldName={'name'}
                    title={'Имя сотрудника'}
                    type={fieldParams?.['name']?.type as IInputTypes}
                    value={componentData?.objInputAndChangedData['name'] as IInputValue}
                    placeholder={'Введите имя сотрудника'}
                    skeletonLoading={loadingProcess?.['name']}
                    isRequired={fieldParams?.['name']?.isRequired}
                    isReadOnly={componentReadOnly?.status}
                    isInvalidStatus={componentInvalidFields?.['name']}
                    isChanged={!!componentData?.objChangedData?.['name']}
                />
                <BlockInput
                    onChange={(obj) => setValues(obj)}
                    fieldName={'email'}
                    title={'Почта'}
                    type={fieldParams?.['email']?.type as IInputTypes}
                    value={componentData?.objInputAndChangedData['email'] as IInputValue}
                    placeholder={'Введите почту сотрудника'}
                    skeletonLoading={loadingProcess?.['email']}
                    isRequired={fieldParams?.['email']?.isRequired}
                    isReadOnly={componentReadOnly?.status}
                    isInvalidStatus={componentInvalidFields?.['email']}
                    isChanged={!!componentData?.objChangedData?.['email']}
                />                
                <BlockInput
                    onChange={(obj) => setValues(obj)}
                    fieldName={'phone'}
                    title={'Номер телефона'}
                    type={fieldParams?.['phone']?.type as IInputTypes}
                    value={componentData?.objInputAndChangedData['phone'] as IInputValue}
                    placeholder={'Введите номер'}
                    skeletonLoading={loadingProcess?.['phone']}
                    isRequired={fieldParams?.['phone']?.isRequired}
                    isReadOnly={componentReadOnly?.status}
                    isInvalidStatus={componentInvalidFields?.['phone']}
                    isChanged={!!componentData?.objChangedData?.['phone']}
                />
                <BlockTextarea
                    onChange={(obj) => setValues(obj)}
                    fieldName={'other'}
                    title={'Другое'}
                    type={fieldParams?.['other']?.type as ITextareaTypes}
                    value={componentData?.objInputAndChangedData['other'] as ITextareaValue}
                    placeholder={'Введите комментарий'}
                    skeletonLoading={loadingProcess?.['other']}
                    isRequired={fieldParams?.['other']?.isRequired}
                    isReadOnly={componentReadOnly?.status}
                    isInvalidStatus={componentInvalidFields?.['other']}
                    isChanged={!!componentData?.objChangedData?.['other']}
                    rows={3}
                />
                <BlockSelect
                    fieldName={'active'}
                    showName={"name"}
                    title={'Статус'}
                    value={componentData?.objInputAndChangedData['active'] as ISelectValue ? 1 : 2 }
                    options={[{id: 1, name: 'Активный'}, {id: 2, name: 'В архиве'}]}
                    isEmptyOption={false}
                    onChange={(obj) => setValues({name: obj.name, value: obj.value === 1 ? true : false})}   
                    skeletonLoading={loadingProcess?.['active']}
                    isRequired={fieldParams?.['active']?.isRequired}  
                    isReadOnly={componentReadOnly?.status} 
                    isInvalidStatus={componentInvalidFields?.['active']}   
                    isChanged={!!componentData?.objChangedData?.['active']}  
                />
            </ContentBlock>
        </>)}
    </>)
}

export default BankEmployeeMainInfo