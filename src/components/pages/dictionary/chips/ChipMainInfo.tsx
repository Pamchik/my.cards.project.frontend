import BtnBlock from "../../../blocks/BtnBlock";
import ButtonMain from "../../../UI/buttons/ButtonMain";
import ContentBlock from "../../../blocks/ContentBlock";
import { useEffect, useState } from "react";
import { useEffectStoreData } from "../../../hooks/useEffectStoreData";
import { IFieldParams, IInputTypes, ITextareaTypes } from "../../../../store/componentsData/fieldsParamsSlice";
import { useDispatch } from "react-redux";
import { useFieldValueChange } from "../../../hooks/useFieldValueChange";
import { changeComponentReadOnly } from "../../../../store/componentsData/componentsReadOnlySlice";
import { IInputValue, ISelectValue, ITextareaValue, deleteAllComponentData, deleteChangedComponentData, setInputData } from "../../../../store/componentsData/componentsDataSlice";
import { deleteFieldInvalid, setFieldInvalid } from "../../../../store/componentsData/fieldsInvalidSlice";
import { setLoadingStatus } from "../../../../store/componentsData/loadingProcessSlice";
import BlockInput from "../../../UI/fields/BlockInput";
import BlockTextarea from "../../../UI/fields/BlockTextarea";
import { useComponentPreparation } from "../../../hooks/useComponentPreparation";
import BlockSelect from "../../../UI/fields/BlockSelect";
import { funcConvertToFieldDataType } from "../../../functions/funcConvertToFieldDataType";
import LoadingView from "../../../loading/LoadingView";
import { setSavingStatus } from "../../../../store/componentsData/savingProcessSlice";
import { functionErrorMessage } from "../../../functions/functionErrorMessage";
import { funcValidateFields } from "../../../functions/funcValidateFields";
import { deleteComponentsAPIUpdate } from "../../../../store/componentsData/componentsAPIUpdateSlice";
import { useGetChipQuery, useUpdateChipMutation } from "../../../../store/api/chipApiSlice";
import { useGetVendorsQuery } from "../../../../store/api/vendorApiSlice";
import { useAllComponentParamsReset } from "../../../hooks/useComponentDataReset";
import useTimeoutManager from "../../../hooks/useTimeoutManager";

interface IChipMainInfo {
    selectedID: number
}

const ChipMainInfo = ({
    selectedID
}: IChipMainInfo) => {

    const componentName = 'ChipMainInfo'
    const [isComponentPrepared, setIsComponentPrepared] = useState<boolean>(false)
    const { loadingProcess, fieldParams, componentData, componentReadOnly, componentInvalidFields, savingProcess, componentsAPIUpdate } = useEffectStoreData(componentName);
    const componentPreparing = useComponentPreparation(componentName)
    const allComponentParamsReset = useAllComponentParamsReset(componentName)
    const setManagedTimeout = useTimeoutManager(componentName)
    const setValues = useFieldValueChange(componentName)    
    const dispatch = useDispatch()

    const {data: chipData, isFetching: isFetchingChipData, error: errorChipData, refetch: refetchChipData} = useGetChipQuery({id: selectedID})
    const {data: vendorsData, isFetching: isFetchingVendorsData, error: errorVendorsData, refetch: refetchVendorsData} = useGetVendorsQuery(undefined)
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
        } else if (componentsAPIUpdate.includes('vendorsData')) {
            refetchVendorsData()
            dispatch(deleteComponentsAPIUpdate(['vendorsData']))
        }
    }, [componentsAPIUpdate]);

    const initFieldParams: IFieldParams = {
        'short_name': {isRequired: true, type: 'text'},
        'full_name': {isRequired: true, type: 'text'},
        'kmc_test': {isRequired: false, type: 'text'},
        'kcv_test': {isRequired: false, type: 'text'},
        'vendor': {isRequired: true, type: 'number'},
        'other': {isRequired: false, type: 'text'},
        'active': {isRequired: true, type: 'boolean'},
    }

    useEffect(() => {
        if (!isComponentPrepared) {
            componentPreparing({loadingFieldsData: Object.keys(initFieldParams), fieldsParamsData: initFieldParams});
            setIsComponentPrepared(true);
        }
    }, []);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: Object.keys(initFieldParams)}}))
        if (isComponentPrepared) {
            if (!isFetchingChipData) {
                if (!errorChipData && chipData) {
                    const myData = funcConvertToFieldDataType(chipData[0])
                    dispatch(setInputData({componentName, data: myData}))
                    setManagedTimeout(() => {
                        dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: [
                            'short_name', 
                            'full_name',
                            'kmc_test',
                            'kcv_test',
                            'vendor',
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
    }, [selectedID, isComponentPrepared, chipData, isFetchingChipData, isFetchingVendorsData]);

    useEffect(() => {
        dispatch(setLoadingStatus({componentName, data: {status: true, fields: ['vendor']}}))
        if (isComponentPrepared && !isFetchingVendorsData && !isFetchingChipData && !errorChipData) {
            if (!errorVendorsData) {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: true, fields: ['vendor']}}))
                }, 1000) 
            } else {
                setManagedTimeout(() => {
                    dispatch(setLoadingStatus({componentName, data: {status: false, isSuccessful: false, fields: ['vendor']}}))
                }, 1000)
            }
        }
    }, [selectedID, isComponentPrepared, isFetchingChipData, isFetchingVendorsData]);

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
                    fieldName={'short_name'}
                    title={'Короткое название'}
                    type={fieldParams?.['short_name']?.type as IInputTypes}
                    value={componentData?.objInputAndChangedData['short_name'] as IInputValue}
                    placeholder={'Введите название'}
                    skeletonLoading={loadingProcess?.['short_name']}
                    isRequired={fieldParams?.['short_name']?.isRequired}
                    isReadOnly={componentReadOnly?.status}
                    isInvalidStatus={componentInvalidFields?.['short_name']}
                    isChanged={!!componentData?.objChangedData?.['short_name']}
                />
                <BlockInput
                    onChange={(obj) => setValues(obj)}
                    fieldName={'full_name'}
                    title={'Полное название'}
                    type={fieldParams?.['full_name']?.type as IInputTypes}
                    value={componentData?.objInputAndChangedData['full_name'] as IInputValue}
                    placeholder={'Введите название'}
                    skeletonLoading={loadingProcess?.['full_name']}
                    isRequired={fieldParams?.['full_name']?.isRequired}
                    isReadOnly={componentReadOnly?.status}
                    isInvalidStatus={componentInvalidFields?.['full_name']}
                    isChanged={!!componentData?.objChangedData?.['full_name']}
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
                <BlockInput
                    onChange={(obj) => setValues(obj)}
                    fieldName={'kmc_test'}
                    title={'Тестовый KMC'}
                    type={fieldParams?.['kmc_test']?.type as IInputTypes}
                    value={componentData?.objInputAndChangedData['kmc_test'] as IInputValue}
                    placeholder={'Введите KMC'}
                    skeletonLoading={loadingProcess?.['kmc_test']}
                    isRequired={fieldParams?.['kmc_test']?.isRequired}
                    isReadOnly={componentReadOnly?.status}
                    isInvalidStatus={componentInvalidFields?.['kmc_test']}
                    isChanged={!!componentData?.objChangedData?.['kmc_test']}
                />
                <BlockInput
                    onChange={(obj) => setValues(obj)}
                    fieldName={'kcv_test'}
                    title={'Тестовый KCV'}
                    type={fieldParams?.['kcv_test']?.type as IInputTypes}
                    value={componentData?.objInputAndChangedData['kcv_test'] as IInputValue}
                    placeholder={'Введите KCV'}
                    skeletonLoading={loadingProcess?.['kcv_test']}
                    isRequired={fieldParams?.['kcv_test']?.isRequired}
                    isReadOnly={componentReadOnly?.status}
                    isInvalidStatus={componentInvalidFields?.['kcv_test']}
                    isChanged={!!componentData?.objChangedData?.['kcv_test']}
                />
                <BlockSelect
                    fieldName={'vendor'}
                    showName={"name"}
                    title={'Вендор'}
                    value={componentData?.objInputAndChangedData['vendor'] as ISelectValue}
                    options={vendorsData || []}
                    isEmptyOption={true}
                    onChange={(obj) => setValues(obj)}   
                    skeletonLoading={loadingProcess?.['vendor']}
                    isRequired={fieldParams?.['vendor']?.isRequired}  
                    isReadOnly={true} 
                    isInvalidStatus={componentInvalidFields?.['vendor']}   
                    isChanged={!!componentData?.objChangedData?.['vendor']}  
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

export default ChipMainInfo